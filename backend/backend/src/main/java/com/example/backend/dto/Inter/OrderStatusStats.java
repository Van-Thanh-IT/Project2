package com.example.backend.dto.Inter;

public interface OrderStatusStats {
    String getStatus();      // trạng thái đơn hàng
    Integer getTotalOrders(); // số lượng đơn hàng
}
