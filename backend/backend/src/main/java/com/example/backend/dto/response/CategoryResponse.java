package com.example.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    List<CategoryResponse> children;
}
