package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    private String bookingReference;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDateTime;
    private Long ticketTypeId;
    private String ticketTypeName;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPriceSnapshot;

    private Integer quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
}