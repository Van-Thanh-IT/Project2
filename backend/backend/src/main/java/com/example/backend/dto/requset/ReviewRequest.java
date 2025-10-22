package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    Long userId;
    Long productId;
    Float rating;
    String comment;
    String status;
    LocalDateTime createdAt;

}
