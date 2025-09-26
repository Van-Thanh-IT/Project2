package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    Integer orderItemId;
    String productName;
    String variantColor;
    String variantSize;
    Double price;
    Integer quantity;
}
