package com.example.backend.dto.requset;

import com.example.backend.enums.TransactionSource;
import com.example.backend.enums.TransactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryTransactionRequest {
    Long variantId;
    TransactionType transactionType;
    Integer quantity;
    BigDecimal unitCost;
    TransactionSource transactionSource;
    Long referenceId;
    Long createdBy;
    String note;
}