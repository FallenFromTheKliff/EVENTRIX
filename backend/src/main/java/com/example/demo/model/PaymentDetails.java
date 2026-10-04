package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "payment_details")
@NoArgsConstructor
public class PaymentDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    // REFACTORED: A payment is linked to a receipt, which represents the entire transaction.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", referencedColumnName = "id", nullable = false, unique = true)
    private Receipt receipt;

    @Column(name = "payment_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    // NEW: Added fields from DTO for more detail
    private String paymentMethod;   // e.g. "Credit Card", "GCash", "PayPal"
    private String referenceNumber; // optional: transaction ref
    private String notes;           // optional: remarks or proof of payment
}