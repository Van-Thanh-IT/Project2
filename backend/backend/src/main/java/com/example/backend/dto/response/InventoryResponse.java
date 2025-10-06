package com.example.backend.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryResponse {
    Long inventoryId;
    Long variantId;
    Integer quantity;
    Integer safetyStock;
    Integer updatedBy;
    LocalDateTime updatedAt;
}