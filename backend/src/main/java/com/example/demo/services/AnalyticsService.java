package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.EventLikeRepo;
import com.example.demo.repository.EventRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    private static final List<BookingStatus> REVENUE_STATUSES = List.of(BookingStatus.PAID, BookingStatus.COMPLETED);

    @Autowired private BookingRepo bookingRepository;
    @Autowired private EventRepo eventRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private EventLikeRepo eventLikeRepository;

    public Map<String, Object> getSummary() {
        BigDecimal totalRevenue = bookingRepository.sumTotalAmountByStatusIn(REVENUE_STATUSES);
        return Map.of(
                "totalBookings", bookingRepository.count(),
                "totalRevenue", totalRevenue == null ? BigDecimal.ZERO : totalRevenue,
                "totalEvents", eventRepository.count(),
                "totalUsers", userRepository.count());
    }

    public List<Map<String, Object>> getTopLikedEvents() {
        return eventLikeRepository.findTopLikedEvents(PageRequest.of(0, 3)).stream()
                .map(row -> Map.<String, Object>of("eventId", row[0], "eventTitle", row[1], "likeCount", row[2]))
                .toList();
    }

    public List<Map<String, Object>> getSalesOverTime() {
        return bookingRepository.sumTotalAmountByMonth(REVENUE_STATUSES).stream()
                .map(row -> Map.<String, Object>of(
                        "month", String.format("%d-%02d", ((Number) row[0]).intValue(), ((Number) row[1]).intValue()),
                        "revenue", row[2]))
                .toList();
    }
}