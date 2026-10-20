package com.example.demo.repository;

import com.example.demo.model.Events.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {

    // REFACTORED: Efficient, database-level filtering instead of loading all events into memory.
    // This query handles filtering by category, title (name), and date range.
    @Query("SELECT e FROM Event e LEFT JOIN e.category c WHERE " +
        "(CAST(:categoryName AS string) IS NULL OR c.name = :categoryName) AND " +
        "(CAST(:title AS string) IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%'))) AND " +
        "(CAST(:startDate AS LocalDateTime) IS NULL OR e.dateTime >= :startDate) AND " +
        "(CAST(:endDate AS LocalDateTime) IS NULL OR e.dateTime <= :endDate)")
    List<Event> findEventsWithFilters(
            @Param("categoryName") String categoryName,
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // NEW: Query to get events liked by a specific user.
    @Query("SELECT e FROM Event e JOIN e.likes l WHERE l.user.id = :userId AND e.status = 'ACTIVE'")
    List<Event> findLikedEventsByUserId(@Param("userId") Long userId);

    @Query("SELECT e.dateTime FROM Event e WHERE LOWER(e.location) = LOWER(:location) AND e.status = com.example.demo.model.EventStatus.ACTIVE AND e.eventId <> :excludeId")
    List<LocalDateTime> findVenueDates(@Param("location") String location, @Param("excludeId") Long excludeId);
}