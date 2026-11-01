package com.example.demo.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDTO {
    private String name;
    private String phoneNumber;
    private String currentPassword;
    private String newPassword;
    private String profileImageUrl;
    private String bannerImageUrl;
    private String gender;
    private String city;
    private String about;
    private String birthday;
    private Boolean privateProfile;
}