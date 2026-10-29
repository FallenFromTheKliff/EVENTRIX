package com.example.demo.repository;

import com.example.demo.model.Events.Event;
import com.example.demo.model.Events.EventComment;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventCommentRepo extends JpaRepository<EventComment, Long> {
    List<EventComment> findByEventEventIdOrderByCreatedAtDesc(Long eventId);
    Optional<EventComment> findFirstByUserAndEventOrderByCreatedAtDesc(User user, Event event);
}
