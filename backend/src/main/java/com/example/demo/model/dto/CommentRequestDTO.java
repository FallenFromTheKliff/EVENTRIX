package com.example.demo.model.dto;

import lombok.Data;

@Data
public class CommentRequestDTO {
    private String content;
    private int rating; // 1–5 stars rating
}
