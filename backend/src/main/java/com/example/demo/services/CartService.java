package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.CartItemRequestDTO;
import com.example.demo.model.dto.CartItemResponseDTO;
import com.example.demo.model.dto.CartItemUpdateDTO;
import com.example.demo.model.dto.PaymentRequestDTO;
import com.example.demo.model.dto.ReceiptResponseDTO;
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
        User user = userRepository.getByEmail(userEmail);

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
        }

        return CartItemResponseDTO.from(cartItemRepository.save(item));
    }

    @Transactional
    public List<CartItemResponseDTO> getCartItems(String userEmail) {
        User user = userRepository.getByEmail(userEmail);
        return getOrCreateCart(user).getItems().stream().map(CartItemResponseDTO::from).toList();
    }

    @Transactional
    public CartItemResponseDTO updateCartItem(String userEmail, Long itemId, CartItemUpdateDTO dto) {
        User user = userRepository.getByEmail(userEmail);

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

        return CartItemResponseDTO.from(cartItemRepository.save(item));
    }

    @Transactional
    public void removeCartItem(String userEmail, Long itemId) {
        User user = userRepository.getByEmail(userEmail);

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
    public ReceiptResponseDTO checkoutCart(String userEmail, PaymentRequestDTO paymentRequest) {
        User user = userRepository.getByEmail(userEmail);
        Cart cart = getOrCreateCart(user);
        List<CartItem> selectedItems = cart.getItems().stream()
                .filter(item -> paymentRequest.getCartItemIds() == null || paymentRequest.getCartItemIds().contains(item.getId()))
                .toList();
        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        Receipt receipt = Receipt.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : selectedItems) {
            TicketType ticketType = item.getTicketType();
            Event event = ticketType.getEvent();
            if (ticketType.getAvailableQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough tickets for " + ticketType.getName());
            }
            ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - item.getQuantity());
            ticketTypeRepository.save(ticketType);
            BigDecimal subtotal = ticketType.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setBookingDate(LocalDateTime.now());
            booking.setQuantity(item.getQuantity());
            booking.setTotalAmount(subtotal);
            booking.setBookingReference(item.getBookingReference());
            booking.setStatus(BookingStatus.PENDING);
            booking.setTicketType(ticketType);
            bookingRepository.save(booking);
            receipt.getItems().add(ReceiptItem.builder()
                    .receipt(receipt)
                    .bookingReference(item.getBookingReference())
                    .eventTitle(event.getTitle())
                    .eventLocation(event.getLocation())
                    .eventDateTime(event.getDateTime())
                    .ticketTypeId(ticketType.getId())
                    .ticketTypeName(ticketType.getName())
                    .unitPriceSnapshot(ticketType.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build());
        }
        receipt.setTotalAmount(totalAmount);
        receiptRepository.save(receipt);
        PaymentDetails payment = new PaymentDetails();
        payment.setUser(user);
        payment.setReceipt(receipt);
        payment.setPaymentAmount(totalAmount);
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setReferenceNumber(paymentRequest.getReferenceNumber());
        payment.setNotes(paymentRequest.getNotes());
        paymentRepository.save(payment);
        receipt.setPaymentDetails(payment);
        cart.getItems().removeAll(selectedItems);
        cartRepository.save(cart);
        return ReceiptResponseDTO.from(receipt);
    }
}