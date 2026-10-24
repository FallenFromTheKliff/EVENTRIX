package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "receipt_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    // snapshot of which ticket type was purchased
    private Long ticketTypeId;        // store id to avoid FK issues if tickettype removed later
    private String ticketTypeName;    // snapshot "VIP" or "General"

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPriceSnapshot; // price at time of purchase

    private Integer quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
}
