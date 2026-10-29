package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponseDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String userName;
    private int stars;
    private String trait;
    private String notes;
    private LocalDateTime createdAt;
    private String reply;
    private LocalDateTime repliedAt;
    private boolean editable;
}
