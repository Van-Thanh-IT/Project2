package com.example.backend.service;
import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderItem;
import com.example.backend.entity.Payment;
import com.example.backend.entity.Shipment;
import com.example.backend.enums.OrderStatus;
import com.example.backend.enums.ShipmentStatus;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ShipmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // tự tạo constructor cho final fields
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ShipmentRepository shipmentRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Map request -> entity
        Order order = orderMapper.toOrder(request);
        order.setPlacedAt(LocalDateTime.now());

        // map items
        if (request.getItems() != null) {
            order.setOrderItems(
                    request.getItems().stream()
                            .map(orderMapper::toOrderItem)
                            .peek(item -> item.setOrder(order)) // gắn order cha
                            .collect(Collectors.toList())
            );
        }

        // map shipments
        if (request.getShipments() != null) {
            order.setShipments(
                    request.getShipments().stream()
                            .map(orderMapper::toShipment)
                            .peek(shipment -> shipment.setOrder(order))
                            .collect(Collectors.toList())
            );
        }

        // map payments
        if (request.getPayments() != null) {
            order.setPayments(
                    request.getPayments().stream()
                            .map(orderMapper::toPayment)
                            .peek(payment -> payment.setOrder(order))
                            .collect(Collectors.toList())
            );
        }

        Order savedOrder = orderRepository.save(order);

        log.info("✅ Tạo đơn thành công: {}", savedOrder.getCode());
        return orderMapper.toOrderResponse(savedOrder);
    }

    // lấy danh sách oder theo user
    public List<OrderResponse> getOrdersByUser(Integer userId) {
        List<Order> orders = orderRepository.findByUser_UserId(userId);
        return orders.stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }
    // lấy tất cả order
    public List<OrderResponse> getAllOrders(){
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(orderMapper::toOrderResponse).toList();
    }

    //cập nhật trạng thái oder
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        // Tìm đơn hàng theo orderId
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        try {
            // Chuyển String thành enum
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(orderStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ: " + status);
        }

        return orderRepository.save(order);
    }

    // hủy đơn
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Chỉ hủy nếu chưa giao
        if(order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Không thể hủy đơn đã giao");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Transactional
    public Shipment updateShipment(Long shipmentId, Map<String, String> payload) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vận chuyển với ID: " + shipmentId));

        // Cập nhật trạng thái nếu có
        if(payload.containsKey("status")) {
            try {
                ShipmentStatus status = ShipmentStatus.valueOf(payload.get("status").toUpperCase());
                shipment.setStatus(status);
            } catch(IllegalArgumentException e) {
                throw new RuntimeException("Trạng thái vận chuyển không hợp lệ: " + payload.get("status"));
            }
        }

        // Cập nhật tracking number nếu có
        if(payload.containsKey("trackingNumber")) {
            shipment.setTrackingNumber(payload.get("trackingNumber"));
        }

        return shipmentRepository.save(shipment);
    }





}
