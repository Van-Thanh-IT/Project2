package com.example.backend.dto.requset;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {
    Long variantId;
    Long quantity;
    BigDecimal price;
    String imageUrl;
}