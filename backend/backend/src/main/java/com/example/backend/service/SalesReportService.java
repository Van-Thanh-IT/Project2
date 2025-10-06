package com.example.backend.service;

import com.example.backend.dto.Inter.*;
import com.example.backend.entity.OrderItem;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesReportService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;


    // Tổng số người dùng
    public long getTotalUsers() {
        return userRepository.count();
    }


    // Tổng số sản phẩm
    public long getTotalProducts() {
        return productRepository.count();
    }


    // Tổng doanh thu
    public double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }


    // Tổng số đơn hàng
    public long getTotalOrders() {
        return orderRepository.getTotalOrders();
    }

    // Thống kê đơn hàng theo trạng thái
    public List<OrderStatusStats> getOrdersByStatus() {
        // Lấy số lượng đơn hàng group theo trạng thái (PENDING, DELIVERED, CANCELLED...)
        return orderRepository.countOrdersByStatus();
    }

    // Doanh thu theo khoảng thời gian (có thể group theo ngày/tháng/năm)
    public List<RevenueStats> getRevenueGroupedBy(String groupBy, LocalDateTime start, LocalDateTime end) {
        // groupBy có thể là "day", "month", "year"
        switch (groupBy.toLowerCase()) {
            case "month":
                return orderRepository.findRevenueGroupedByMonth(start, end);
            case "year":
                return orderRepository.findRevenueGroupedByYear(start, end);
            default:
                return orderRepository.findRevenueGroupedByDay(start, end);
        }
    }

    // Doanh thu theo sản phẩm
    public List<ProductRevenue> getProductRevenue() {
        // Trả về danh sách doanh thu, số lượng bán được theo từng sản phẩm
        return orderRepository.findRevenueByProduct();
    }


    // Tồn kho hiện tại
    public List<InventoryStatus> getAllInventoryStatus() {
        // Lấy tất cả sản phẩm với số lượng tồn kho hiện tại
        return inventoryRepository.findAllInventoryStatus();
    }

    // Tồn kho dưới mức cảnh báo
    public List<InventoryStatus> getLowStockInventory() {
        // Lấy danh sách sản phẩm có tồn kho thấp hơn mức an toàn (safety stock)
        return inventoryRepository.findLowStockInventory();
    }

    // Lịch sử nhập / xuất kho
    public List<InventoryTransactionReport> getInventoryTransactions() {
        // Trả về lịch sử nhập/xuất kho theo sản phẩm, ngày, số lượng, loại giao dịch, nguồn
        return inventoryTransactionRepository.getInventoryTransactionReport();
    }

    // Top sản phẩm được đánh giá cao
    public List<ProductRatingStats> getTopRatedProducts() {
        // Lấy danh sách sản phẩm có điểm đánh giá trung bình cao nhất
        return reviewRepository.findTopRatedProducts();
    }

    // Top sản phẩm được đánh giá thấp
    public List<ProductRatingStats> getLowestRatedProducts() {
        // Lấy danh sách sản phẩm có điểm đánh giá trung bình thấp nhất
        return reviewRepository.findLowestRatedProducts();
    }

}
