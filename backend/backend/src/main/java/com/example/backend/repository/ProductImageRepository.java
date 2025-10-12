package com.example.backend.repository;

import com.example.backend.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProduct_ProductId(Long productId);

    @Query("SELECT p FROM ProductImage p WHERE p.product.id = :productId AND p.isPrimary = true")
    ProductImage findByProductIdAndIsPrimaryTrue(@Param("productId") Long productId);

}
