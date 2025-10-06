package com.example.backend.dto.requset;

import com.example.backend.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {
    Integer orderId;
    String method;
    Double amount;
    String status;
    LocalDateTime paidAt;
}
