package com.example.backend.service;

import com.example.backend.dto.requset.InventoryRequest;
import com.example.backend.dto.requset.InventoryTransactionRequest;
import com.example.backend.dto.response.InventoryResponse;
import com.example.backend.dto.response.InventoryTransactionResponse;
import com.example.backend.entity.Inventory;
import com.example.backend.entity.InventoryTransaction;
import com.example.backend.entity.ProductVariant;
import com.example.backend.entity.User;
import com.example.backend.enums.TransactionType;
import com.example.backend.mapper.InventoryMapper;
import com.example.backend.mapper.InventoryTransactionMapper;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.InventoryTransactionRepository;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryService {

    InventoryRepository inventoryRepository;
    InventoryTransactionRepository transactionRepository;
    UserRepository userRepository;

    InventoryMapper inventoryMapper;
    InventoryTransactionMapper transactionMapper;


     //Lấy toàn bộ danh sách tồn kho
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll()
                .stream()
                .map(inventoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    //Cập nhật tồn kho (ví dụ chỉnh mức safety stock)
    public InventoryResponse updateInventory(Long inventoryId, InventoryRequest request) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho ID: " + inventoryId));

        inventory.setSafetyStock(request.getSafetyStock());
        inventory.setQuantity(request.getQuantity());
        inventory.setUpdatedBy(request.getUpdatedBy());

        Inventory saved = inventoryRepository.save(inventory);
        return inventoryMapper.toResponse(saved);
    }


  // Tạo giao dịch nhập / xuất kho
    @Transactional
    public InventoryTransactionResponse createTransaction(InventoryTransactionRequest request) {

        // Lấy user admin
        User admin = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy admin ID: " + request.getCreatedBy()));

        // Map từ request sang entity
        InventoryTransaction transaction = transactionMapper.toEntity(request, admin);
        // Lưu giao dịch
        InventoryTransaction savedTransaction = transactionRepository.save(transaction);

        // Cập nhật số lượng tồn kho
        Inventory inventory = inventoryRepository.findByVariant_VariantId(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho variant ID: " + request.getVariantId()));


        if (request.getTransactionType() == TransactionType.IMPORT) {
            inventory.setQuantity(inventory.getQuantity() + request.getQuantity());
        } else if (request.getTransactionType() == TransactionType.EXPORT) {
            if (inventory.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Tồn kho không đủ để xuất");
            }
            inventory.setQuantity(inventory.getQuantity() - request.getQuantity());
        }
        inventory.setUpdatedBy(request.getCreatedBy());
        inventoryRepository.save(inventory);

        return transactionMapper.toResponse(savedTransaction);
    }
     //Lấy toàn bộ lịch sử giao dịch kho
    public List<InventoryTransactionResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(transactionMapper::toResponse)
                .collect(Collectors.toList());
    }
}
