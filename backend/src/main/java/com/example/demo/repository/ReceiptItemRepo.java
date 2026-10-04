// ReceiptItemRepository.java
package com.example.demo.repository;

import com.example.demo.model.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptItemRepo extends JpaRepository<ReceiptItem, Long> {}
