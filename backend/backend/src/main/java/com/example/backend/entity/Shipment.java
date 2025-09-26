package com.example.backend.entity;
import com.example.backend.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "shipments")
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    Order order;

    @Column(nullable = false)
    String carrier;

    String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ShipmentStatus status = ShipmentStatus.PREPARING;

    @Column(nullable = false)
    LocalDateTime shippedAt;
    LocalDateTime deliveredAt;

}