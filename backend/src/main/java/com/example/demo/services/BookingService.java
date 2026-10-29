package com.example.demo.services;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.dto.BookingResponseDTO;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {
    @Autowired private BookingRepo bookingRepository;
    @Autowired private UserRepo userRepository;

    public List<BookingResponseDTO> getFilteredBookingsForUser(String userEmail, BookingStatus status, String eventName) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findBookingsWithFilters(user, status, eventName).stream().map(this::toDTO).toList();
    }

    public List<BookingResponseDTO> getTransactionLog() {
        return bookingRepository.findByStatusIn(List.of(BookingStatus.PENDING, BookingStatus.PROCESSING, BookingStatus.PAID, BookingStatus.CANCELLED))
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public BookingResponseDTO completeBooking(Long bookingId, String userEmail) {
        Booking booking = findOwnedBooking(bookingId, userEmail);
        if (booking.getStatus() != BookingStatus.PAID) {
            throw new IllegalStateException("Only paid bookings can be marked as completed.");
        }
        booking.setStatus(BookingStatus.COMPLETED);
        return toDTO(bookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = findOwnedBooking(bookingId, userEmail);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be cancelled");
        }
        booking.setStatus(BookingStatus.PROCESSING);
        booking.setAdminNotes("Cancellation requested by user");
        bookingRepository.save(booking);
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status, String adminNotes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        boolean holdsTickets = booking.getStatus() == BookingStatus.PENDING
                || booking.getStatus() == BookingStatus.PROCESSING
                || booking.getStatus() == BookingStatus.PAID;
        boolean isCancelledOrDeclined = status == BookingStatus.CANCELLED || status == BookingStatus.DECLINED;
        if (holdsTickets && isCancelledOrDeclined && booking.getTicketType() != null) {
            TicketType ticketType = booking.getTicketType();
            ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() + booking.getQuantity());
        }
        booking.setStatus(status);
        booking.setAdminNotes(adminNotes);
        return toDTO(bookingRepository.save(booking));
    }

    private Booking findOwnedBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You can only manage your own bookings.");
        }
        return booking;
    }

    private BookingResponseDTO toDTO(Booking booking) {
        if (booking.getBookingReference() == null || booking.getBookingReference().isBlank()) {
            booking.setBookingReference(BookingReferenceGenerator.generate());
            bookingRepository.save(booking);
        }
        return BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .quantity(booking.getQuantity())
                .totalAmount(booking.getTotalAmount())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .eventTitle(booking.getEvent().getTitle())
                .eventId(booking.getEvent().getEventId())
                .eventImageUrl(booking.getEvent().getImageUrl())
                .eventDateTime(booking.getEvent().getDateTime())
                .eventLocation(booking.getEvent().getLocation())
                .eventCategory(booking.getEvent().getCategory() != null ? booking.getEvent().getCategory().getName() : null)
                .ticketName(booking.getTicketType() != null ? booking.getTicketType().getName() : null)
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .build();
    }
}