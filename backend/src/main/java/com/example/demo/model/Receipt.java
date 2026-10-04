package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // purchaser
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // optional link to payment details table (if you already have it)
    @OneToOne
    @JoinColumn(name = "payment_details_id")
    private PaymentDetails paymentDetails; // assume exists elsewhere

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReceiptItem> items = new ArrayList<>();
}
