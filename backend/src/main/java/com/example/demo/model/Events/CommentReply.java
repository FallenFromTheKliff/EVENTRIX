// CommentReply.java
package com.example.demo.model.Events;

import jakarta.persistence.*;
import lombok.*;
import com.example.demo.model.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment_replies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentReply {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // reply is linked to the comment
    @ManyToOne(optional = false)
    @JoinColumn(name = "comment_id")
    private EventComment comment;

    // who replied — typically admin user
    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id")
    private User user;

    @Column(columnDefinition = "text")
    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();
}
