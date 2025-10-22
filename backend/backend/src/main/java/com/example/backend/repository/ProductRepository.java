package com.example.backend.repository;

import com.example.backend.dto.Inter.HomeProductProjection;
import com.example.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
        // Sản phẩm bán chạy
        @Query(value = """
            SELECT 
                p.product_id AS productId,
                p.product_name AS productName,
                p.description AS description,
                p.material AS material,
                p.slug AS slug,
                p.price AS price,
                p.brand AS brand,
                pi.image_url AS imageUrl,
                p.category_id AS categoryId,
                c.category_name AS categoryName,
                COALESCE(SUM(oi.quantity), 0) AS totalSold
            FROM products p
            LEFT JOIN product_variants v ON v.product_id = p.product_id
            LEFT JOIN order_items oi ON oi.variant_id = v.variant_id
            LEFT JOIN orders o ON o.order_id = oi.order_id AND o.status = 'DELIVERED'
            LEFT JOIN (
                SELECT product_id, MIN(image_url) AS image_url
                FROM product_images
                WHERE is_primary = true
                GROUP BY product_id
            ) pi ON pi.product_id = p.product_id
            LEFT JOIN categories c ON c.category_id = p.category_id
            WHERE p.is_active = true
            GROUP BY p.product_id, p.product_name, p.description, p.material, 
                     p.slug, p.price, p.brand, pi.image_url, p.category_id, 
                     c.category_name
            HAVING COALESCE(SUM(oi.quantity), 0) >= 20  -- 🔹 sản phẩm bán chạy
            ORDER BY totalSold DESC
            LIMIT 8
        """, nativeQuery = true)
        List<HomeProductProjection> findTopSellingProductsForHome();


        // Sản phẩm thường
        @Query(value = """
            SELECT 
                p.product_id AS productId,
                p.product_name AS productName,
                p.description AS description,
                p.material AS material,
                p.slug AS slug,
                p.price AS price,
                p.brand AS brand,
                pi.image_url AS imageUrl,
                p.category_id AS categoryId,
                c.category_name AS categoryName,
                COALESCE(SUM(oi.quantity), 0) AS totalSold
            FROM products p
            LEFT JOIN product_variants v ON v.product_id = p.product_id
            LEFT JOIN order_items oi ON oi.variant_id = v.variant_id
            LEFT JOIN orders o ON o.order_id = oi.order_id AND o.status = 'DELIVERED'
            LEFT JOIN (
                SELECT product_id, MIN(image_url) AS image_url
                FROM product_images
                WHERE is_primary = true
                GROUP BY product_id
            ) pi ON pi.product_id = p.product_id
            LEFT JOIN categories c ON c.category_id = p.category_id
            WHERE p.is_active = true
            GROUP BY p.product_id, p.product_name, p.description, p.material, 
                     p.slug, p.price, p.brand, pi.image_url, p.category_id, 
                     c.category_name
            HAVING COALESCE(SUM(oi.quantity), 0) < 20  
            ORDER BY totalSold DESC
            LIMIT 20
        """, nativeQuery = true)
        List<HomeProductProjection> findAllActiveHomeProductsNative();

        // tìm kiếm sản pẩm
        @Query(
                value = """
                SELECT 
                    p.product_id AS productId,
                    p.product_name AS productName,
                    p.description as description,
                    p.material as material,
                    p.slug AS slug,
                    p.price AS price,
                    p.brand AS brand,
                    pi.image_url AS imageUrl,
                    p.category_id AS categoryId
                FROM products p
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM product_images
                    WHERE is_primary = true
                    GROUP BY product_id
                ) pi ON pi.product_id = p.product_id
                WHERE p.is_active = true
                  AND (p.product_name LIKE %:keyword%
                       OR p.brand LIKE %:keyword%
                       OR p.material LIKE %:keyword%)
            """,
                nativeQuery = true
        )
        List<HomeProductProjection> searchProducts(@Param("keyword") String keyword);

        // Tìm sản phẩm theo slug danh mục (SEO-friendly)
        @Query(
                value = """
                SELECT 
                    p.product_id AS productId,
                    p.product_name AS productName,
                    p.description AS description,
                    p.material AS material,
                    p.slug AS slug,
                    p.price AS price,
                    p.brand AS brand,
                    pi.image_url AS imageUrl,
                    p.category_id AS categoryId
                FROM products p
                JOIN categories c ON c.category_id = p.category_id
                LEFT JOIN (
                    SELECT product_id, MIN(image_url) AS image_url
                    FROM product_images
                    WHERE is_primary = true
                    GROUP BY product_id
                ) pi ON pi.product_id = p.product_id
                WHERE p.is_active = true
                  AND (
                      -- nếu slug là danh mục cha => lấy cả cha và con
                      c.slug = :slug
                      OR c.parent_id = (SELECT category_id FROM categories WHERE slug = :slug)
                  )
            """,
                nativeQuery = true
        )
        List<HomeProductProjection> findProductsByCategorySlug(@Param("slug") String slug);
        boolean existsBySlug(String slug);
        Optional<Product> findBySlug(String slug);
    }
