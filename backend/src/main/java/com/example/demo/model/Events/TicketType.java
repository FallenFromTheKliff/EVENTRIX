package com.example.demo.model.Events;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    private String name; // e.g. "VIP", "General"

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private int availableQuantity;

    private String description; // optional: "Front row seats + Free drink"

    // Getters and Setters...
}
