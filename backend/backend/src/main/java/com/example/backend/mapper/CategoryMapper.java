package com.example.backend.mapper;

import com.example.backend.dto.requset.CategoryRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);
    @Mapping(target = "parentId", expression = "java(category.getParent() != null ? category.getParent().getCategoryId() : null)")
    default CategoryResponse toCategoryResponseWithChildren(Category category) {
        if (category == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(category.getCategoryId());
        response.setCategoryName(category.getCategoryName());
        response.setSlug(category.getSlug());
        response.setParentId(category.getParent() != null ? category.getParent().getCategoryId() : null);
        response.setSortOrder(category.getSortOrder());
        response.setIsActive(category.getIsActive());
        response.setImageUrl(category.getImageUrl());
        response.setCreatedAt(category.getCreatedAt());

        // set children ngay tại đây
        response.setChildren(
                category.getChildren() == null ? List.of() :
                        category.getChildren().stream()
                                .map(this::toCategoryResponseWithChildren)
                                .toList()
        );

        return response;
    }
}
