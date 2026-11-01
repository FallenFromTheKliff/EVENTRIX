package com.example.demo.repository;

import com.example.demo.model.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentDetailsRepo extends JpaRepository<PaymentDetails, Long> {

    // 🔍 Find all payments made by a specific user
    List<PaymentDetails> findByUserUserId(long userId);

}