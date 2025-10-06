package com.example.backend.repository;

import com.example.backend.dto.Inter.InventoryStatus;
import com.example.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByVariant_VariantId(Long variantId);

    // 1. Tồn kho hiện tại theo biến thể sản phẩm
    @Query(
            value = """
            SELECT 
                i.variant_id AS variantId,
                p.product_name AS productName,
                v.color,
                v.size,
                i.quantity,
                i.safety_stock AS safetyStock
            FROM inventory i
            JOIN product_variants v ON i.variant_id = v.variant_id
            JOIN products p ON v.product_id = p.product_id
            """,
            nativeQuery = true
    )
    List<InventoryStatus> findAllInventoryStatus();

    // 2. Tồn kho dưới mức cảnh báo
    @Query(
            value = """
            SELECT 
                i.variant_id AS variantId,
                p.product_name AS productName,
                v.color,
                v.size,
                i.quantity,
                i.safety_stock AS safetyStock
            FROM inventory i
            JOIN product_variants v ON i.variant_id = v.variant_id
            JOIN products p ON v.product_id = p.product_id
            WHERE i.quantity < i.safety_stock
            """,
            nativeQuery = true
    )
    List<InventoryStatus> findLowStockInventory();


}
