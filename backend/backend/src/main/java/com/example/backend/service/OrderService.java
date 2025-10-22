package com.example.backend.service;
import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.entity.*;
import com.example.backend.enums.OrderStatus;
import com.example.backend.enums.ShipmentStatus;
import com.example.backend.enums.TransactionSource;
import com.example.backend.enums.TransactionType;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ShipmentRepository shipmentRepository;
    private final CartService cartService;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Map request -> entity
        Order order = orderMapper.toOrder(request);
        order.setPlacedAt(LocalDateTime.now());

        // Map items và xử lý tồn kho
        List<OrderItem> items = request.getItems().stream()
                .map(orderMapper::toOrderItem)
                .peek(item -> {
                    item.setOrder(order);

                    // Tìm tồn kho theo variant
                    Inventory inventory = inventoryRepository
                            .findByVariant_VariantId(item.getVariant().getVariantId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy kho cho variant: " + item.getVariant().getVariantId()));

                    // Kiểm tra tồn kho
                    if (inventory.getQuantity() < item.getQuantity()) {
                        throw new RuntimeException("Số lượng trong kho không đủ cho variant: " + item.getVariant().getVariantId());
                    }

                    // Giảm tồn kho
                    inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
                    inventory.setUpdatedAt(LocalDateTime.now());
                    inventory.setUpdatedBy(request.getUserId());
                    inventoryRepository.save(inventory);

                    // Ghi lịch sử giao dịch kho
                    InventoryTransaction transaction = new InventoryTransaction();
                    transaction.setVariant(item.getVariant());
                    transaction.setTransactionType(TransactionType.EXPORT);
                    transaction.setQuantity(item.getQuantity());
                    transaction.setTransactionSource(TransactionSource.SALE);
                    transaction.setUnitCost(item.getPrice()); // dùng giá sản phẩm chứ không phải tổng đơn
                    transaction.setReferenceId(request.getOrderId());
                    transaction.setCreatedBy(request.getUserId());
                    transaction.setTransactionDate(LocalDateTime.now());
                    inventoryTransactionRepository.save(transaction);

                }).collect(Collectors.toList());

        // Gắn lại vào order
        order.setOrderItems(items);

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

        // Lưu order
        Order savedOrder = orderRepository.save(order);
        log.info("Tạo đơn thành công: {}", savedOrder.getCode());

        // Xoá giỏ hàng của user sau khi đặt hàng
        Long userId = request.getUserId();
        List<Long> variantIds = request.getItems().stream()
                .map(item -> item.getVariantId().longValue())
                .toList();
        cartService.removeItemByVariant(userId, variantIds);

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
        shipment.setDeliveredAt(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }


}
