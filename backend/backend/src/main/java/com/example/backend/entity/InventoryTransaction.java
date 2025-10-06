package com.example.backend.entity;
import com.example.backend.enums.TransactionSource;
import com.example.backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long transactionId;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    ProductVariant variant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TransactionType transactionType;

    @Column(nullable = false)
    Integer quantity;

    BigDecimal unitCost;

    @Enumerated(EnumType.STRING)
    TransactionSource transactionSource;

    Long referenceId;

    @Column(name = "created_by")
    Long createdBy;

    @Column(name = "transaction_date",
            insertable = false,
            updatable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    LocalDateTime transactionDate;

    String note;
}