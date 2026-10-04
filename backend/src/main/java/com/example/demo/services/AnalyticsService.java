package com.example.demo.services;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.EventLikeRepo;
import com.example.demo.repository.EventRepo;
import com.example.demo.repository.UserRepo;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired private BookingRepo bookingRepository;
    @Autowired private EventRepo eventRepository;
    @Autowired private UserRepo userRepository; // NEW
    @Autowired private EventLikeRepo eventLikeRepository; // NEW

    public Map<String, Object> getSummary() {
        List<Booking> bookings = bookingRepository.findAll();
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count(); // NEW

        BigDecimal totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PAID || b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("totalBookings", bookings.size());
        data.put("totalRevenue", totalRevenue);
        data.put("totalEvents", totalEvents);
        data.put("totalUsers", totalUsers); // NEW
        return data;
    }

    public List<Map<String, Object>> getTopLikedEvents() {
        List<Long> topEventIds = eventLikeRepository.findTopLikedEventIds();
        if (topEventIds.isEmpty()) {
            return Collections.emptyList();
        }

        return eventRepository.findAllById(topEventIds).stream()
                .map(event -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("eventId", event.getEventId());
                    map.put("eventTitle", event.getTitle());
                    map.put("likeCount", eventLikeRepository.countByEventEventId(event.getEventId()));
                    return map;
                })
                .sorted(Comparator.comparingLong((Map<String, Object> m) -> (long) m.get("likeCount")).reversed())
                .collect(Collectors.toList());
    }


    public List<Map<String, Object>> getSalesOverTime() {
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, BigDecimal> monthlySales = new TreeMap<>();
        for (Booking b : bookings) {
            if (b.getStatus() == BookingStatus.PAID || b.getStatus() == BookingStatus.COMPLETED) {
                String month = b.getBookingDate().getYear() + "-" + String.format("%02d", b.getBookingDate().getMonthValue());
                monthlySales.merge(month, b.getTotalAmount(), BigDecimal::add);
            }
        }

        return monthlySales.entrySet().stream()
                .map(e -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("month", e.getKey());
                    data.put("revenue", e.getValue());
                    return data;
                })
                .collect(Collectors.toList());
    }
}