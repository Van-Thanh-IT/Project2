package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    Long categoryId;

    @Column( name = "category_name",nullable = false, length = 150)
    String categoryName;

    @Column(nullable = false, unique = true, length = 150)
    String slug;

    // Quan hệ tự tham chiếu (danh mục cha - con)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    List<Category> children;

    @Column(name = "sort_order")
    Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    Boolean isActive = true;

    @Column(name = "image_url", length = 255)
    String imageUrl;

    @Column(name = "created_at", updatable = false, insertable = false)
    LocalDateTime createdAt;
}
