package com.example.backend.mapper;


import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.requset.PaymentRequest;
import com.example.backend.dto.requset.ShipmentRequest;
import com.example.backend.dto.response.OrderItemResponse;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.dto.response.PaymentResponse;
import com.example.backend.dto.response.ShipmentResponse;
import com.example.backend.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    // Request → Entity
    @Mapping(target = "user.userId", source = "userId")
    @Mapping(target = "location.locationId", source = "locationId")
    Order toOrder(OrderRequest request);
    @Mapping(target = "variant.variantId", source = "variantId")
    OrderItem toOrderItem(OrderRequest.OrderItemRequest request);

    Shipment toShipment(ShipmentRequest request);

    Payment toPayment(PaymentRequest request);
    @Mapping(target = "productId", source = "variant.product.productId")
    @Mapping(target = "productName", source = "variant.product.productName")
    @Mapping(target = "variantColor", source = "variant.color")
    @Mapping(target = "variantSize", source = "variant.size")
    OrderItemResponse toOrderItemResponse(OrderItem item);
    // Map từ Entity → Response DTO
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "shipments", source = "shipments")
    @Mapping(target = "payments", source = "payments")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "location", source = "location")
    OrderResponse toOrderResponse(Order order);

    ShipmentResponse toShipmentResponse(Shipment shipment);
    PaymentResponse toPaymentResponse(Payment payment);
    OrderResponse.LocationResponse toLocationResponse(Location location);




}