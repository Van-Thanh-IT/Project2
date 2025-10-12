package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.web.multipart.MultipartFile;

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

    @Column(name = "sort_order")
    Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    @ColumnDefault("true")
    Boolean isActive;

    @Column(name = "image_url", length = 255)
    String imageUrl;

    @Column(name = "created_at", updatable = false, insertable = false)
    LocalDateTime createdAt;

    // Quan hệ tự tham chiếu (danh mục cha - con)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    List<Category> children;
}
