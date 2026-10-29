package com.example.demo.repository;

import com.example.demo.model.Events.Event;
import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);

    // REFACTORED: Efficient filtering by status and event name.
    @Query("SELECT b FROM Booking b WHERE " +
            "(:user IS NULL OR b.user = :user) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(CAST(:eventName AS string) IS NULL OR LOWER(b.event.title) LIKE LOWER(CONCAT('%', CAST(:eventName AS string), '%')))")
    List<Booking> findBookingsWithFilters(
            @Param("user") User user,
            @Param("status") BookingStatus status,
            @Param("eventName") String eventName
    );

    // NEW: Check if a user has a completed booking for a specific event.
    boolean existsByUserAndEventAndStatus(User user, Event event, BookingStatus status);

    // For admin transaction log
    List<Booking> findByStatusIn(List<BookingStatus> statuses);

    long countByUserAndStatusNotIn(User user, List<BookingStatus> statuses);
}