package com.example.demo.repository;

import com.example.demo.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiptRepo extends JpaRepository<Receipt, Long> {
    List<Receipt> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}