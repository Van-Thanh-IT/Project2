package com.example.backend.mapper;

import com.example.backend.dto.requset.InventoryTransactionRequest;
import com.example.backend.dto.response.InventoryTransactionResponse;
import com.example.backend.entity.InventoryTransaction;

import com.example.backend.entity.ProductVariant;
import com.example.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryTransactionMapper {
    default Long map(User user) {
        return user != null ? user.getUserId() : null;
    }
    @Mapping(source = "createdBy", target = "createdBy")
    @Mapping(source = "request.variantId", target = "variant")
    InventoryTransaction toEntity(InventoryTransactionRequest request, User createdBy);
    @Mapping(source = "createdBy", target = "createdBy")
    @Mapping(source = "variant.variantId", target = "variantId")
    InventoryTransactionResponse toResponse(InventoryTransaction transaction);

    // Method chuyển Long -> ProductVariant
    default ProductVariant map(Long variantId) {
        if (variantId == null) return null;
        ProductVariant variant = new ProductVariant();
        variant.setVariantId(variantId);
        return variant;
    }
}
