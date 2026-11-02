package com.example.demo.services;

import com.example.demo.model.BookingStatus;
import com.example.demo.model.User;
import com.example.demo.model.Details;
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
import java.util.Set;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

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
        String phone = updatedUser.getPhoneNumber();
        LocalDate birthday = null;
        if (updatedUser.getName() != null && updatedUser.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (phone != null && !phone.matches("\\d{11}") && !(phone.isEmpty() && "ADMIN".equals(user.getRole()))) {
            throw new IllegalArgumentException("Phone number must be 11 digits.");
        }
        if (updatedUser.getNewPassword() != null && !updatedUser.getNewPassword().isEmpty()) {
            if (updatedUser.getNewPassword().length() < 8) {
                throw new IllegalArgumentException("Password must be at least 8 characters.");
            }
            if (updatedUser.getCurrentPassword() == null || !passwordEncoder.matches(updatedUser.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
        }
        if (updatedUser.getGender() != null && !updatedUser.getGender().isEmpty() && !Details.GENDERS.contains(updatedUser.getGender())) {
            throw new IllegalArgumentException("Choose a gender from the list.");
        }
        if (updatedUser.getCity() != null && !updatedUser.getCity().isEmpty() && !Details.CITIES.contains(updatedUser.getCity())) {
            throw new IllegalArgumentException("Choose a city from the list.");
        }
        if (updatedUser.getBirthday() != null && !updatedUser.getBirthday().isEmpty()) {
            try {
                birthday = LocalDate.parse(updatedUser.getBirthday());
            } catch (DateTimeParseException ex) {
                throw new IllegalArgumentException("Enter a valid birthday.");
            }
            if (birthday.isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("Birthday cannot be in the future.");
            }
        }
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());
        if (updatedUser.getNewPassword() != null && !updatedUser.getNewPassword().isEmpty()) user.setPassword(passwordEncoder.encode(updatedUser.getNewPassword()));
        if (updatedUser.getProfileImageUrl() != null) user.setProfileImageUrl(updatedUser.getProfileImageUrl());
        if (updatedUser.getBannerImageUrl() != null) user.setBannerImageUrl(updatedUser.getBannerImageUrl());
        if (updatedUser.getGender() != null) user.setGender(updatedUser.getGender());
        if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
        if (updatedUser.getAbout() != null) user.setAbout(updatedUser.getAbout());
        if (updatedUser.getBirthday() != null) user.setBirthday(birthday);
        if (updatedUser.getPrivateProfile() != null) user.setPrivateProfile(updatedUser.getPrivateProfile());
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
                .bannerImageUrl(user.getBannerImageUrl())
                .gender(user.getGender())
                .city(user.getCity())
                .about(user.getAbout())
                .birthday(user.getBirthday())
                .privateProfile(user.isPrivateProfile())
                .createdAt(user.getCreatedAt())
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