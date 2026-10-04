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
    @Query("SELECT e FROM Event e WHERE " +
            "(:categoryName IS NULL OR e.category.name = :categoryName) AND " +
            "(:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:startDate IS NULL OR e.dateTime >= :startDate) AND " +
            "(:endDate IS NULL OR e.dateTime <= :endDate) AND " +
            "e.status = 'ACTIVE'")
    List<Event> findActiveEventsWithFilters(
            @Param("categoryName") String categoryName,
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // NEW: Query to get events liked by a specific user.
    @Query("SELECT e FROM Event e JOIN e.likes l WHERE l.user.id = :userId AND e.status = 'ACTIVE'")
    List<Event> findLikedEventsByUserId(@Param("userId") Long userId);
}