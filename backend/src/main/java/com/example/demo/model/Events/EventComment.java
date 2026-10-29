// EventComment.java
package com.example.demo.model.Events;

import lombok.*;
import jakarta.persistence.*;
import com.example.demo.model.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventComment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "text")
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Admin replies (multiple replies allowed)
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CommentReply> replies = new ArrayList<>();
}
