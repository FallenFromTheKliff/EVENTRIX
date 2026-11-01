package com.example.demo.controller;

import com.example.demo.jwt.JwtUtil;
import com.example.demo.model.dto.AuthRequestDTO;
import com.example.demo.model.dto.AuthResponseDTO;
import com.example.demo.model.dto.RegisterRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.demo.services.UserService;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    //LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequestDTO authRequest) {
        if (authRequest.getEmail() == null || authRequest.getEmail().isBlank()
                || authRequest.getPassword() == null || authRequest.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }
        authRequest.setEmail(authRequest.getEmail().trim().toLowerCase(Locale.ROOT));
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
            UserDetails userDetails = userService.loadUserByUsername(authRequest.getEmail());
            return ResponseEntity.ok(new AuthResponseDTO(jwtUtil.generateToken(userDetails)));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }
    }

    //REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        if (registerRequest.getName() == null || registerRequest.getName().isBlank()
                || registerRequest.getEmail() == null || registerRequest.getEmail().isBlank()
                || registerRequest.getPassword() == null || registerRequest.getPassword().isBlank()
                || registerRequest.getPhoneNumber() == null
                || registerRequest.getPhoneNumber().isBlank()) {
            return ResponseEntity.badRequest().body("All registration fields are required.");
        }

        String email = registerRequest.getEmail().trim().toLowerCase(Locale.ROOT);
        registerRequest.setEmail(email);

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest().body("Enter a valid email address.");
        }
        if (registerRequest.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters.");
        }
        if (!registerRequest.getPhoneNumber().matches("\\d{11}")) {
            return ResponseEntity.badRequest().body("Phone number must be 11 digits.");
        }
        if (userService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use.");
        }

        userService.registerNewUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
