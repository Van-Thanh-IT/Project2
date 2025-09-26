package com.example.backend.controller;

import com.example.backend.dto.requset.UserRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    OrderService orderService;
    // Lấy thông tin user đang đăng nhập
    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo() {
        return APIResponse.success(userService.getInfo());
    }

    // Lấy tất cả user
    @GetMapping("/read")
    public APIResponse<List<UserResponse>> getAllUsers() {
        return APIResponse.success(userService.getAllUsers());
    }

    // Cập nhật user
    @PutMapping("/update/{userId}")
    public APIResponse<Void> updateUser(
            @PathVariable Long userId,
            @RequestBody UserRequest request
            ) {
        userService.updateUser(userId, request.getFullName() , request.getPhone());
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Sửa người dùng thành công!")
                .build();
    }

    // Xóa user
    @DeleteMapping("/delete/{id}")
    public APIResponse<Void> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Xóa người dùng thành công!")
                .build();
    }

    // Khóa/Mở khóa user
    @PutMapping("/{id}/toggle-active")
    public APIResponse<UserResponse> toggleActive(@PathVariable("id") Long userId) {
        return APIResponse.success(userService.toggleActive(userId));
    }

    //lấy đơn hàng theo user
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Integer userId) {
        List<OrderResponse> responses = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(responses);
    }
}
