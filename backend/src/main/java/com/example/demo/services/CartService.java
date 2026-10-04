package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.CartItemRequestDTO;
import com.example.demo.model.dto.CartItemUpdateDTO;
import com.example.demo.model.dto.PaymentRequestDTO;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    @Autowired private UserRepo userRepository;
    @Autowired private CartRepo cartRepository;
    @Autowired private CartItemRepo cartItemRepository;
    @Autowired private TicketTypeRepo ticketTypeRepository;
    @Autowired private BookingRepo bookingRepository;
    @Autowired private PaymentDetailsRepo paymentRepository;
    @Autowired private ReceiptRepo receiptRepository;

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserUserId(user.getUserId())
                .orElseGet(() -> cartRepository.save(new Cart(null, user, new ArrayList<>())));
    }

    @Transactional
    public CartItem addToCart(String userEmail, CartItemRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        TicketType ticketType = ticketTypeRepository.findById(dto.getTicketTypeId()).orElseThrow(() -> new RuntimeException("Ticket type not found"));
        if (dto.getQuantity() <= 0 || dto.getQuantity() > ticketType.getAvailableQuantity()) {
            throw new RuntimeException("Invalid or unavailable quantity requested");
        }

        // Check if item already in cart, if so, update quantity. Otherwise, add new.
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getTicketType().getId().equals(dto.getTicketTypeId()))
                .findFirst()
                .orElse(new CartItem());

        if(item.getId() == null) { // New item
            item.setCart(cart);
            item.setTicketType(ticketType);
            item.setQuantity(dto.getQuantity());
            cart.getItems().add(item);
        } else { // Existing item
            item.setQuantity(item.getQuantity() + dto.getQuantity());
        }

        return cartItemRepository.save(item);
    }

    public List<CartItem> getCartItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateCart(user).getItems();
    }

    // NEW: Update quantity of an item in the cart.
    @Transactional
    public CartItem updateCartItem(String userEmail, Long itemId, CartItemUpdateDTO dto) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found in user's cart"));

        if (dto.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be positive.");
        }
        if (dto.getQuantity() > item.getTicketType().getAvailableQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }
        item.setQuantity(dto.getQuantity());
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeCartItem(String userEmail, Long itemId) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item); // orphanRemoval=true also handles this
        cartRepository.save(cart);
    }


    // REFACTORED: Complete rewrite of checkout logic to be transactionally safe and correct.
    @Transactional
    public Receipt checkoutCart(String userEmail, PaymentRequestDTO paymentRequest) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 1. Create the Receipt shell
        Receipt receipt = Receipt.builder().user(user).items(new ArrayList<>()).build();
        receiptRepository.save(receipt); // Save to get an ID

        // 2. Process items, create bookings, and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ReceiptItem> receiptItems = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            TicketType ticketType = item.getTicketType();
            if (ticketType.getAvailableQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough tickets for " + ticketType.getName()); // Rollback transaction
            }
            ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - item.getQuantity());
            ticketTypeRepository.save(ticketType);

            BigDecimal subtotal = ticketType.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            // Create booking for this cart item
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(ticketType.getEvent());
            booking.setBookingDate(LocalDateTime.now());
            booking.setQuantity(item.getQuantity());
            booking.setStatus(BookingStatus.PAID);
            booking.setTotalAmount(subtotal);
            bookingRepository.save(booking);

            // Create receipt item
            ReceiptItem rItem = ReceiptItem.builder()
                    .receipt(receipt)
                    .ticketTypeId(ticketType.getId())
                    .ticketTypeName(ticketType.getName())
                    .unitPriceSnapshot(ticketType.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
            receiptItems.add(rItem);
        }

        // 3. Finalize Receipt
        receipt.setItems(receiptItems);
        receipt.setTotalAmount(totalAmount);
        receipt.setCreatedAt(LocalDateTime.now());
        receiptRepository.save(receipt);

        // 4. Create single PaymentDetails record linked to the receipt
        PaymentDetails payment = new PaymentDetails();
        payment.setUser(user);
        payment.setReceipt(receipt); // Link to receipt
        payment.setPaymentAmount(totalAmount);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setReferenceNumber(paymentRequest.getReferenceNumber());
        payment.setNotes(paymentRequest.getNotes());
        paymentRepository.save(payment);

        // 5. Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return receipt;
    }
}