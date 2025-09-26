package com.example.backend.controller;

import com.example.backend.dto.requset.ProductImageRequest;
import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.requset.ProductVariantRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.ProductImageResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
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
        System.out.println("dl nhận đc từ frontend" + productId + request);
        productService.deleteProduct(productId,request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Sản phẩm đã được xóa!")
                .build();
    }

    /////////////////productImage
    //create product images

    @GetMapping("/{productId}/images/read")
    public APIResponse<List<ProductImageResponse>> getImagesByProductId(
            @PathVariable Long productId) {
        List<ProductImageResponse> images = productService.getImagesByProductId(productId);
        return APIResponse.<List<ProductImageResponse>>builder()
                .code(200)
                .data(images)
                .build();
    }


    @PostMapping("/{productId}/images/create")
    public APIResponse<Void> createProductImage(
            @PathVariable Long productId,
            @ModelAttribute ProductImageRequest request){
        System.out.println("DL nhận đc từ frontend: " + productId + "req"+ request);
        productService.createProductImage(productId, request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Thêm ảnh thành công!")
                .build();
    }

    //update product images
    @PutMapping(value = "images/update/{imageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<Void> updateProductImage(
            @PathVariable Long imageId,
            @ModelAttribute ProductImageRequest request){

        productService.updateProductImage(imageId, request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("cập nhật ảnh thành công!")
                .build();

    }

    // delete product images
    @DeleteMapping("/images/delete/{imageId}")
    public APIResponse<Void> deleteProductImage(@PathVariable Long imageId){
        productService.deleteImage(imageId);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("xóa ảnh thành công!")
                .build();
    }

    ///////////// ProductVariant
    // get prodct variant by productId
    @GetMapping("/{productId}/variants/read")
    public APIResponse<List<ProductVariantResponse>> getProductVariantById(@PathVariable Long productId){
        List<ProductVariantResponse> variant = productService.getVariantByProductId(productId);
        return APIResponse.<List<ProductVariantResponse>>builder()
                .code(200)
                .data(variant)
                .build();
    }
    // create variant
    @PostMapping("/{productId}/variants/create")
    public APIResponse<Void> createProductVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariantRequest request){
        productService.createProductVariant(productId, request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Thêm biến thể sản phẩm thành công!")
                .build();
    }

    // update variant
    @PutMapping("/{variantId}/variants/update")
    public APIResponse<Void> updateProductVariant(
            @PathVariable Long variantId,
            @RequestBody ProductVariantRequest request){
        productService.updateProductVariant(variantId, request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Cập nhật biến thể sản phẩm thành công!")
                .build();
    }

    // delete variant
    @DeleteMapping("/variants/delete/{variantId}")
    public APIResponse<Void> deleteProductVariant(@PathVariable Long variantId){
        productService.deleteProductVariant(variantId);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Xóa biến thể sản phẩm thành công!")
                .build();
    }
}
