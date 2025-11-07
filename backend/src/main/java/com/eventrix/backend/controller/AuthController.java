package com.eventrix.backend.controller;

import com.eventrix.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String jwt = authService.login(body.get("email"), body.get("password"));
        return ResponseEntity.ok(Map.of("jwt", jwt));
    }
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register (@RequestBody Map<String, String> body) {
        String message = authService.register(
                body.get("name"),
                body.get("email"),
                body.get("phoneNumber"),
                body.get("password")
        );
        return ResponseEntity.ok(Map.of("message", message));
    }
}
