package com.example.backend.dto.response;

import com.example.backend.enums.OrderStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Integer orderId;
    String code;
    OrderStatus status;
    Double subtotal;
    Double shippingFee;
    Double total;
    LocalDateTime placedAt;
    String fullName;
    String phone;

    String shippingAddress;
    // địa chỉ (province, district, ward)
    LocationResponse location;
    List<OrderItemResponse> items;
    List<ShipmentResponse> shipments;
    List<PaymentResponse> payments;
    UserSimpleResponse user;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LocationResponse {
        String province;
        String district;
        String ward;
    }
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserSimpleResponse {
        Long userId;
        String fullName;
        String email;
    }

}
