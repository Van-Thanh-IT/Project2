package com.example.backend.dto.Inter;

public interface ProductReviewSummary {
    Integer getProductId();
    String getProductName();
    Double getAverageRating();
    Integer getReviewCount();
}