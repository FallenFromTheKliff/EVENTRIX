package com.example.demo.repository;

import com.example.demo.model.Events.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByEventEventIdOrderByCreatedAtDesc(Long eventId);
    List<Review> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Review> findByUserUserIdAndEventEventId(Long userId, Long eventId);

    @Query("SELECT AVG(r.stars) FROM Review r WHERE r.user.userId = :userId")
    Double findAverageStarsByUserId(@Param("userId") Long userId);
}
