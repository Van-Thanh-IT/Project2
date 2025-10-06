package com.example.backend.repository;

import com.example.backend.dto.Inter.ProductRatingStats;
import com.example.backend.dto.Inter.ProductReviewSummary;
import com.example.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_ProductId(Long productId);
    List<Review> findByUser_UserId(Long userId);

    @Query(
            value = """
            SELECT 
                p.product_name AS productName,
                AVG(r.rating) AS averageRating,
                COUNT(r.review_id) AS reviewCount
            FROM reviews r
            JOIN products p ON r.product_id = p.product_id
            WHERE r.status = 'APPROVED'
            GROUP BY p.product_id, p.product_name
            ORDER BY averageRating DESC
        """,
            nativeQuery = true
    )
    List<ProductRatingStats> findTopRatedProducts();

    @Query(
            value = """
            SELECT 
                p.product_name AS productName,
                AVG(r.rating) AS averageRating,
                COUNT(r.review_id) AS reviewCount
            FROM reviews r
            JOIN products p ON r.product_id = p.product_id
            WHERE r.status = 'APPROVED'
            GROUP BY p.product_id, p.product_name
            ORDER BY averageRating ASC
        """,
            nativeQuery = true
    )
    List<ProductRatingStats> findLowestRatedProducts();



    // đánh giá sp
    @Query(value = """
        SELECT 
            p.product_id AS productId,
            p.product_name AS productName,
            AVG(r.rating) AS averageRating,
            COUNT(r.review_id) AS reviewCount
        FROM reviews r
        JOIN products p ON r.product_id = p.product_id
        WHERE r.status = 'APPROVED'
        GROUP BY p.product_id, p.product_name
        ORDER BY p.product_id ASC
    """, nativeQuery = true)
    List<ProductReviewSummary> findProductReviewSummary();

}
