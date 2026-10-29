package com.example.demo.controller;

import com.example.demo.model.Events.Category;
import com.example.demo.model.Events.Trait;
import com.example.demo.model.dto.EventResponseDTO;
import com.example.demo.model.dto.CommentResponseDTO;
import com.example.demo.model.dto.ReviewResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.services.CategoryService;
import com.example.demo.services.EventService;
import com.example.demo.services.EventCommentService;
import com.example.demo.services.ReviewService;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events") // REFACTORED: A more RESTful base path
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private EventCommentService commentService;

    @Autowired
    private ReviewService reviewService;

    // REFACTORED: Single endpoint for fetching and filtering events.
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getActiveEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name, // 'name' for title search
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Principal principal) {
        String userEmail = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(eventService.getActiveEvents(category, name, startDate, endDate, userEmail));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // NEW: Endpoint to get events a user has liked.
    @GetMapping("/favorites")
    public ResponseEntity<List<EventResponseDTO>> getFavoritedEvents(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        return ResponseEntity.ok(eventService.getLikedEvents(principal.getName()));
    }

    @GetMapping("/traits")
    public ResponseEntity<List<Trait>> getTraits() {
        return ResponseEntity.ok(reviewService.getAllTraits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id, Principal principal) {
        String userEmail = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(eventService.getEventById(id, userEmail));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getEventReviews(@PathVariable Long id, Principal principal) {
        String userEmail = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(reviewService.getEventReviews(id, userEmail));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getEventComments(@PathVariable Long id, Principal principal) {
        String userEmail = (principal != null) ? principal.getName() : null;
        return ResponseEntity.ok(commentService.getComments(id, userEmail));    }
}