package com.example.demo.controller;

import com.example.demo.jwt.JwtUtil;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.dto.*;
import com.example.demo.services.BookingService;
import com.example.demo.services.CartService;
import com.example.demo.services.EventCommentService;
import com.example.demo.services.EventService;
import com.example.demo.services.ReviewService;
import com.example.demo.services.ReceiptService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired private EventService eventService;
    @Autowired private EventCommentService commentService;
    @Autowired private BookingService bookingService;
    @Autowired private UserService userService;
    @Autowired private CartService cartService;
    @Autowired private ReviewService reviewService;
    @Autowired private ReceiptService receiptService;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(@RequestBody UserUpdateDTO updatedUser, Principal principal) {
        return ResponseEntity.ok(userService.updateUserDetails(principal.getName(), updatedUser));
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats(Principal principal) {
        return ResponseEntity.ok(userService.getUserStats(principal.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        jwtUtil.invalidateToken(authHeader.substring(7));
        return ResponseEntity.ok("Logged out successfully");
    }

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

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<BookingResponseDTO> completeBooking(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.completeBooking(id, principal.getName()));
    }

    @GetMapping("/bookings/{id}/receipt")
    public ResponseEntity<?> getBookingReceipt(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(receiptService.getUserBookingReceipt(id, principal.getName()));
    }

    @GetMapping("/cart")
    public ResponseEntity<?> viewCartItems(Principal principal) {
        return ResponseEntity.ok(cartService.getCartItems(principal.getName()));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequestDTO cartItemDTO, Principal principal) {
        return ResponseEntity.ok(cartService.addToCart(principal.getName(), cartItemDTO));
    }

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

    @PostMapping("/events/{eventId}/like")
    public ResponseEntity<?> toggleEventLike(@PathVariable long eventId, Principal principal) {
        return ResponseEntity.ok(eventService.toggleLike(eventId, principal.getName()));
    }

    @PostMapping("/events/{eventId}/comments")
    public ResponseEntity<?> addEventComment(@PathVariable long eventId, @RequestBody CommentRequestDTO commentDTO, Principal principal) {
        return ResponseEntity.ok(commentService.addComment(eventId, principal.getName(), commentDTO));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getUserReviews(Principal principal) {
        return ResponseEntity.ok(reviewService.getUserReviews(principal.getName()));
    }

    @PostMapping("/events/{eventId}/reviews")
    public ResponseEntity<?> addReview(@PathVariable long eventId, @RequestBody ReviewRequestDTO dto, Principal principal) {
        return ResponseEntity.ok(reviewService.addReview(eventId, principal.getName(), dto));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ReviewRequestDTO dto, Principal principal) {
        return ResponseEntity.ok(reviewService.updateReview(id, principal.getName(), dto));
    }

    @GetMapping("/receipts")
    public ResponseEntity<?> getUserReceipts(Principal principal) {
        return ResponseEntity.ok(receiptService.getUserReceipts(principal.getName()));
    }
}