package com.example.backend.mapper;


import com.example.backend.dto.response.InventoryResponse;
import com.example.backend.entity.Inventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

//    // Entity -> Response
    @Mapping(source = "variant.variantId", target = "variantId")
    InventoryResponse toResponse(Inventory inventory);
}
