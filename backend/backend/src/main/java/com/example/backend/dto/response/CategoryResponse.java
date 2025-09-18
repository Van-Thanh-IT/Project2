package com.example.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Long categoryId;
    String categoryName;
    String slug;
    Long parentId;
    Integer sortOrder;
    Boolean isActive;
    String imageUrl;
    LocalDateTime createdAt;

    private List<CategoryResponse> children;
}
