package com.example.backend.repository;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByCategoryName(String categoryName);
    boolean existsBySlug(String slug);

    @Query("SELECT MAX(c.sortOrder) FROM Category c")
    Integer findMaxSortOrder();




}
