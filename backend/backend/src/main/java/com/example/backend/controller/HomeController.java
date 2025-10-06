package com.example.backend.controller;

import com.example.backend.dto.Inter.HomeProductProjection;
import com.example.backend.dto.Inter.ProductReviewSummary;
import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.response.*;
import com.example.backend.service.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/home")
public class HomeController {
    ProductService productService;
    UserService userService;
    LocationService locationService;
    OrderService orderService;

    CategoryService categoryService;

    //lấy tất cả danh mục
    @GetMapping("/category/read")
    public APIResponse<List<CategoryResponse>> getAllCategorys() {
        return APIResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getAllCategories())
                .build();
    }

    // tìm kiếm sp theo danh mục
    @GetMapping("products/category/{slug}")
    public List<HomeProductProjection> getProductsByCategory(@PathVariable String slug) {
        return productService.getProductsByCategorySlug(slug);
    }

    // Tạo đơn hàng mới
    @PostMapping("/orders/create")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(response);
    }




    @GetMapping("/locations/read")
    public List<LocationResponse> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/review/product-reviews")
    public ResponseEntity<List<ProductReviewSummary>> getProductReviews() {
        return ResponseEntity.ok(productService.getProductReviewSummary());
    }
    @GetMapping("/products/read")
    public APIResponse<List<HomeProductProjection>> getAllProductTrue(){
       List<HomeProductProjection> responses = productService.getHomeAllProducts();
       return APIResponse.success(responses);
    }

    //tìm kiếm
    @GetMapping("/products/search")
    public List<HomeProductProjection> searchProducts(@RequestParam String q) {
        return productService.searchProducts(q);
    }

    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo(){
        return APIResponse.success(userService.getInfo());
    }

    // Lấy chi tiết sản phẩm theo slug
    @GetMapping("/products/{slug}")
    public APIResponse<ProductResponse> getProductDetail(@PathVariable String slug) {
        return APIResponse.<ProductResponse>builder()
                .data(productService.getProductDetailBySlug(slug))
                .build();
    }
}
