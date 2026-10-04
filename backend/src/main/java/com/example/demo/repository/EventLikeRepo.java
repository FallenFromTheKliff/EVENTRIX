package com.example.demo.repository;

import com.example.demo.model.Events.EventLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EventLikeRepo extends JpaRepository<EventLike, Long> {

    //  FIX 1: Must be 'EventEventId' because the Event PK is 'eventId'
    long countByEventEventId(Long eventId);

    //  FIX 2: Must be 'EventEventId' for consistency, and likely 'User' PK is 'id'
    Optional<EventLike> findByUserUserIdAndEventEventId(Long userId, Long eventId);

    // This method is already using a safe @Query annotation, so it's fine.

    @Query("SELECT el.event.id FROM EventLike el WHERE el.user.id = :userId AND el.event.id IN :eventIds")
    Set<Long> findLikedEventIdsByUserId(Long userId, List<Long> eventIds);

    // This is a native query and is fine.
    @Query(value = "SELECT event_id FROM event_likes GROUP BY event_id ORDER BY COUNT(id) DESC LIMIT 3", nativeQuery = true)
    List<Long> findTopLikedEventIds();
}