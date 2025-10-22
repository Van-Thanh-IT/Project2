package com.example.backend.service;

import com.example.backend.dto.Inter.ProductRatingStats;
import com.example.backend.dto.requset.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.Review;
import com.example.backend.entity.User;
import com.example.backend.enums.ReviewStatus;
import com.example.backend.mapper.ReviewMapper;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    // Create
    public ReviewResponse create(ReviewRequest request) {
        Review review = reviewMapper.toEntity(request);
        review.setCreatedAt(LocalDateTime.now());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm nào để đánh giá"));

        review.setStatus(ReviewStatus.PENDING);
        review.setUser(user);
        review.setProduct(product);

        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }


    // Update
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {
        Review existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        existingReview.setRating(request.getRating());
        existingReview.setComment(request.getComment());

        return reviewMapper.toReviewResponse(reviewRepository.save(existingReview));
    }

    // Delete
    public void delete(Long id) {
        if (!reviewRepository.existsById(id))
            throw new RuntimeException("Review not found");
        reviewRepository.deleteById(id);
    }

    //approved/hiden
    public Review toggleReviewVisibility(Long reviewId, String status){
        Review review = reviewRepository.findById(reviewId).orElseThrow(
                () ->   new RuntimeException("Không tìm thấy reviewId: " + reviewId)
        );
        try {
            // Chuyển String thành enum
            ReviewStatus reviewStatus = ReviewStatus.valueOf(status.toUpperCase());
            review.setStatus(reviewStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("cập nhật trạng thái không hợp lệ: " + status);
        }

        return reviewRepository.save(review);
    }


    // Get all
    public List<ReviewResponse> getAll() {
        return reviewRepository.findAll()
                .stream().map(reviewMapper::toReviewResponse).collect(Collectors.toList());
    }


    // Lấy thống kê đánh giá theo productId
    public ProductRatingStats getProductReviewStats(Long productId) {
        ProductRatingStats stats = reviewRepository.getStats(productId);

        if (stats == null) {
            // Nếu sản phẩm chưa có review, trả về giá trị mặc định
            return new ProductRatingStats() {
                @Override
                public Double getAverageRating() {
                    return 0.0;
                }

                @Override
                public Long getReviewCount() {
                    return 0L;
                }
            };
        }
        return stats;
    }

    // Get by user
    public List<ReviewResponse> getByUser(Long userId) {
        return reviewRepository.findByUser_UserId(userId)
                .stream().map(reviewMapper::toReviewResponse).collect(Collectors.toList());
    }
}
