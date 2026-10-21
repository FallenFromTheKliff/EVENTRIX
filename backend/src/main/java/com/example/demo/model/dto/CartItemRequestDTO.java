package com.example.demo.model.dto;

import lombok.Data;

@Data
public class CartItemRequestDTO {
    private Long ticketTypeId;
    private int quantity;
    private boolean separateItem;
}
