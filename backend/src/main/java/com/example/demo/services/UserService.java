package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.model.dto.RegisterRequestDTO;
import com.example.demo.model.dto.UserProfileDTO;
import com.example.demo.model.dto.UserUpdateDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired private UserRepo userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())) // REFACTORED: Use ROLE_ prefix
        );
    }

    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User registerNewUser(RegisterRequestDTO request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setProfileImageUrl(request.getImageUrl());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole("USER"); // Default role
        return userRepository.save(user);
    }

    // REFACTORED: Uses DTO to prevent illegal updates (like changing role).
    public UserProfileDTO updateUserDetails(String email, UserUpdateDTO updatedUser) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty())
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        if (updatedUser.getProfileImageUrl() != null)
            user.setProfileImageUrl(updatedUser.getProfileImageUrl());

        User savedUser = userRepository.save(user);
        return getUserProfile(savedUser.getEmail());
    }

    // --- Admin Methods ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found.");
        }
        userRepository.deleteById(id);
    }
}