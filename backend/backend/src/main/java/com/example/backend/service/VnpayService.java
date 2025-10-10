package com.example.backend.service;

import com.example.backend.dto.response.PaymentTDO;
import com.example.backend.entity.*;
import com.example.backend.enums.PaymentStatus;
import com.example.backend.enums.TransactionSource;
import com.example.backend.enums.TransactionType;
import com.example.backend.repository.InventoryRepository;
import com.example.backend.repository.InventoryTransactionRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.util.VnpayProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VnpayService {

    VnpayProperties vnpayProperties;
    OrderRepository orderRepository;
    PaymentRepository paymentRepository;
    InventoryRepository inventoryRepository;
    InventoryTransactionRepository inventoryTransactionRepository;
    CartService cartService;


    public ResponseEntity createPayment(Long amount, String orderInfo, HttpServletRequest req){
        String vnp_TxnRef = getRandomNumber(8);
        String vnp_IpAddr = getIpAddress(req);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnpayProperties.getVersion());
        vnp_Params.put("vnp_Command", vnpayProperties.getCommand());
        vnp_Params.put("vnp_TmnCode", vnpayProperties.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", vnpayProperties.getCurrCode());
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
//        vnp_Params.put("vnp_OrderInfo", orderInfo + vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_ReturnUrl", vnpayProperties.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext();) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                hashData.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String vnp_SecureHash = hmacSHA512(vnpayProperties.getHashSecret(), hashData.toString());
        System.out.println("HashData: " + hashData.toString());
        System.out.println("SecureHash: " + vnp_SecureHash);
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        String paymentUrl = vnpayProperties.getUrl() + "?" + query;
        System.out.println("PaymentUrl: " + paymentUrl); // Debug

        PaymentTDO paymentTDO = new PaymentTDO();
        paymentTDO.setStatus("ok");
        paymentTDO.setMessages("success");
        paymentTDO.setURL(paymentUrl);

        return ResponseEntity.status(HttpStatus.OK).body(paymentTDO);
    }



    public String hmacSHA512(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

    public String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    public String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }



    @Transactional
    public void handleVnpayReturn(Map<String, String> params) {
        String code = params.get("vnp_ResponseCode");
        String orderInfo = params.get("vnp_OrderInfo");
        String amount = params.get("vnp_Amount");
        String payDate = params.get("vnp_PayDate");

        Order order = orderRepository.findByCode(orderInfo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã đơn: " + orderInfo));

        if ("00".equals(code)) {
            savePayment(order, Double.parseDouble(amount) / 100.0, payDate);
            reduceInventory(order);
            clearCart(order);
            orderRepository.save(order);
        } else {
            Payment payment = new Payment();
            payment.setStatus(PaymentStatus.FAILED);
            payment.setOrder(order);
            paymentRepository.save(payment);
        }
    }

    private void savePayment(Order order, Double amount, String payDate) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("VNPAY");
        payment.setStatus(PaymentStatus.PAID);
        payment.setAmount(amount);
        payment.setPaidAt(LocalDateTime.parse(payDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        paymentRepository.save(payment);
    }

    private void reduceInventory(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            Inventory inv = inventoryRepository.findByVariant_VariantId(item.getVariant().getVariantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy kho"));
            if (inv.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Kho không đủ cho sản phẩm " + item.getVariant().getVariantId());
            }
            inv.setQuantity(inv.getQuantity() - item.getQuantity());
            inventoryRepository.save(inv);

            InventoryTransaction tran = new InventoryTransaction();
            tran.setVariant(item.getVariant());
            tran.setTransactionType(TransactionType.EXPORT);
            tran.setQuantity(item.getQuantity());
            tran.setCreatedBy(order.getUser().getUserId());
            tran.setTransactionSource(TransactionSource.SALE);
            tran.setReferenceId(order.getOrderId());
            inventoryTransactionRepository.save(tran);
        }
    }

    private void clearCart(Order order) {
        cartService.removeItemByVariant(
                order.getUser().getUserId(),
                order.getOrderItems()
                        .stream()
                        .map(oi -> oi.getVariant().getVariantId())
                        .toList()
        );
    }


}
