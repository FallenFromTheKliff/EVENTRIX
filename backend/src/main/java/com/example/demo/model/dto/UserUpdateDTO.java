package com.example.demo.model.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String name;
    private String phoneNumber;
    private String password; // Keep password field for updates
    private String profileImageUrl;
}