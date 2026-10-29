package com.example.demo.repository;

import com.example.demo.model.Events.Event;
import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"event", "event.category", "user", "ticketType"})
    @Query("SELECT b FROM Booking b WHERE " +
            "(:user IS NULL OR b.user = :user) AND " +
            "(:status IS NULL OR b.status = :status) AND " +
            "(CAST(:eventName AS string) IS NULL OR LOWER(b.event.title) LIKE LOWER(CONCAT('%', CAST(:eventName AS string), '%')))")
    List<Booking> findBookingsWithFilters(
            @Param("user") User user,
            @Param("status") BookingStatus status,
            @Param("eventName") String eventName
    );

    @Override
    @EntityGraph(attributePaths = {"event", "event.category", "user", "ticketType"})
    List<Booking> findAll(Sort sort);

    boolean existsByUserAndEventAndStatus(User user, Event event, BookingStatus status);

    long countByUserAndStatusNotIn(User user, List<BookingStatus> statuses);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status IN :statuses")
    BigDecimal sumTotalAmountByStatusIn(@Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT YEAR(b.bookingDate), MONTH(b.bookingDate), SUM(b.totalAmount) FROM Booking b WHERE b.status IN :statuses " +
            "GROUP BY YEAR(b.bookingDate), MONTH(b.bookingDate) ORDER BY YEAR(b.bookingDate), MONTH(b.bookingDate)")
    List<Object[]> sumTotalAmountByMonth(@Param("statuses") List<BookingStatus> statuses);
}