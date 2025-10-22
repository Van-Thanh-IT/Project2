package com.example.backend.dto.Inter;

import java.math.BigDecimal;
import java.util.List;

// chỉ trả về các trường cần thiết
public interface HomeProductProjection {
    Long getProductId();
    String getProductName();
    String getDescription();
    String getMaterial();
    String getSlug();
    BigDecimal getPrice();
    String getBrand();
    String getImageUrl();       // ảnh primary
    Long getCategoryId();
    Long getTotalSold();

}
