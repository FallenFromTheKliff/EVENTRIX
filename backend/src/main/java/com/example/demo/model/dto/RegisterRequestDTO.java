package com.example.demo.model.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class RegisterRequestDTO
{
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String imageUrl;
}
