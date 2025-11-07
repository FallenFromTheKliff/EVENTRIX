package com.eventrix.backend.service;

import com.eventrix.backend.model.User;
import com.eventrix.backend.repository.UserRepository;
import com.eventrix.backend.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials!");
        }

        return jwtService.generateToken(user);
    }
    public String register(String name, String email, String phoneNumber, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use!");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .phoneNumber(phoneNumber)
                .password(passwordEncoder.encode(password))
                .role("USER")
                .build();
        userRepository.save(user);
        return "Registered successfully!";
    }
}
