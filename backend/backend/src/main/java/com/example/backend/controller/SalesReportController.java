package com.example.backend.controller;

import com.example.backend.dto.Inter.*;
import com.example.backend.service.SalesReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class SalesReportController {
    private final SalesReportService reportService;

    // Tổng sản phẩm
    @GetMapping("/product/total")
    public ResponseEntity<Long> getTotalProducts() {
        long total = reportService.getTotalProducts();
        return ResponseEntity.ok(total);
    }

    // Tổng người dùng
    @GetMapping("/user/total")
    public ResponseEntity<Long> getTotalUsers() {
        long total = reportService.getTotalUsers();
        return ResponseEntity.ok(total);
    }

    // Tổng doanh thu
    @GetMapping("/order/total_revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        double totalRevenue = reportService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }

    // Tổng đơn hàng
    @GetMapping("/order/total")
    public ResponseEntity<Long> getTotalOrders() {
        long totalOrders = reportService.getTotalOrders();
        return ResponseEntity.ok(totalOrders);
    }

    // Đơn hàng theo trạng thái
    @GetMapping("/order/status")
    public ResponseEntity<List<OrderStatusStats>> getOrdersByStatus() {
        return ResponseEntity.ok(reportService.getOrdersByStatus());
    }

    // Doanh thu theo ngày/tháng/năm
    @GetMapping("/order/revenue")
    public ResponseEntity<List<RevenueStats>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "day") String groupBy
    ) {
        List<RevenueStats> data = reportService.getRevenueGroupedBy(groupBy, start, end);
        return ResponseEntity.ok(data);
    }

    // Doanh thu theo sản phẩm
    @GetMapping("/order/product")
    public ResponseEntity<List<ProductRevenue>> getProductRevenue() {
        List<ProductRevenue> data = reportService.getProductRevenue();
        return ResponseEntity.ok(data);
    }

    // Tồn kho hiện tại
    @GetMapping("/inventory/status")
    public ResponseEntity<List<InventoryStatus>> getInventoryStatus() {
        return ResponseEntity.ok(reportService.getAllInventoryStatus());
    }

    // Tồn kho dưới mức cảnh báo
    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<InventoryStatus>> getLowStockInventory() {
        return ResponseEntity.ok(reportService.getLowStockInventory());
    }

    // Lịch sử nhập/xuất kho
    @GetMapping("/inventory/transactions")
    public ResponseEntity<List<InventoryTransactionReport>> getInventoryTransactions() {
        return ResponseEntity.ok(reportService.getInventoryTransactions());
    }

    // Top sản phẩm được đánh giá cao
    @GetMapping("/review/products/top-rated")
    public ResponseEntity<List<ProductRatingStats>> getTopRatedProducts() {
        return ResponseEntity.ok(reportService.getTopRatedProducts());
    }

    // Top sản phẩm được đánh giá thấp
    @GetMapping("/review/products/lowest-rated")
    public ResponseEntity<List<ProductRatingStats>> getLowestRatedProducts() {
        return ResponseEntity.ok(reportService.getLowestRatedProducts());
    }
}
