package com.example.demo.model.dto;

import lombok.Builder;
import lombok.Data;
import com.example.demo.model.Events.Category;
import com.example.demo.model.Events.TicketType;
import com.example.demo.model.EventImage;

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
    private Category category;
    private List<EventImage> previewImages;
    private List<TicketType> ticketTypes;
    private long likeCount;
    private boolean isLiked; // Specific to the requesting user
    private int totalTickets;
    private int availableTickets;
    private LocalDateTime doorsOpen;
}