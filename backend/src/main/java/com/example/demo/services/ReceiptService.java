package com.example.demo.services;

import com.example.demo.model.Booking;
import com.example.demo.model.User;
import com.example.demo.model.dto.ReceiptResponseDTO;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.ReceiptItemRepo;
import com.example.demo.repository.ReceiptRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceiptService {
    @Autowired private ReceiptRepo receiptRepository;
    @Autowired private ReceiptItemRepo receiptItemRepository;
    @Autowired private BookingRepo bookingRepository;
    @Autowired private UserRepo userRepository;

    public List<ReceiptResponseDTO> getUserReceipts(String userEmail) {
        User user = userRepository.getByEmail(userEmail);
        return receiptRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(ReceiptResponseDTO::from)
                .toList();
    }

    public ReceiptResponseDTO getBookingReceipt(Long bookingId) {
        return findReceipt(findBooking(bookingId));
    }

    public ReceiptResponseDTO getUserBookingReceipt(Long bookingId, String userEmail) {
        Booking booking = findBooking(bookingId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new SecurityException("You can only view your own receipts.");
        }
        return findReceipt(booking);
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private ReceiptResponseDTO findReceipt(Booking booking) {
        return receiptItemRepository.findByBookingReference(booking.getBookingReference())
                .map(item -> ReceiptResponseDTO.from(item.getReceipt()))
                .orElseThrow(() -> new RuntimeException("Receipt not found"));
    }
}