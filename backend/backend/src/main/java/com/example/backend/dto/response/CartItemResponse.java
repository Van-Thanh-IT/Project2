package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
     Long cartItemId;
     Long variantId;
     String productName;
     String color;
     String size;
     Long quantity;
     BigDecimal price;
     String imageUrl;
     LocalDateTime addedAt;
}