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

    // Category (có thể chỉ lấy id + name)
    Long categoryId;
    String categoryName;

    // Danh sách ảnh
    List<ImageResponse> images;

    // Danh sách biến thể
    List<ProductVariantResponse> variants;

}
