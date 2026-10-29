package com.example.demo.model.dto;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private int stars;
    private Long traitId;
    private String notes;
}
