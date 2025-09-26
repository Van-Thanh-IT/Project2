package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShipmentResponse {
    Integer id;
    String carrier;
    String trackingNumber;
    String status;
    LocalDateTime shippedAt;
    LocalDateTime deliveredAt;
}
