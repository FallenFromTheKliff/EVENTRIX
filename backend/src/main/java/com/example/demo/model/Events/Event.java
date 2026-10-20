package com.example.demo.model.Events;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.demo.model.Booking;
import com.example.demo.model.EventImage; // NEW: Import
import com.example.demo.model.EventStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// NEW: Enum for event status

@Builder
@Entity
@Table(name = "event")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String location;

    // REFACTORED: The base price is now on TicketType, this can be removed or used as a default.
    // For simplicity, we'll keep it as a 'starting from' price display.
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_tickets", nullable = false)
    private int totalTickets;

    @Column(name = "available_tickets")
    private int availableTickets;

    @Column(name = "doors_open")
    private LocalDateTime doorsOpen;

    @Column(name = "show_time")
    private LocalDateTime showTime;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_url", columnDefinition = "TEXT") // This will now serve as the thumbnail/main photo
    private String imageUrl;

    // NEW: Status for archiving events
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.ACTIVE;

    // NEW: List of preview images
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @Builder.Default
    private List<EventImage> previewImages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();

    @PrePersist
    public void setAvailableTickets() {
        if (this.availableTickets == 0 && this.totalTickets > 0) {
            this.availableTickets = this.totalTickets;
        }
    }

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TicketType> ticketTypes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EventComment> comments = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EventLike> likes = new ArrayList<>();
}