package com.example.demo.repository;

import com.example.demo.model.Events.EventLike;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EventLikeRepo extends JpaRepository<EventLike, Long> {
    Optional<EventLike> findByUserUserIdAndEventEventId(Long userId, Long eventId);

    @Query("SELECT el.event.id FROM EventLike el WHERE el.user.id = :userId AND el.event.id IN :eventIds")
    Set<Long> findLikedEventIdsByUserId(Long userId, List<Long> eventIds);

    @Query("SELECT el.event.eventId, COUNT(el) FROM EventLike el WHERE el.event.eventId IN :eventIds GROUP BY el.event.eventId")
    List<Object[]> countByEventIds(@Param("eventIds") List<Long> eventIds);

    @Query("SELECT el.event.eventId, el.event.title, COUNT(el) FROM EventLike el GROUP BY el.event.eventId, el.event.title ORDER BY COUNT(el) DESC")
    List<Object[]> findTopLikedEvents(Pageable pageable);
}