package com.example.backend.dto.requset;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryRequest {
    Long variantId;
    Integer quantity;
    Integer safetyStock;
    Long updatedBy;
}
