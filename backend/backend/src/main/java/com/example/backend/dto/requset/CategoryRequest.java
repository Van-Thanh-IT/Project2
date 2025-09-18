package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    String categoryName;
    String slug;
    Long parentId;
    Integer sortOrder;
    Boolean isActive;
    String imageUrl;
}
