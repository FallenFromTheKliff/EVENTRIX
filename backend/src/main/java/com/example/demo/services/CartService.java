package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.CartItemRequestDTO;
import com.example.demo.model.dto.CartItemResponseDTO;
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
    public CartItemResponseDTO addToCart(String userEmail, CartItemRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        TicketType ticketType = ticketTypeRepository.findById(dto.getTicketTypeId())
                .orElseThrow(() -> new RuntimeException("Ticket type not found"));

        if (dto.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        int currentQuantity = cart.getItems().stream()
                .filter(item -> item.getTicketType().getId().equals(ticketType.getId()))
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();

        if (currentQuantity + dto.getQuantity() > ticketType.getAvailableQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }

        CartItem item = dto.isSeparateItem()
                ? new CartItem()
                : cart.getItems().stream()
                    .filter(existing -> existing.getTicketType().getId().equals(ticketType.getId()))
                    .findFirst()
                    .orElse(new CartItem());

        if (item.getId() == null) {
            item.setCart(cart);
            item.setTicketType(ticketType);
            item.setQuantity(dto.getQuantity());
            item.setBookingReference(BookingReferenceGenerator.generate());
            cart.getItems().add(item);
        } else {
            item.setQuantity(item.getQuantity() + dto.getQuantity());

            if (item.getBookingReference() == null || item.getBookingReference().isBlank()) {
                item.setBookingReference(BookingReferenceGenerator.generate());
            }
        }

        return CartItemResponseDTO.from(cartItemRepository.save(item));
    }

    @Transactional
    public List<CartItemResponseDTO> getCartItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> items = getOrCreateCart(user).getItems();

        for (CartItem item : items) {
            if (item.getBookingReference() == null || item.getBookingReference().isBlank()) {
                item.setBookingReference(BookingReferenceGenerator.generate());
            }
        }

        return cartItemRepository.saveAll(items).stream()
                .map(CartItemResponseDTO::from)
                .toList();
    }

    @Transactional
    public CartItemResponseDTO updateCartItem(String userEmail, Long itemId, CartItemUpdateDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found in user's cart"));

        if (dto.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        Long ticketTypeId = item.getTicketType().getId();

        int otherQuantity = cart.getItems().stream()
                .filter(existing -> !existing.getId().equals(itemId))
                .filter(existing -> existing.getTicketType().getId().equals(ticketTypeId))
                .mapToInt(existing -> existing.getQuantity() == null ? 0 : existing.getQuantity())
                .sum();

        if (otherQuantity + dto.getQuantity() > item.getTicketType().getAvailableQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }

        item.setQuantity(dto.getQuantity());

        if (item.getBookingReference() == null || item.getBookingReference().isBlank()) {
            item.setBookingReference(BookingReferenceGenerator.generate());
        }

        return CartItemResponseDTO.from(cartItemRepository.save(item));
    }

    @Transactional
    public void removeCartItem(String userEmail, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
    }

    @Transactional
    public Receipt checkoutCart(String userEmail, PaymentRequestDTO paymentRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        List<CartItem> selectedItems = cart.getItems().stream()
                .filter(item -> paymentRequest.getCartItemIds() == null || paymentRequest.getCartItemIds().contains(item.getId()))
                .toList();

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Receipt receipt = Receipt.builder()
                .user(user)
                .items(new ArrayList<>())
                .build();

        receiptRepository.save(receipt);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ReceiptItem> receiptItems = new ArrayList<>();

        for (CartItem item : selectedItems) {
            TicketType ticketType = item.getTicketType();

            if (ticketType.getAvailableQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough tickets for " + ticketType.getName());
            }

            ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - item.getQuantity());
            ticketTypeRepository.save(ticketType);

            BigDecimal subtotal = ticketType.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            if (item.getBookingReference() == null || item.getBookingReference().isBlank()) {
                item.setBookingReference(BookingReferenceGenerator.generate());
                cartItemRepository.save(item);
            }

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(ticketType.getEvent());
            booking.setBookingDate(LocalDateTime.now());
            booking.setQuantity(item.getQuantity());
            booking.setStatus(BookingStatus.PAID);
            booking.setTotalAmount(subtotal);
            booking.setBookingReference(item.getBookingReference());
            booking.setStatus(BookingStatus.PENDING);
            booking.setTicketType(ticketType);

            bookingRepository.save(booking);

            ReceiptItem receiptItem = ReceiptItem.builder()
                    .receipt(receipt)
                    .ticketTypeId(ticketType.getId())
                    .ticketTypeName(ticketType.getName())
                    .unitPriceSnapshot(ticketType.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();

            receiptItems.add(receiptItem);
        }

        receipt.setItems(receiptItems);
        receipt.setTotalAmount(totalAmount);
        receipt.setCreatedAt(LocalDateTime.now());
        receiptRepository.save(receipt);

        PaymentDetails payment = new PaymentDetails();
        payment.setUser(user);
        payment.setReceipt(receipt);
        payment.setPaymentAmount(totalAmount);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setReferenceNumber(paymentRequest.getReferenceNumber());
        payment.setNotes(paymentRequest.getNotes());
        paymentRepository.save(payment);

        cart.getItems().removeAll(selectedItems);
        cartRepository.save(cart);

        return receipt;
    }
}