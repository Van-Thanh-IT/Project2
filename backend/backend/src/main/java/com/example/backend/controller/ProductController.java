package com.example.backend.controller;

import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/admin/products")
public class ProductController {
    ProductService productService;

    // xử lý lấy dl
    @GetMapping("/read")
    public APIResponse<List<ProductResponse>> getAllProducts(){
        List<ProductResponse> products = productService.getAllProducts();
        return APIResponse.success(products);
    }

    @PostMapping("/create")
    public APIResponse<Void> createProduct(@RequestBody ProductRequest request){
        System.out.println("dl nhận đc: "+ request);
        productService.createProduct(request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Tạo sản phẩm thành công!")
                .build();
    }

    @PutMapping("/update/{productId}")
    public APIResponse<Void> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest request){
        System.out.println("Id:" + productId);
        productService.updateProduct(productId, request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Cập nhập sản phẩm thành công")
                .build();
    }

    @PutMapping("/deletesoft/{productId}")
    public APIResponse<Void> deleteProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest request ){
        productService.deleteProduct(productId,request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Sản phẩm đã được xóa!")
                .build();
    }






}
