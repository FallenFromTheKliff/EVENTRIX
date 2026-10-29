package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import com.example.demo.model.Events.CommentReply;
import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.EventComment;
import com.example.demo.model.dto.CommentReplyUpdateDTO;
import com.example.demo.model.dto.CommentRequestDTO;
import com.example.demo.model.dto.CommentResponseDTO;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.CommentReplyRepo;
import com.example.demo.repository.EventCommentRepo;
import com.example.demo.repository.EventRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class EventCommentService {
    @Autowired private EventCommentRepo commentRepository;
    @Autowired private CommentReplyRepo replyRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private EventRepo eventRepository;
    @Autowired private BookingRepo bookingRepository;

    public List<EventComment> getAllComments() {
        return commentRepository.findAll();
    }

    public List<CommentResponseDTO> getComments(long eventId, String userEmail) {
        return commentRepository.findByEventEventIdOrderByCreatedAtDesc(eventId).stream()
                .sorted(Comparator.comparing((EventComment comment) -> !comment.getUser().getEmail().equals(userEmail)))
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public CommentResponseDTO addComment(long eventId, String userEmail, CommentRequestDTO dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.getByEmail(userEmail);
        if (!bookingRepository.existsByUserAndEventAndStatus(user, event, BookingStatus.COMPLETED)) {
            throw new RuntimeException("You can only comment on events you have a completed booking for.");
        }
        commentRepository.findFirstByUserAndEventOrderByCreatedAtDesc(user, event)
                .filter(last -> last.getCreatedAt().isAfter(LocalDateTime.now().minusHours(1)))
                .ifPresent(last -> {
                    throw new RuntimeException("You can only comment once every hour.");
                });
        EventComment comment = new EventComment();
        comment.setEvent(event);
        comment.setUser(user);
        comment.setContent(dto.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        return toDTO(commentRepository.save(comment));
    }

    @Transactional
    public CommentReply addReply(Long commentId, CommentReply replyData, String adminEmail) {
        EventComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        User adminUser = userRepository.getByEmail(adminEmail);
        replyData.setComment(comment);
        replyData.setUser(adminUser);
        replyData.setCreatedAt(LocalDateTime.now());
        return replyRepository.save(replyData);
    }

    @Transactional
    public CommentReply updateReply(Long replyId, CommentReplyUpdateDTO dto, String adminEmail) {
        CommentReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));
        if (!reply.getUser().getEmail().equals(adminEmail)) {
            throw new SecurityException("Admins can only edit their own replies.");
        }
        reply.setContent(dto.getContent());
        return replyRepository.save(reply);
    }

    private CommentResponseDTO toDTO(EventComment comment) {
        return CommentResponseDTO.builder()
                .id(comment.getId())
                .userName(comment.getUser().getName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}