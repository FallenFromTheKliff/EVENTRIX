package com.example.demo.services;

import com.example.demo.model.Events.CommentReply;
import com.example.demo.model.Events.EventComment;
import com.example.demo.model.User;
import com.example.demo.model.dto.CommentReplyUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.repository.CommentReplyRepo;
import com.example.demo.repository.EventCommentRepo;
import com.example.demo.repository.UserRepo;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventCommentService {

    @Autowired private EventCommentRepo commentRepository;
    @Autowired private CommentReplyRepo replyRepository;
    @Autowired private UserRepo userRepository;

    public List<EventComment> getAllComments() {
        return commentRepository.findAll();
    }

    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepository.deleteById(id);
    }

    @Transactional
    public CommentReply addReply(Long commentId, CommentReply replyData, String adminEmail) {
        EventComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User adminUser = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        replyData.setComment(comment);
        replyData.setUser(adminUser); // Set the currently logged-in admin as the replier
        replyData.setCreatedAt(LocalDateTime.now());
        return replyRepository.save(replyData);
    }

    // NEW: Update a comment reply.
    @Transactional
    public CommentReply updateReply(Long replyId, CommentReplyUpdateDTO dto, String adminEmail) {
        CommentReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        // Optional: Ensure the admin updating the reply is the one who created it.
        if (!reply.getUser().getEmail().equals(adminEmail)) {
            throw new SecurityException("Admins can only edit their own replies.");
        }

        reply.setContent(dto.getContent());
        return replyRepository.save(reply);
    }

    public List<CommentReply> getReplies(Long commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    public void deleteReply(Long replyId) {
        if (!replyRepository.existsById(replyId)) {
            throw new RuntimeException("Reply not found");
        }
        replyRepository.deleteById(replyId);
    }
}