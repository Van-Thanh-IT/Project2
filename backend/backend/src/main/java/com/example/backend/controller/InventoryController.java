package com.example.backend.controller;

import com.example.backend.dto.requset.InventoryRequest;
import com.example.backend.dto.requset.InventoryTransactionRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.InventoryResponse;
import com.example.backend.dto.response.InventoryTransactionResponse;
import com.example.backend.service.InventoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryController {

    InventoryService inventoryService;

    //Lấy toàn bộ danh sách tồn kho
    @GetMapping("/read")
    public APIResponse<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> inventoryList = inventoryService.getAllInventory();
        return APIResponse.<List<InventoryResponse>>builder()
                .code(200)
                .data(inventoryList)
                .build();

    }

    //Cập nhật tồn kho (ví dụ chỉnh mức safety stock hoặc quantity)
    @PutMapping("/{inventoryId}/update")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long inventoryId,
            @RequestBody InventoryRequest request) {

        InventoryResponse response = inventoryService.updateInventory(inventoryId, request);
        return ResponseEntity.ok(response);
    }


    //Lấy toàn bộ lịch sử giao dịch kho
    @GetMapping("/transactions/read")
    public ResponseEntity<List<InventoryTransactionResponse>> getAllTransactions() {
        List<InventoryTransactionResponse> transactions = inventoryService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }


    //Tạo giao dịch nhập / xuất kho
    @PostMapping("/transactions/create")
    public ResponseEntity<InventoryTransactionResponse> createTransaction(
            @RequestBody InventoryTransactionRequest request) {

        InventoryTransactionResponse response = inventoryService.createTransaction(request);
        return ResponseEntity.ok(response);
    }
}
