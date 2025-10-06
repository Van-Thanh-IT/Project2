package com.example.backend.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryTransactionResponse {
    Long transactionId;
    Long variantId;
    String transactionType;
    Integer quantity;
    BigDecimal unitCost;
    String transactionSource;
    Long referenceId;
    Long createdBy;
    LocalDateTime transactionDate;
    String note;
}