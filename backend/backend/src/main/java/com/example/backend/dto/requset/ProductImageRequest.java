package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductImageRequest {
    MultipartFile image;
    Boolean isPrimary;
    Long ProductId;
}
