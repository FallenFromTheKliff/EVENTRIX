package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserStatsDTO {
    private long totalBookings;
    private double averageStars;
    private LocalDateTime joinedAt;
}