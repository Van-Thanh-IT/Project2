package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    Cart cart;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = false)
    ProductVariant variant;

    Long quantity;
    BigDecimal price;

    @Column(name = "image_url")
    String imageUrl;

    @Column(updatable = false)
    @CreationTimestamp // tự động gắn thời gian
    LocalDateTime addedAt;
}
