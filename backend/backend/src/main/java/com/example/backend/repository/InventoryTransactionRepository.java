package com.example.backend.repository;

import com.example.backend.dto.Inter.InventoryTransactionReport;
import com.example.backend.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    Optional<InventoryTransaction> findByVariant_VariantId(Long variantId);

    List<InventoryTransaction> findByVariant_VariantIdAndReferenceIdIsNull(Long variantId);

    // 3. Lịch sử nhập/xuất kho
    @Query(
            value = """
            SELECT 
                t.transaction_id AS transactionId,
                p.product_name AS productName,
                v.color AS color,
                v.size AS size,
                t.transaction_type AS transactionType,
                t.quantity AS quantity,
                t.transaction_source AS transactionSource,
                t.note AS note,
                u.full_name AS createdBy,
                t.transaction_date AS transactionDate
            FROM inventory_transactions t
            JOIN product_variants v ON t.variant_id = v.variant_id
            JOIN products p ON v.product_id = p.product_id
            LEFT JOIN users u ON t.created_by = u.user_id
            ORDER BY t.transaction_date DESC
        """,
            nativeQuery = true
    )
    List<InventoryTransactionReport> getInventoryTransactionReport();

}