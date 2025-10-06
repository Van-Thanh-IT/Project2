package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    Integer orderItemId;
    String productName;
    String variantColor;
    String variantSize;
    BigDecimal price;
    Integer quantity;
}
