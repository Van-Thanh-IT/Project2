package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
     String productName;
     String description;
     BigDecimal price;
     String material;
     String brand;
     Long categoryId;
     String slug;
     Boolean isActive = true;

}
