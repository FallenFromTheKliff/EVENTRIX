package com.example.demo.controller;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.Events.CommentReply;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.EventComment;
import com.example.demo.model.dto.CommentReplyUpdateDTO;
import com.example.demo.model.dto.EventResponseDTO;
import com.example.demo.model.dto.ReviewRequestDTO;
import com.example.demo.model.dto.ReviewResponseDTO;
import com.example.demo.model.dto.BookingResponseDTO;
import com.example.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private EventService eventService;
    @Autowired private BookingService bookingService;
    @Autowired private EventCommentService commentService;
    @Autowired private AnalyticsService analyticsService;
    @Autowired private ReviewService reviewService;

    // ... (Category and TicketType management endpoints remain the same) ...

    // --- EVENT MANAGEMENT ---

    @GetMapping("/events")
    public ResponseEntity<List<EventResponseDTO>> getEvents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Principal principal) {
        return ResponseEntity.ok(eventService.getEvents(status, category, name, startDate, endDate, principal.getName()));
    }

    @PostMapping("/events/create")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.saveEvent(event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // NEW: Archive/Unarchive endpoints
    @PutMapping("/events/{id}/archive")
    public ResponseEntity<Event> archiveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.archiveEvent(id));
    }

    @PutMapping("/events/{id}/unarchive")
    public ResponseEntity<Event> unarchiveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.unarchiveEvent(id));
    }

    // NEW: Event Image Management
    @PostMapping("/events/{eventId}/images")
    public ResponseEntity<?> addPreviewImage(@PathVariable Long eventId, @RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("imageUrl");
        String caption = payload.get("caption");
        return ResponseEntity.ok(eventService.addPreviewImage(eventId, imageUrl, caption));
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deletePreviewImage(@PathVariable Long imageId) {
        eventService.deletePreviewImage(imageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/venue-dates")
    public ResponseEntity<List<LocalDate>> getVenueDates(@RequestParam String location, @RequestParam(required = false) Long excludeId) {
        return ResponseEntity.ok(eventService.getVenueDates(location, excludeId));
    }

    // ... (Booking management endpoints are similar, but use updated service) ...
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, adminNotes));
    }

    // NEW: Transaction Log
    @GetMapping("/transactions")
    public ResponseEntity<List<BookingResponseDTO>> getTransactionLog() {
        return ResponseEntity.ok(bookingService.getTransactionLog());
    }

    // --- COMMENT MANAGEMENT ---
    @GetMapping("/comments")
    public ResponseEntity<List<EventComment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // ... (Delete comment and get replies are similar) ...
    @PostMapping("/comments/{commentId}/reply")
    public ResponseEntity<CommentReply> addReplyToComment(@PathVariable Long commentId, @RequestBody CommentReply reply, Principal principal) {
        return ResponseEntity.ok(commentService.addReply(commentId, reply, principal.getName()));
    }

    // NEW: Update admin reply
    @PutMapping("/replies/{replyId}")
    public ResponseEntity<CommentReply> updateReply(@PathVariable Long replyId, @RequestBody CommentReplyUpdateDTO dto, Principal principal) {
        return ResponseEntity.ok(commentService.updateReply(replyId, dto, principal.getName()));
    }

    // --- ANALYTICS ---
    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getSummaryAnalytics() {
        return ResponseEntity.ok(analyticsService.getSummary());
    }

    @GetMapping("/analytics/top-events")
    public ResponseEntity<?> getTopEvents() {
        // REFACTORED: Renamed from getTopEvents to getTopLikedEvents for clarity
        return ResponseEntity.ok(analyticsService.getTopLikedEvents());
    }

    @GetMapping("/analytics/sales")
    public ResponseEntity<?> getSalesOverTime() {
        return ResponseEntity.ok(analyticsService.getSalesOverTime());
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PostMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<ReviewResponseDTO> replyToReview(@PathVariable Long reviewId, @RequestBody CommentReplyUpdateDTO dto, Principal principal) {
        return ResponseEntity.ok(reviewService.replyToReview(reviewId, dto, principal.getName()));
    }
}