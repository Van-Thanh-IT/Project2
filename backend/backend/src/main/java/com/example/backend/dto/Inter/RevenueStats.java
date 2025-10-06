package com.example.backend.dto.Inter;

import java.time.LocalDateTime;

// RevenueStats.java
public interface RevenueStats {
    String getPlacedAt(); // nhận ngày/tháng/năm từ DB getPlacedAt();
    Double getTotalRevenue();
    Long getTotalOrders();
}
