package com.example.demo.model.dto;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private int stars;
    private String trait;
    private String notes;
}
