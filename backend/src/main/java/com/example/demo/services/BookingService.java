package com.example.demo.services;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.Events.Event;
import com.example.demo.model.User;
import com.example.demo.model.dto.BookingRequestDTO;
import com.example.demo.model.dto.BookingResponseDTO;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.EventRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired private BookingRepo bookingRepository;
    @Autowired private UserRepo userRepository;
    @Autowired private EventRepo eventRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // REFACTORED: Get bookings with filters
    public List<BookingResponseDTO> getFilteredBookingsForUser(String userEmail, BookingStatus status, String eventName) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Booking> bookings = bookingRepository.findBookingsWithFilters(user, status, eventName);
        return mapBookingsToDTOs(bookings);
    }

    private List<BookingResponseDTO> mapBookingsToDTOs(List<Booking> bookings) {
        return bookings.stream().map(booking -> BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .quantity(booking.getQuantity())
                .totalAmount(booking.getTotalAmount())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .eventTitle(booking.getEvent().getTitle())
                .eventId(booking.getEvent().getEventId())
                .eventImageUrl(booking.getEvent().getImageUrl())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public Booking createBooking(BookingRequestDTO bookingRequest, String userEmail) {
        // Note: This method is now effectively a "Quick Buy". Cart checkout is the primary flow.
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(bookingRequest.getEventId()).orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < bookingRequest.getQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }
        event.setAvailableTickets(event.getAvailableTickets() - bookingRequest.getQuantity());
        eventRepository.save(event);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(bookingRequest.getQuantity());
        booking.setTotalAmount(event.getPrice().multiply(new BigDecimal(bookingRequest.getQuantity())));
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING); // Pending until paid
        return bookingRepository.save(booking);
    }

    // NEW: User marks a booking as completed (e.g., after attending the event).
    @Transactional
    public Booking completeBooking(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("You can only update your own bookings.");
        }
        if (booking.getStatus() != BookingStatus.PAID) {
            throw new IllegalStateException("Only paid bookings can be marked as completed.");
        }
        // Add logic here if event must be in the past to be completed
        // if (booking.getEvent().getDateTime().isAfter(LocalDateTime.now())) { ... }

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getUserId().equals(user.getUserId())) {
            throw new SecurityException("You cannot cancel another user's booking");
        }
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.PAID) {
            throw new IllegalStateException("Only pending or paid bookings can be cancelled");
        }

        // Restore tickets if booking was paid
        if(booking.getStatus() == BookingStatus.PAID){
            Event event = booking.getEvent();
            event.setAvailableTickets(event.getAvailableTickets() + booking.getQuantity());
            eventRepository.save(event);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminNotes("Cancelled by user");
        return bookingRepository.save(booking);
    }

    // --- Admin methods ---
    public List<Booking> getTransactionLog() {
        return bookingRepository.findByStatusIn(Arrays.asList(BookingStatus.COMPLETED, BookingStatus.CANCELLED));
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status, String adminNotes) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        Event event = booking.getEvent();

        boolean wasPaid = booking.getStatus() == BookingStatus.PAID;
        boolean isCancelledOrDeclined = status == BookingStatus.CANCELLED || status == BookingStatus.DECLINED;

        if (wasPaid && isCancelledOrDeclined) {
            event.setAvailableTickets(event.getAvailableTickets() + booking.getQuantity());
            eventRepository.save(event);
        }

        booking.setStatus(status);
        booking.setAdminNotes(adminNotes);
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}