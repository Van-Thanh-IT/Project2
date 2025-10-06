package com.example.backend.dto.Inter;

import java.time.LocalDateTime;

// Báo cáo lịch sử nhập/xuất
public interface InventoryTransactionReport {
    Long getTransactionId();
    String getProductName();
    String getColor();
    String getSize();
    String getTransactionType();
    Integer getQuantity();
    String getTransactionSource();
    String getNote();
    String getCreatedBy();
    LocalDateTime getTransactionDate();
}