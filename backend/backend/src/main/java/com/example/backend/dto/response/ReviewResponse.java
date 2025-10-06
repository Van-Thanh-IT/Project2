package com.example.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    Long reviewId;
    Float rating;
    String comment;
    String status;
    LocalDateTime createdAt;
    ProductResponse products;
    UserResponse users;
}
