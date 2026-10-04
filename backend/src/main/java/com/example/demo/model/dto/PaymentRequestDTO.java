package com.example.demo.model.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long BookingId;
    private String paymentMethod;   // e.g. "Credit Card", "GCash", "PayPal"
    private String referenceNumber; // optional: transaction ref
    private String notes;           // optional: remarks or proof of payment
}
