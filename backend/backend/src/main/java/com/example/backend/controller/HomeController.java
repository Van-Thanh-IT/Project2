package com.example.backend.controller;

import com.example.backend.dto.Inter.HomeProductProjection;
import com.example.backend.dto.requset.OrderRequest;
import com.example.backend.dto.response.*;
import com.example.backend.entity.*;

import com.example.backend.enums.PaymentStatus;

import com.example.backend.mapper.OrderMapper;
import com.example.backend.repository.*;
import com.example.backend.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/home")
public class HomeController {
    ProductService productService;
    UserService userService;
    LocationService locationService;
    OrderService orderService;
    CategoryService categoryService;

    VnpayService vnpayService;
    ReviewService reviewService;
   OrderRepository orderRepository;
    OrderMapper orderMapper;
    OrderItemRepository orderItemRepository;

    InventoryService inventoryService;
    
    @GetMapping("/product/status/{variantId}")
    public ResponseEntity<Map<String, Object>> getProductStatus(
            @PathVariable Long variantId,
            @RequestParam(defaultValue = "1") int requiredQuantity) {

        boolean inStock = inventoryService.isInStock(variantId, requiredQuantity);

        if (!inStock) {
            throw new RuntimeException("Sản phẩm " + variantId + " đã hết hàng!");
        }

        Map<String, Object> response = Map.of(
                "variantId", variantId,
                "requiredQuantity", requiredQuantity,
                "inStock", inStock
        );

        return ResponseEntity.ok(response);
    }


    // Tạo payment và lấy URL VNPAY
    @PostMapping("/payment/pay")
    public ResponseEntity<PaymentTDO> createPayment(@RequestBody OrderRequest req,HttpServletRequest request) {
        Order order = orderMapper.toOrder(req);
        orderRepository.save(order);

        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.PENDING);

        List<OrderItem> items = req.getItems().stream()
                .map(orderMapper::toOrderItem)
                .peek(item -> item.setOrder(order))
                .collect(Collectors.toList());
        orderItemRepository.saveAll(items);

        return vnpayService.createPayment(req.getTotal().longValue(),order.getCode(), request);
    }


    // trả về thông báo khi thanh toán
    @GetMapping("/payment/vnpay-return")
    public void vnpayReturn(@RequestParam Map<String, String> params,
                            HttpServletResponse response) throws IOException {

        vnpayService.handleVnpayReturn(params);

        String code = params.get("vnp_ResponseCode");
        String orderInfo = params.get("vnp_OrderInfo");
        String amount = params.get("vnp_Amount");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String payDate = params.get("vnp_PayDate");

        String redirectUrl = String.format(
                "http://localhost:3000/payment-result?code=%s&orderInfo=%s&amount=%s&txn=%s&bank=%s&date=%s",
                code,
                URLEncoder.encode(orderInfo, StandardCharsets.UTF_8),
                amount,
                transactionNo,
                bankCode,
                payDate
        );

        response.sendRedirect(redirectUrl);
    }



    //lấy tất cả danh mục
    @GetMapping("/category/read")
    public APIResponse<List<CategoryResponse>> getAllCategorys() {
        return APIResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getAllCategories())
                .build();
    }

    // tìm kiếm sp theo danh mục
    @GetMapping("products/category/{slug}")
    public List<HomeProductProjection> getProductsByCategory(@PathVariable String slug) {
        return productService.getProductsByCategorySlug(slug);
    }

    // Tạo đơn hàng mới
    @PostMapping("/orders/create")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/locations/read")
    public List<LocationResponse> getAllLocations() {
        return locationService.getAllLocations();
    }


    @GetMapping("/product/top-selling")
    public APIResponse<List<HomeProductProjection>> getTopSellingProducts() {
        List<HomeProductProjection> list = productService.getTopSellingProducts();
        return APIResponse.success(list);
    }

    @GetMapping("/products/read")
    public APIResponse<List<HomeProductProjection>> getAllProductTrue(){
       List<HomeProductProjection> responses = productService.getHomeAllProducts();
       return APIResponse.success(responses);
    }

    //tìm kiếm
    @GetMapping("/products/search")
    public List<HomeProductProjection> searchProducts(@RequestParam String q) {
        return productService.searchProducts(q);
    }

    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo(){
        return APIResponse.success(userService.getInfo());
    }

    // Lấy chi tiết sản phẩm theo slug
    @GetMapping("/products/{slug}")
    public APIResponse<ProductResponse> getProductDetail(@PathVariable String slug) {
        return APIResponse.<ProductResponse>builder()
                .data(productService.getProductDetailBySlug(slug))
                .build();
    }

    @GetMapping("/review/stats/{productId}")
    public ResponseEntity<?> getStats(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviewStats(productId));
    }
}
