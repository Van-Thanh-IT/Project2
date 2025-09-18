package com.example.backend.exception;

import org.springframework.http.HttpStatus;
public enum ErrorCode {
    // --------- User (1xxx) ---------
    USER_EXISTED(1001, "Tên người dùng đã tồn tại", HttpStatus.CONFLICT),
    USER_NOT_FOUND(1002, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_INVALID_INPUT(1003, "Dữ liệu người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_DISABLED(1004, "Tài khoản bị khoá", HttpStatus.FORBIDDEN),
    USER_EMAIL_NOT_VERIFIED(1005, "Email chưa được xác thực", HttpStatus.FORBIDDEN),
    USER_EMAIL_EXISTED(1006, "Email đã tồn tại", HttpStatus.CONFLICT),
    USER_PHONE_EXISTED(1007, "Số điện thoại đã được sử dụng", HttpStatus.CONFLICT),
    USER_PASSWORD_NOT_MATCH(108, "Mật khẩu không khớp, vui lòng nhập lại", HttpStatus.BAD_REQUEST),


    // --------- Auth / Security (2xxx) ---------
    AUTH_INVALID_CREDENTIALS(2001, "Sai thông tin đăng nhập", HttpStatus.UNAUTHORIZED),
    AUTH_TOKEN_EXPIRED(2002, "Token đã hết hạn", HttpStatus.UNAUTHORIZED),
    AUTH_FORBIDDEN(2003, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    AUTH_ACCOUNT_LOCKED(2004, "Tài khoản bị khoá do đăng nhập thất bại", HttpStatus.FORBIDDEN),
    AUTH_UNAUTHENTICATED(2005, "Tài khoản chưa được xác thực", HttpStatus.UNAUTHORIZED),


    // --------- Product / Catalog (3xxx) ---------
    PRODUCT_NOT_FOUND(3001, "Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND),
    PRODUCT_EXISTED(3002, "Sản phẩm đã tồn tại", HttpStatus.CONFLICT),
    PRODUCT_INVALID_INPUT(3003, "Dữ liệu sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST),
    PRODUCT_OUT_OF_STOCK(3004, "Sản phẩm đã hết hàng", HttpStatus.BAD_REQUEST),

    // --------- Order (4xxx) ---------
    ORDER_NOT_FOUND(4001, "Không tìm thấy đơn hàng", HttpStatus.NOT_FOUND),
    ORDER_INVALID_STATUS(4002, "Trạng thái đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL(4003, "Không thể huỷ đơn ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),
    ORDER_PAYMENT_PENDING(4004, "Đơn hàng đang chờ thanh toán", HttpStatus.BAD_REQUEST),


    // --------- Payment (5xxx) ---------
    PAYMENT_FAILED(5001, "Thanh toán thất bại", HttpStatus.PAYMENT_REQUIRED),
    PAYMENT_NOT_FOUND(5002, "Không tìm thấy giao dịch thanh toán", HttpStatus.NOT_FOUND),
    PAYMENT_INVALID(5003, "Dữ liệu thanh toán không hợp lệ", HttpStatus.BAD_REQUEST),


    // --------- Cart / Inventory (6xxx) ---------
    CART_NOT_FOUND(6001, "Không tìm thấy giỏ hàng", HttpStatus.NOT_FOUND),
    CART_EMPTY(6002, "Giỏ hàng trống", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(6003, "Sản phẩm trong giỏ không tồn tại", HttpStatus.NOT_FOUND),


    INVENTORY_LOW_STOCK(6101, "Tồn kho không đủ", HttpStatus.BAD_REQUEST),
    INVENTORY_LOCK_FAILED(6102, "Khóa tồn kho thất bại", HttpStatus.CONFLICT),


    // --------- Shipping / Delivery (7xxx) ---------
    SHIPMENT_NOT_FOUND(7001, "Không tìm thấy vận đơn", HttpStatus.NOT_FOUND),
    SHIPMENT_INVALID_INFO(7002, "Thông tin vận chuyển không hợp lệ", HttpStatus.BAD_REQUEST),


    // --------- Promotion / Voucher (8xxx) ---------
    VOUCHER_NOT_FOUND(8001, "Không tìm thấy mã giảm giá", HttpStatus.NOT_FOUND),
    VOUCHER_EXPIRED(8002, "Mã giảm giá đã hết hạn", HttpStatus.BAD_REQUEST),
    VOUCHER_INVALID(8003, "Mã giảm giá không hợp lệ", HttpStatus.BAD_REQUEST),


    // --------- Files / Uploads (81xx) ---------
    FILE_UPLOAD_FAILED(8101, "Upload file thất bại", HttpStatus.BAD_REQUEST),
    IMAGE_TOO_LARGE(8102, "Kích thước ảnh vượt quá giới hạn", HttpStatus.BAD_REQUEST),


    // --------- External / DB / System (9xxx) ---------
    EXTERNAL_SERVICE_TIMEOUT(9001, "Service ngoài thời gian phản hồi", HttpStatus.GATEWAY_TIMEOUT),
    EXTERNAL_SERVICE_ERROR(9002, "Service ngoài trả về lỗi", HttpStatus.SERVICE_UNAVAILABLE),
    DATABASE_ERROR(9003, "Lỗi database", HttpStatus.INTERNAL_SERVER_ERROR),


    // --------- Common System ---------
    INVALID_INPUT(1003, "Dữ liệu nhập vào không hợp lệ", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(2004, "Bạn chưa đăng nhập", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(2005, "Bạn không có quyền truy cập", HttpStatus.FORBIDDEN),


    INTERNAL_SERVER_ERROR(9999, "Lỗi hệ thống, vui lòng thử lại sau", HttpStatus.INTERNAL_SERVER_ERROR);
    ;


    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

     ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
