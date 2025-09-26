package com.example.backend.dto.requset;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShipmentRequest {
    String carrier;
    String trackingNumber;
    String status; // preparing, shipped, delivered, returned
    LocalDateTime shippedAt;
    LocalDateTime deliveredAt;
}