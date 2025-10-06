package com.example.backend.dto.Inter;
// Báo cáo tồn kho hiện tại
public interface InventoryStatus {
    Long getVariantId();
    String getProductName();
    String getColor();
    String getSize();
    Integer getQuantity();
    Integer getSafetyStock();
}