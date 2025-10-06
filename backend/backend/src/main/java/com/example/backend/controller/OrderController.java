package com.example.backend.controller;

import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Lấy danh sách đơn hàng của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Integer userId) {
        List<OrderResponse> responses = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/read")
    public APIResponse<List<OrderResponse>> getAllOrders(){
       List< OrderResponse> response = orderService.getAllOrders();
       return APIResponse.success(response);
    }
//
//    // Lấy chi tiết đơn hàng
//    @GetMapping("/{orderId}")
//    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId) {
//        OrderResponse response = orderService.getOrderById(orderId);
//        return ResponseEntity.ok(response);
//    }
//
    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public APIResponse<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
         orderService.updateOrderStatus(orderId, status);
        return APIResponse.<Void>builder()
                .code(201)
                .messages("Cập nhật trang thái đơn hàng thành công")
                .build();
    }

    //cập nhật hủy đơn
    @PutMapping("/{orderId}/cancel")
    public APIResponse<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return APIResponse.<Void>builder()
                .code(201)
                .messages("Đơn hàng đã được hủy thành công")
                .build();
    }

    // cập nhập trạng thái vận chuyển
    @PutMapping("/shipments/{shipmentId}")
    public APIResponse<Void> updateShipment(
            @PathVariable Long shipmentId,
            @RequestBody Map<String, String> payload) {

        orderService.updateShipment(shipmentId, payload);

        return APIResponse.<Void>builder()
                .code(201)
                .messages("Cập nhật vận chuyển thành công")
                .build();
    }


}
