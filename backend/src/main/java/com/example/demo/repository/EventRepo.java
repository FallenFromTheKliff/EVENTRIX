package com.example.demo.repository;

import com.example.demo.model.Events.Event;
import com.example.demo.model.EventStatus;
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
    @Query("SELECT e FROM Event e WHERE " +
        "(CAST(:categoryName AS string) IS NULL OR e.category = :categoryName) AND " +
        "(CAST(:title AS string) IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%'))) AND " +
        "(CAST(:startDate AS LocalDateTime) IS NULL OR e.dateTime >= :startDate) AND " +
        "(CAST(:endDate AS LocalDateTime) IS NULL OR e.dateTime <= :endDate) AND " +
        "(:status IS NULL OR e.status = :status) ORDER BY e.dateTime ASC, e.eventId ASC")
    List<Event> findEventsWithFilters(
            @Param("categoryName") String categoryName,
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") EventStatus status
    );

    // NEW: Query to get events liked by a specific user.
    @Query("SELECT e FROM Event e JOIN e.likes l WHERE l.user.id = :userId")
    List<Event> findLikedEventsByUserId(@Param("userId") Long userId);

    @Query("SELECT e.dateTime FROM Event e WHERE LOWER(e.location) = LOWER(:location) AND e.status = com.example.demo.model.EventStatus.ACTIVE AND e.eventId <> :excludeId")
    List<LocalDateTime> findVenueDates(@Param("location") String location, @Param("excludeId") Long excludeId);
}