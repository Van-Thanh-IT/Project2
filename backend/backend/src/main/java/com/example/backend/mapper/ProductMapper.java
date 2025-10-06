package com.example.backend.mapper;

import com.example.backend.dto.requset.ProductImageRequest;
import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.requset.ProductVariantRequest;
import com.example.backend.dto.response.ProductImageResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);

    @Mapping(target = "imageUrl", ignore = true) // bỏ qua MultipartFile
    ProductImage toProductImage(ProductImageRequest request);
    ProductVariant toProductVariant(ProductVariantRequest request);
    @Mapping(source = "category.categoryId", target = "categoryId")
    @Mapping(source = "images", target = "images")
    ProductResponse toProductResponse(Product product);

    ProductImageResponse toProductImageResponse(ProductImage productImage);

    ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);

}
