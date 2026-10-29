package com.example.demo.repository;

import com.example.demo.model.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReceiptItemRepo extends JpaRepository<ReceiptItem, Long> {
    Optional<ReceiptItem> findByBookingReference(String bookingReference);
}