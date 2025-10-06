package com.example.backend.service;

import com.example.backend.dto.requset.CartItemRequest;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;
import com.example.backend.entity.ProductVariant;
import com.example.backend.entity.User;
import com.example.backend.mapper.CartMapper;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    ProductVariantRepository productVariantRepository;
    UserRepository userRepository;

    CartMapper cartMapper;

    // Lấy hoặc tạo mới giỏ hàng
    public Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setCreatedAt(LocalDateTime.now());
                    cart.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(cart);
                });
    }

    // Lấy giỏ hàng
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return cartMapper.toCartResponse(cart);
    }

    // Thêm sản phẩm vào giỏ
    @Transactional
    public CartResponse addToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        CartItem item = cartMapper.toCartItemRequest(request);
        item.setCart(cart);
        item.setVariant(variant);

        cart.getCartItems().add(item);

        cartRepository.save(cart); // Cascade ALL sẽ lưu cả CartItem
        return cartMapper.toCartResponse(cart);
    }

    // Xóa 1 sản phẩm khỏi giỏ
    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);

        // Tìm item trực tiếp từ DB
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found in DB"));

        // Kiểm tra xem item này có thuộc cart của user không
        if (!item.getCart().getCartId().equals(cart.getCartId())) {
            throw new RuntimeException("Item does not belong to this cart");
        }

        cart.getCartItems().remove(item);   // orphanRemoval = true
        return cartMapper.toCartResponse(cart);
    }

    // Xóa toàn bộ giỏ hàng của user sau khi đặt hàng
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        // Xóa từng CartItem
        cart.getCartItems().clear();
        cartRepository.save(cart); // Cập nhật cart rỗng
    }


}
