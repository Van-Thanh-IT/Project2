package com.example.backend.entity;
import com.example.backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer orderId;

    @Column(unique = true, nullable = false)
    String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    Double subtotal;

    @Column(nullable = false)
    Double shippingFee;

    @Column(nullable = false)
    Double total;

    @Column(nullable = false)
    LocalDateTime placedAt;

    @Column(nullable = false)
    String shippingAddress;

    String fullName; // nếu khách chưa đăng nhập
    String phone;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "location_id", nullable = true)
    Location location;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<Shipment> shipments;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<Payment> payments;




}