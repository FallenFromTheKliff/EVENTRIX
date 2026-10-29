package com.example.demo.model.dto;

import com.example.demo.model.PaymentDetails;
import com.example.demo.model.Receipt;
import com.example.demo.model.ReceiptItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReceiptResponseDTO {
    private Long receiptId;
    private LocalDateTime createdAt;
    private String userName;
    private String userEmail;
    private String paymentMethod;
    private String referenceNumber;
    private BigDecimal totalAmount;
    private List<ItemDTO> items;

    public static ReceiptResponseDTO from(Receipt receipt) {
        PaymentDetails payment = receipt.getPaymentDetails();
        return ReceiptResponseDTO.builder()
                .receiptId(receipt.getId())
                .createdAt(receipt.getCreatedAt())
                .userName(receipt.getUser().getName())
                .userEmail(receipt.getUser().getEmail())
                .paymentMethod(payment == null ? null : payment.getPaymentMethod())
                .referenceNumber(payment == null ? null : payment.getReferenceNumber())
                .totalAmount(receipt.getTotalAmount())
                .items(receipt.getItems().stream().map(ItemDTO::from).toList())
                .build();
    }

    @Data
    @Builder
    public static class ItemDTO {
        private String bookingReference;
        private String eventTitle;
        private String eventLocation;
        private LocalDateTime eventDateTime;
        private String ticketName;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal subtotal;

        public static ItemDTO from(ReceiptItem item) {
            return ItemDTO.builder()
                    .bookingReference(item.getBookingReference())
                    .eventTitle(item.getEventTitle())
                    .eventLocation(item.getEventLocation())
                    .eventDateTime(item.getEventDateTime())
                    .ticketName(item.getTicketTypeName())
                    .unitPrice(item.getUnitPriceSnapshot())
                    .quantity(item.getQuantity())
                    .subtotal(item.getSubtotal())
                    .build();
        }
    }
}