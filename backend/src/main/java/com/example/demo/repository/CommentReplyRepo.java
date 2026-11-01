// CommentReplyRepository.java
package com.example.demo.repository;

import com.example.demo.model.Events.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentReplyRepo extends JpaRepository<CommentReply, Long> {}
