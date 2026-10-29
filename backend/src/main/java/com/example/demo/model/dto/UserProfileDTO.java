package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDTO {
    private Long userId;
    private String email;
    private String name;
    private String phoneNumber;
    private String role;
    private String profileImageUrl;
    private String gender;
    private String city;
    private String about;
}