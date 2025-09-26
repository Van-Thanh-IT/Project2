package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    Integer id;
    String method;
    String status;
    Double amount;
    LocalDateTime paidAt;
}
