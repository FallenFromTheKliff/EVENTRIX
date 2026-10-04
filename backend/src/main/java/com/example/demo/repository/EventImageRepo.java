package com.example.demo.repository;

import com.example.demo.model.EventImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventImageRepo extends JpaRepository<EventImage, Long> {}