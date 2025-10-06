package com.example.backend.service;

import com.example.backend.dto.requset.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.Review;
import com.example.backend.entity.User;
import com.example.backend.enums.OrderStatus;
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

        review.setUser(user);
        review.setProduct(product);

        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    // Update
    public ReviewResponse update(Long id, ReviewRequest request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Id: " + id));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
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

    // Get by Id
    public ReviewResponse getById(Long id) {
        return reviewMapper.toReviewResponse(reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found")));
    }

    // Get all
    public List<ReviewResponse> getAll() {
        return reviewRepository.findAll()
                .stream().map(reviewMapper::toReviewResponse).collect(Collectors.toList());
    }

    // Get by product
    public List<ReviewResponse> getByProduct(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream().map(reviewMapper::toReviewResponse).collect(Collectors.toList());
    }

    // Get by user
    public List<ReviewResponse> getByUser(Long userId) {
        return reviewRepository.findByUser_UserId(userId)
                .stream().map(reviewMapper::toReviewResponse).collect(Collectors.toList());
    }
}
