// EventCommentRepository.java
package com.example.demo.repository;

import com.example.demo.model.Events.EventComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventCommentRepo extends JpaRepository<EventComment, Long> {
    List<EventComment> findByEventEventIdOrderByCreatedAtDesc(Long eventId);
    List<EventComment> findByEventEventId(Long eventId);
}
