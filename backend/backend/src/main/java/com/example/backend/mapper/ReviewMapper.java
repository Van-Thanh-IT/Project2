package com.example.backend.mapper;

import com.example.backend.dto.requset.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface ReviewMapper {
    // Convert DTO -> Entity
    @Mapping(target = "user", ignore = true)      // set sau
    @Mapping(target = "product", ignore = true)   // set sau
    Review toEntity(ReviewRequest request);

    // Convert Entity -> DTO
    @Mapping(source = "user", target = "users")
    @Mapping(source = "product", target = "products")
    ReviewResponse toReviewResponse(Review review);
}