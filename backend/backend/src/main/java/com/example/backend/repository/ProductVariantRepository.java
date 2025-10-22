package com.example.backend.repository;

import com.example.backend.entity.Product;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProduct_ProductId(Long productId);

    // Dùng khi thêm mới
    boolean existsByProductAndSize(Product product, String size);
    boolean existsByProductAndColor(Product product, String color);
    boolean existsByProductAndPrice(Product product, BigDecimal price);
    boolean existsByProductAndWeight(Product product, Double weight);


    boolean existsByProductAndSizeAndVariantIdNot(Product product, String size, Long variantId);
    boolean existsByProductAndColorAndVariantIdNot(Product product, String color, Long variantId);
    boolean existsByProductAndPriceAndVariantIdNot(Product product, BigDecimal price, Long variantId);
    boolean existsByProductAndWeightAndVariantIdNot(Product product, Double weight, Long variantId);

}
