package com.example.backend.repository;

import com.example.backend.dto.Inter.OrderStatusStats;
import com.example.backend.dto.Inter.ProductRevenue;
import com.example.backend.dto.Inter.RevenueStats;
import com.example.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Integer userId);

    // Tổng doanh thu
    @Query("SELECT COALESCE(SUM(o.total),0) FROM Order o")
    double getTotalRevenue();

    // Tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o")
    long getTotalOrders();

    // thống kê số lượng đơn hàng theo trang thái
    @Query(
            value = """
            SELECT 
                o.status AS status,
                COUNT(*) AS totalOrders
            FROM orders o
            GROUP BY o.status
            ORDER BY FIELD(o.status, 'PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED')
        """, nativeQuery = true
    )
    List<OrderStatusStats> countOrdersByStatus();

    // 2. Doanh thu theo sản phẩm
    @Query(
            value = """
            SELECT 
                p.product_name AS productName,
                SUM(oi.quantity) AS totalQuantity,
                SUM(oi.quantity * oi.price) AS totalRevenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN product_variants v ON oi.variant_id = v.variant_id
            JOIN products p ON v.product_id = p.product_id
            WHERE o.status = 'DELIVERED'
            GROUP BY p.product_id, p.product_name
            ORDER BY totalRevenue DESC
        """,
            nativeQuery = true
    )
    List<ProductRevenue> findRevenueByProduct();


    @Query(
            value = """
        SELECT 
            DATE(o.placed_at) AS placedAt,
            SUM(o.total) AS totalRevenue,
            COUNT(*) AS totalOrders
        FROM orders o
        WHERE o.placed_at BETWEEN :start AND :end
        GROUP BY DATE(o.placed_at)
        ORDER BY DATE(o.placed_at) ASC
    """,
            nativeQuery = true
    )
    List<RevenueStats> findRevenueGroupedByDay(LocalDateTime start, LocalDateTime end);

    @Query(
            value = """
        SELECT 
            DATE_FORMAT(o.placed_at, '%Y-%m') AS placedAt,
            SUM(o.total) AS totalRevenue,
            COUNT(*) AS totalOrders
        FROM orders o
        WHERE o.placed_at BETWEEN :start AND :end
        GROUP BY DATE_FORMAT(o.placed_at, '%Y-%m')
        ORDER BY DATE_FORMAT(o.placed_at, '%Y-%m') ASC
    """,
            nativeQuery = true
    )
    List<RevenueStats> findRevenueGroupedByMonth(LocalDateTime start, LocalDateTime end);

    @Query(
            value = """
        SELECT 
            YEAR(o.placed_at) AS placedAt,
            SUM(o.total) AS totalRevenue,
            COUNT(*) AS totalOrders
        FROM orders o
        WHERE o.placed_at BETWEEN :start AND :end
        GROUP BY YEAR(o.placed_at)
        ORDER BY YEAR(o.placed_at) ASC
    """,
            nativeQuery = true
    )
    List<RevenueStats> findRevenueGroupedByYear(LocalDateTime start, LocalDateTime end);



}
