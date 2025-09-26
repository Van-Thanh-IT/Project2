package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantRequest {
    String color;
    String size;
    BigDecimal price;
    Double weight;
    Boolean isActive;

    Long productId;
}
