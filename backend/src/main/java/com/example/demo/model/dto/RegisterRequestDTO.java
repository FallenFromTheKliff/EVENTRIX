package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequestDTO
{
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String imageUrl;
}
