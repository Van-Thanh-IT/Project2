package com.example.backend.dto.requset;
import com.example.backend.dto.response.UserResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    Long orderId;
    Long userId;
    String code;
    Double subtotal;
    Double shippingFee;
    BigDecimal total;
    LocalDateTime placedAt;

    String shippingAddress;
    String fullName; // nếu chưa login
    String phone;
    Integer locationId;

    List<OrderItemRequest> items;
    List<ShipmentRequest> shipments;
    List<PaymentRequest> payments;



    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderItemRequest {
        Integer variantId;
        Integer quantity;
        Double price;
    }
}
