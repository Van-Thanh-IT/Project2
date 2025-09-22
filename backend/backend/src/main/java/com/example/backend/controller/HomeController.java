package com.example.backend.controller;

import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/home/products")
public class HomeController {
    ProductService productService;
    UserService userService;
    @GetMapping("/read")
    public APIResponse<List<ProductResponse>> getAllProductTrue(){
       List<ProductResponse> responses = productService.getHomeAllProducts();
       return APIResponse.success(responses);
    }

    // API search sản phẩm theo tên danh mục
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchByCategory(@RequestParam String categoryName) {
        List<ProductResponse> products = productService.searchProductsByCategoryName(categoryName);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo(){
        return APIResponse.success(userService.getInfo());
    }

}
