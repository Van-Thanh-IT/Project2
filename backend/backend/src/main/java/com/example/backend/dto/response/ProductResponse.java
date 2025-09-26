package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long productId;
    String productName;
    String description;
    BigDecimal price;
    String material;
    String brand;
    String slug;
    Boolean isActive;
    LocalDateTime createdAt;
    Long categoryId;
    // Danh sách ảnh
    List<ProductImageResponse> images;
//
//    // Danh sách biến thể
//    List<ProductVariantResponse> variants;

}
