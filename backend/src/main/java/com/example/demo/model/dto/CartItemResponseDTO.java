package com.example.demo.model.dto;

import com.example.demo.model.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CartItemResponseDTO {
    private Long id;
    private Integer quantity;
    private TicketTypeDTO ticketType;
    private Long eventId;
    private String eventTitle;
    private String eventImageUrl;
    private LocalDateTime eventDateTime;
    private String eventLocation;
    private String eventCategory;
    private String bookingReference;

    public static CartItemResponseDTO from(CartItem item) {
        var ticket = item.getTicketType();
        var event = ticket.getEvent();

        return new CartItemResponseDTO(
            item.getId(),
            item.getQuantity(),
            new TicketTypeDTO(
                ticket.getId(),
                ticket.getName(),
                ticket.getPrice()
            ),
            event.getEventId(),
            event.getTitle(),
            event.getImageUrl(),
            event.getDateTime(),
            event.getLocation(),
            event.getCategory() != null ? event.getCategory().getName() : null,
            item.getBookingReference()
        );
    }

    @Data
    @AllArgsConstructor
    public static class TicketTypeDTO {
        private Long id;
        private String name;
        private BigDecimal price;
    }
}