package com.example.backend.controller;
import com.example.backend.dto.requset.ReviewRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // tạo đánh giá
    @PostMapping("/create")
    public APIResponse<Void> create(@RequestBody ReviewRequest request) {
        reviewService.create(request);
        return APIResponse.<Void>builder()
                .messages("Bạn đã tạo đánh giá thành công!")
                .build();
    }

    //sửa đánh giá
    @PutMapping("/{reviewId}/update")
    public APIResponse<Void> update(@PathVariable Long reviewId,@RequestBody ReviewRequest request) {
        reviewService.update(reviewId,request);
        return APIResponse.<Void>builder()
                .messages("Bạn đã sửa đánh giá thành công!")
                .build();
    }

    // ẩn/hiện đánh giá
    @PatchMapping("/{id}/status")
    public APIResponse<Void> toggleStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        reviewService.toggleReviewVisibility(id, status);
        return APIResponse.<Void>builder()
                .messages("Cập nhật trạng thái đánh giá thành công")
                .build();
    }

    // xóa đánh giá
    @DeleteMapping("/delete/{reviewId}")
    public APIResponse<Void> delete(@PathVariable Long reviewId) {
        reviewService.delete(reviewId);
        return APIResponse.<Void>builder()
                .messages("Bạn đã xóa đánh giá có Id:" + reviewId + "thành công")
                .build();
    }

    // lấy tất cả danh sách đánh giá
    @GetMapping
    public APIResponse<List<ReviewResponse>> getAll() {
        return APIResponse.success(reviewService.getAll());
    }

    // lấy dl đánh giá theo id sản phẩm
    @GetMapping("/product/{productId}")
    public APIResponse<List<ReviewResponse>> getByProduct(@PathVariable Long productId) {
        return APIResponse.<List<ReviewResponse>>builder()
                .code(200)
                .data(reviewService.getAll())
                .build();
    }
    //lấy dl đánh giá theo id người dùng
    @GetMapping("/user/{userId}")
    public APIResponse<List<ReviewResponse>> getByUser(@PathVariable Long userId) {
        return APIResponse.<List<ReviewResponse>>builder()
                .code(200)
                .data(reviewService.getAll())
                .build();
    }
}
