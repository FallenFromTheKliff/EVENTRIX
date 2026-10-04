// EventLike.java
package com.example.demo.model.Events;

import jakarta.persistence.*;
import lombok.*;
import com.example.demo.model.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventLike {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime likedAt = LocalDateTime.now();
}
