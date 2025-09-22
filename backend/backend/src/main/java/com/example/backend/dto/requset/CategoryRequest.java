package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    String categoryName;
    String slug;
    Long parentId;
    Integer sortOrder;
    Boolean isActive = true;
    MultipartFile image;
}
