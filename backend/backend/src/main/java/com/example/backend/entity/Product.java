package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@Entity
//@Table(name = "products")
public class Product {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "product_id")
//    private Long productId;
//
//    @Column(name = "product_name",nullable = false, length = 255)
//    private String productName;
//
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    @Column(nullable = false, precision = 12, scale = 2)
//    private Double price;
//
//    private String material;
//    private String brand;
//
//    @Column(nullable = false, unique = true, length = 150)
//    private String slug;
//
//    private Boolean isActive = true;
//
//    @Column(updatable = false, insertable = false)
//    private LocalDateTime createdAt;
//
//    // QUAN HỆ VỚI Category (nếu có entity Category)
//    @ManyToOne
//    @JoinColumn(name = "category_id")
//    private Category category;
//
//    // QUAN HỆ 1-nhiều với ProductVariant
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ProductVariant> variants;

    // getter/setter
}
