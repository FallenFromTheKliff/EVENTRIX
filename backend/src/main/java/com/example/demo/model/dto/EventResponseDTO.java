package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.EventImage;
import com.example.demo.model.EventStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventResponseDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private BigDecimal price;
    private String thumbnailUrl; // Main photo
    private String category;
    private List<EventImage> previewImages;
    private List<TicketType> ticketTypes;
    private long likeCount;
    private boolean isLiked; // Specific to the requesting user
    private int totalTickets;
    private LocalDateTime doorsOpen;
    private LocalDateTime showTime;
    private EventStatus status;
}