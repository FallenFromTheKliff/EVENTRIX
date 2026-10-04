package com.example.demo.model;

public enum BookingStatus {
    PENDING, // User has created booking, not yet paid
    PAID,    // Payment confirmed
    COMPLETED, // Event passed and user marked as attended/completed
    CANCELLED, // Cancelled by user or admin
    DECLINED   // Declined by admin
}