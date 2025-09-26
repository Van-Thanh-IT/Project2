package com.example.backend.dto.requset;
import com.example.backend.dto.response.UserResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    Integer userId; // nếu khách đã đăng nhập
    String code;
    Double subtotal;
    Double shippingFee;
    Double total;
    LocalDateTime placedAt;

    String shippingAddress;
    String fullName; // nếu chưa login
    String phone;

    LocationRequest location;

    List<OrderItemRequest> items;
    List<ShipmentRequest> shipments;
    List<PaymentRequest> payments;


    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LocationRequest {
        String province;
        String district;
        String ward;
    }

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderItemRequest {
        Integer variantId;
        Integer quantity;
        Double price;
    }
}
