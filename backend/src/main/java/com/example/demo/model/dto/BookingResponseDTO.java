package com.example.demo.model.dto;

import com.example.demo.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDTO {
    private Long bookingId;
    private String bookingReference;
    private int quantity;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private String eventTitle;
    private Long eventId;
    private String eventImageUrl;
    private LocalDateTime eventDateTime;
    private String eventLocation;
}
