package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import com.example.demo.model.dto.RegisterRequestDTO;
import com.example.demo.model.dto.UserProfileDTO;
import com.example.demo.model.dto.UserStatsDTO;
import com.example.demo.model.dto.UserUpdateDTO;
import com.example.demo.repository.BookingRepo;
import com.example.demo.repository.ReviewRepo;
import com.example.demo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired private UserRepo userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private BookingRepo bookingRepository;
    @Autowired private ReviewRepo reviewRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    public UserProfileDTO getUserProfile(String email) {
        return toProfileDTO(userRepository.getByEmail(email));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User registerNewUser(RegisterRequestDTO request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setProfileImageUrl(request.getImageUrl());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole("USER");
        return userRepository.save(user);
    }

    public UserProfileDTO updateUserDetails(String email, UserUpdateDTO updatedUser) {
        User user = userRepository.getByEmail(email);
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        if (updatedUser.getProfileImageUrl() != null) user.setProfileImageUrl(updatedUser.getProfileImageUrl());
        if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
        if (updatedUser.getAbout() != null) user.setAbout(updatedUser.getAbout());
        return toProfileDTO(userRepository.save(user));
    }

    public UserStatsDTO getUserStats(String email) {
        User user = userRepository.getByEmail(email);
        Double average = reviewRepository.findAverageStarsByUserId(user.getUserId());
        return UserStatsDTO.builder()
                .totalBookings(bookingRepository.countByUserAndStatusNotIn(user, List.of(BookingStatus.CANCELLED, BookingStatus.DECLINED)))
                .averageStars(average == null ? 0.0 : average)
                .joinedAt(user.getCreatedAt())
                .build();
    }

    private UserProfileDTO toProfileDTO(User user) {
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .gender(user.getGender())
                .city(user.getCity())
                .about(user.getAbout())
                .build();
    }

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