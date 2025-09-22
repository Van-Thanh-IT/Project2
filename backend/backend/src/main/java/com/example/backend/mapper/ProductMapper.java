package com.example.backend.mapper;

import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.response.ImageResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.entity.Product;
import com.example.backend.entity.Product_Images;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toProduct(ProductRequest request);
    ProductResponse toProductResponse(Product product);
}
