package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    Long variantId;
    @Column(nullable = false, length = 50)
    String color;

    @Column(nullable = false, length = 50)
    String size;

    @Column(nullable = false, precision = 12, scale = 2)
    BigDecimal price;

    Double weight;

    Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

}
