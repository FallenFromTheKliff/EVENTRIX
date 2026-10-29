package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.Review;
import com.example.demo.model.Events.Trait;
import com.example.demo.model.dto.CommentReplyUpdateDTO;
import com.example.demo.model.dto.ReviewRequestDTO;
import com.example.demo.model.dto.ReviewResponseDTO;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ReviewService {
    @Autowired private ReviewRepo reviewRepository;
    @Autowired private TraitRepo traitRepository;
    @Autowired private EventRepo eventRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private BookingRepo bookingRepository;

    public List<Trait> getAllTraits() {
        return traitRepository.findAll();
    }

    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<ReviewResponseDTO> getEventReviews(long eventId, String userEmail) {
        return reviewRepository.findByEventEventIdOrderByCreatedAtDesc(eventId).stream()
                .sorted(Comparator.comparing((Review review) -> !review.getUser().getEmail().equals(userEmail)))
                .map(this::toDTO)
                .toList();
    }

    public List<ReviewResponseDTO> getUserReviews(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream().map(this::toDTO).toList();
    }

    @Transactional
    public ReviewResponseDTO addReview(long eventId, String userEmail, ReviewRequestDTO dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!bookingRepository.existsByUserAndEventAndStatus(user, event, BookingStatus.COMPLETED)) {
            throw new RuntimeException("You can only review events you have a completed booking for.");
        }
        if (reviewRepository.findByUserUserIdAndEventEventId(user.getUserId(), eventId).isPresent()) {
            throw new RuntimeException("You have already reviewed this event.");
        }
        Review review = new Review();
        review.setEvent(event);
        review.setUser(user);
        applyDetails(review, dto);
        return toDTO(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponseDTO updateReview(long reviewId, String userEmail, ReviewRequestDTO dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You can only edit your own review.");
        }
        if (review.getReply() != null) {
            throw new IllegalStateException("This review can no longer be edited.");
        }
        applyDetails(review, dto);
        return toDTO(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponseDTO replyToReview(long reviewId, CommentReplyUpdateDTO dto, String adminEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (review.getReply() != null) {
            throw new IllegalStateException("This review has already been replied to.");
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new RuntimeException("Reply cannot be empty.");
        }
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        review.setReply(dto.getContent());
        review.setRepliedBy(admin);
        review.setRepliedAt(LocalDateTime.now());
        return toDTO(reviewRepository.save(review));
    }

    private void applyDetails(Review review, ReviewRequestDTO dto) {
        if (dto.getStars() < 1 || dto.getStars() > 5) {
            throw new RuntimeException("Stars must be between 1 and 5.");
        }
        review.setStars(dto.getStars());
        review.setTrait(traitRepository.findById(dto.getTraitId())
                .orElseThrow(() -> new RuntimeException("Trait not found")));
        review.setNotes(dto.getNotes());
    }

    private ReviewResponseDTO toDTO(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .eventId(review.getEvent().getEventId())
                .eventTitle(review.getEvent().getTitle())
                .userName(review.getUser().getName())
                .stars(review.getStars())
                .trait(review.getTrait().getName())
                .notes(review.getNotes())
                .createdAt(review.getCreatedAt())
                .reply(review.getReply())
                .repliedAt(review.getRepliedAt())
                .editable(review.getReply() == null)
                .build();
    }
}