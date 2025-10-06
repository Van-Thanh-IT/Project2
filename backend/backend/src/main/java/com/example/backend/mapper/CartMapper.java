package com.example.backend.mapper;

import com.example.backend.dto.requset.CartItemRequest;
import com.example.backend.dto.response.CartItemResponse;
import com.example.backend.dto.response.CartResponse;
import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartItem toCartItemRequest(CartItemRequest cartItemRequest);


    @Mapping(source = "variant.variantId", target = "variantId")
    @Mapping(source = "variant.product.productName", target = "productName")
    @Mapping(source = "variant.color", target = "color")
    @Mapping(source = "variant.size", target = "size")
    CartItemResponse toCartItemResponse(CartItem item);


    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "cartItems", target = "items")
    CartResponse toCartResponse(Cart cart);


}
