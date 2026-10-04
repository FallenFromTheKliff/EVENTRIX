package com.example.demo.controller;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.dto.*;
import com.example.demo.jwt.JwtUtil;
import com.example.demo.model.Booking;
import com.example.demo.services.BookingService;
import com.example.demo.services.CartService;
import com.example.demo.services.EventService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired private EventService eventService;
    @Autowired private BookingService bookingService;
    @Autowired private UserService userService;
    @Autowired private CartService cartService;
    @Autowired private JwtUtil jwtUtil;

    // --- USER PROFILE ---
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(@RequestBody UserUpdateDTO updatedUser, Principal principal) {
        return ResponseEntity.ok(userService.updateUserDetails(principal.getName(), updatedUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        jwtUtil.invalidateToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }

    // --- BOOKINGS ---
    @GetMapping("/bookings")
    public ResponseEntity<?> getUserBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String eventName,
            Principal principal) {
        return ResponseEntity.ok(bookingService.getFilteredBookingsForUser(principal.getName(), status, eventName));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Principal principal) {
        bookingService.cancelBooking(id, principal.getName());
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    // NEW: Endpoint for user to complete their booking
    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.completeBooking(id, principal.getName()));
    }

    // --- CART ---
    @GetMapping("/cart")
    public ResponseEntity<?> viewCartItems(Principal principal) {
        return ResponseEntity.ok(cartService.getCartItems(principal.getName()));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequestDTO cartItemDTO, Principal principal) {
        return ResponseEntity.ok(cartService.addToCart(principal.getName(), cartItemDTO));
    }

    // NEW: Update item quantity in cart
    @PutMapping("/cart/items/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId, @RequestBody CartItemUpdateDTO dto, Principal principal) {
        return ResponseEntity.ok(cartService.updateCartItem(principal.getName(), itemId, dto));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long itemId, Principal principal) {
        cartService.removeCartItem(principal.getName(), itemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @PostMapping("/cart/checkout")
    public ResponseEntity<?> checkoutCart(@RequestBody PaymentRequestDTO paymentRequest, Principal principal) {
        return ResponseEntity.ok(cartService.checkoutCart(principal.getName(), paymentRequest));
    }

    // --- EVENT INTERACTION ---
    @PostMapping("/events/{eventId}/like")
    public ResponseEntity<?> toggleEventLike(@PathVariable int eventId, Principal principal) {
        return ResponseEntity.ok(eventService.toggleLike(eventId, principal.getName()));
    }

    @PostMapping("/events/{eventId}/comments")
    public ResponseEntity<?> addEventComment(@PathVariable int eventId, @RequestBody CommentRequestDTO commentDTO, Principal principal) {
        return ResponseEntity.ok(eventService.addComment(eventId, principal.getName(), commentDTO));
    }
}