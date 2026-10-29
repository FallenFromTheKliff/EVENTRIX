package com.example.demo.model.Events;

import com.example.demo.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private int stars;

    @ManyToOne(optional = false)
    @JoinColumn(name = "trait_id")
    private Trait trait;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(columnDefinition = "text")
    private String reply;

    @ManyToOne
    @JoinColumn(name = "replied_by")
    private User repliedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime repliedAt;
}
