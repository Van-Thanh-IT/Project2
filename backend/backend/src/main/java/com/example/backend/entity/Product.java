package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    Long productId;

    @Column(name = "product_name",nullable = false, length = 255)
    String productName;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    String material;
    String brand;

    @Column(nullable = false, unique = true, length = 150)
    String slug;

    Boolean isActive;

    @Column(updatable = false, insertable = false)
    LocalDateTime createdAt;

    // QUAN HỆ VỚI Category (nếu có entity Category)
    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    // QUAN HỆ 1-nhiều với ProductVariant
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProductVariant> variants;

    // QUAN HỆ 1-nhiều với Product_Images
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ProductImage> images = new ArrayList<>();


}
