package com.example.backend.controller;

import com.example.backend.dto.requset.CartItemRequest;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;


    // Lấy giỏ hàng của người dùng
    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }


     // Thêm sản phẩm vào giỏ
    @PostMapping("/{userId}/add")
    public CartResponse addToCart(@PathVariable Long userId,
                                  @RequestBody CartItemRequest request) {
        return cartService.addToCart(userId, request);
    }


     // Xóa 1 sản phẩm trong giỏ hàng
    @DeleteMapping("/{userId}/remove/{cartItemId}")
    public CartResponse removeItem(@PathVariable Long userId,
                                   @PathVariable Long cartItemId) {
        return cartService.removeItem(userId, cartItemId);
    }

}