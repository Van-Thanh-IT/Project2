CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    facebook_id VARCHAR(255),
    google_id VARCHAR(255),
    provider ENUM('local','google','facebook') DEFAULT 'local',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL
);


CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    material VARCHAR(100),
    brand VARCHAR(100),
    category_id INT,
    slug VARCHAR(150) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE, -- ảnh chính hay không
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);


CREATE TABLE product_variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    weight DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    image_url VARCHAR(255),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    location_id INT,
    code VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(12,2) NOT NULL,
    shipping_fee DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    placed_at DATETIME NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),  -- nếu khách chưa đăng nhập
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    status ENUM('PREPARING','SHIPPED','DELIVERED','RETURNED') DEFAULT 'PREPARING',
    shipped_at DATETIME,
    delivered_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    amount DECIMAL(12,2) NOT NULL,
    paid_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    status ENUM('PENDING','APPROVED','HIDDEN') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_status (status) 
);

CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,      -- ID bản ghi tồn kho
    variant_id INT NOT NULL,                          -- Liên kết biến thể sản phẩm
    quantity INT NOT NULL,                            -- Số lượng hiện tại trong kho
    safety_stock INT DEFAULT 0,                       -- Mức cảnh báo tồn kho tối thiểu
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Thời gian cập nhật cuối
    updated_by INT,                                   -- ID nhân viên cập nhật tồn kho
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);


CREATE TABLE inventory_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    transaction_type ENUM('IMPORT','EXPORT') NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2) DEFAULT 0.00,
    transaction_source ENUM('PURCHASE','SALE','RETURN','ADJUSTMENT') DEFAULT 'PURCHASE',
    reference_id INT,
    created_by INT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);


-- 15 dòng dữ liệu mẫu cho bảng categories (bán nội thất)

INSERT INTO categories (category_name, slug, parent_id, sort_order, is_active, image_url) VALUES
-- Danh mục gốc
('Phòng Khách',       'phong-khach',       NULL, 1, TRUE, 'images/categories/phong-khach.jpg'),
('Phòng Ngủ',         'phong-ngu',         NULL, 2, TRUE, 'images/categories/phong-ngu.jpg'),
('Phòng Ăn',          'phong-an',          NULL, 3, TRUE, 'images/categories/phong-an.jpg'),
('Văn Phòng',         'van-phong',         NULL, 4, TRUE, 'images/categories/van-phong.jpg'),
('Trang Trí',         'trang-tri',         NULL, 5, TRUE, 'images/categories/trang-tri.jpg'),

-- Danh mục con cho Phòng Khách
('Sofa & Ghế Bành',   'sofa-ghe-banh',     1, 1, TRUE, 'images/categories/sofa-ghe-banh.jpg'),
('Bàn Trà',           'ban-tra',           1, 2, TRUE, 'images/categories/ban-tra.jpg'),
('Kệ Tivi',           'ke-tivi',           1, 3, TRUE, 'images/categories/ke-tivi.jpg'),

-- Danh mục con cho Phòng Ngủ
('Giường Ngủ',        'giuong-ngu',        2, 1, TRUE, 'images/categories/giuong-ngu.jpg'),
('Tủ Quần Áo',        'tu-quan-ao',        2, 2, TRUE, 'images/categories/tu-quan-ao.jpg'),
('Bàn Trang Điểm',    'ban-trang-diem',    2, 3, TRUE, 'images/categories/ban-trang-diem.jpg'),

-- Danh mục con cho Phòng Ăn
('Bàn Ăn',            'ban-an',            3, 1, TRUE, 'images/categories/ban-an.jpg'),
('Ghế Ăn',            'ghe-an',            3, 2, TRUE, 'images/categories/ghe-an.jpg'),

-- Danh mục con cho Văn Phòng
('Bàn Làm Việc',      'ban-lam-viec',      4, 1, TRUE, 'images/categories/ban-lam-viec.jpg'),
('Ghế Văn Phòng',     'ghe-van-phong',     4, 2, TRUE, 'images/categories/ghe-van-phong.jpg');




INSERT INTO products (product_name, description, price, material, brand, category_id, slug, is_active)
VALUES
-- Sản phẩm cho Phòng Khách
('Sofa Da 3 Chỗ Hiện Đại', 'Sofa da cao cấp cho phòng khách hiện đại.', 12500000, 'Da bò', 'Hòa Phát', 6, 'sofa-da-3-cho-hien-dai', TRUE),
('Ghế Bành Thư Giãn', 'Ghế bành bọc nỉ, khung gỗ tự nhiên, êm ái.', 5800000, 'Nỉ, gỗ sồi', 'IKEA', 6, 'ghe-banh-thu-gian', TRUE),
('Bàn Trà Mặt Kính Tròn', 'Bàn trà thiết kế tối giản, chân gỗ sồi, mặt kính cường lực.', 3200000, 'Kính, gỗ sồi', 'Kenli', 7, 'ban-tra-mat-kinh-tron', TRUE),
('Kệ Tivi Gỗ Óc Chó', 'Kệ tivi thiết kế sang trọng, gỗ óc chó tự nhiên.', 7800000, 'Gỗ óc chó', 'AConcept', 8, 'ke-tivi-go-oc-cho', TRUE),

-- Sản phẩm cho Phòng Ngủ
('Giường Ngủ Gỗ Sồi 1m8', 'Giường ngủ khung gỗ sồi, phong cách Bắc Âu.', 9500000, 'Gỗ sồi', 'IKEA', 9, 'giuong-ngu-go-soi-1m8', TRUE),
('Tủ Quần Áo Cánh Lùa', 'Tủ quần áo 3 cánh lùa, gỗ MDF phủ melamine chống ẩm.', 8200000, 'Gỗ MDF', 'Hòa Phát', 10, 'tu-quan-ao-canh-lua', TRUE),
('Bàn Trang Điểm Có Đèn LED', 'Bàn trang điểm có gương và đèn LED tích hợp.', 4500000, 'Gỗ MDF, kính', 'Nội Thất Việt', 11, 'ban-trang-diem-co-den-led', TRUE),

-- Sản phẩm cho Phòng Ăn
('Bàn Ăn Gỗ Óc Chó 6 Ghế', 'Bàn ăn chữ nhật, gỗ óc chó cao cấp.', 14500000, 'Gỗ óc chó', 'AConcept', 12, 'ban-an-go-oc-cho-6-ghe', TRUE),
('Ghế Ăn Đệm Da', 'Ghế ăn có đệm da êm, chân kim loại sơn tĩnh điện.', 1850000, 'Da PU, thép', 'Kenli', 13, 'ghe-an-dem-da', TRUE),

-- Sản phẩm cho Văn Phòng
('Bàn Làm Việc Chữ L', 'Bàn làm việc chữ L, gỗ công nghiệp phủ melamine.', 5200000, 'Gỗ MDF', 'Xuân Hòa', 14, 'ban-lam-viec-chu-l', TRUE),
('Ghế Văn Phòng Công Thái Học', 'Ghế xoay lưng cao, đệm lưới thoáng khí.', 3250000, 'Lưới, nhựa PP', 'ErgoChair', 15, 'ghe-van-phong-cong-thai-hoc', TRUE),

-- Sản phẩm cho Trang Trí
('Đèn Trang Trí Chùm Pha Lê', 'Đèn chùm pha lê sang trọng cho phòng khách.', 6800000, 'Pha lê, kim loại', 'Philips', 5, 'den-trang-tri-chum-pha-le', TRUE),
('Thảm Lông Cừu Nhân Tạo', 'Thảm lông mềm mại, giữ ấm và tăng tính thẩm mỹ.', 2100000, 'Lông nhân tạo', 'IKEA', 5, 'tham-long-cuu-nhan-tao', TRUE),
('Gương Treo Tường Nghệ Thuật', 'Gương khung gỗ tự nhiên, kiểu dáng hiện đại.', 2700000, 'Gỗ tự nhiên, kính', 'Nội Thất Việt', 5, 'guong-treo-tuong-nghe-thuat', TRUE);


select * from products p ;

INSERT INTO product_variants (product_id, color, size, price, weight, is_active) VALUES
-- Sofa Da 3 Chỗ Hiện Đại
(1, 'Nâu', '2.2m', 12500000, 55.0, TRUE),
(1, 'Đen', '2.2m', 12800000, 55.5, TRUE),

-- Ghế Bành Thư Giãn
(2, 'Xám', '70x80cm', 5800000, 18.5, TRUE),
(2, 'Be', '70x80cm', 5900000, 18.7, TRUE),

-- Bàn Trà Mặt Kính Tròn
(3, 'Trắng', 'Ø60cm', 3200000, 15.0, TRUE),
(3, 'Đen', 'Ø60cm', 3300000, 15.2, TRUE),

-- Kệ Tivi Gỗ Óc Chó
(4, 'Nâu Gỗ', '1.8m', 7800000, 35.0, TRUE),

-- Giường Ngủ Gỗ Sồi
(5, 'Tự Nhiên', '1.8x2.0m', 9500000, 60.0, TRUE),
(5, 'Nâu Nhạt', '1.8x2.0m', 9700000, 60.5, TRUE),

-- Tủ Quần Áo Cánh Lùa
(6, 'Trắng', '2.0x2.2m', 8200000, 80.0, TRUE),
(6, 'Nâu', '2.0x2.2m', 8300000, 80.5, TRUE),

-- Bàn Trang Điểm Có Đèn LED
(7, 'Trắng', '1.2m', 4500000, 22.0, TRUE),

-- Bàn Ăn Gỗ Óc Chó
(8, 'Nâu Gỗ', '1.6x0.8m', 14500000, 50.0, TRUE),

-- Ghế Ăn Đệm Da
(9, 'Xám', '45x45x85cm', 1850000, 7.5, TRUE),
(9, 'Đen', '45x45x85cm', 1900000, 7.8, TRUE),

-- Bàn Làm Việc Chữ L
(10, 'Trắng', '1.4x0.7m', 5200000, 42.0, TRUE),

-- Ghế Văn Phòng Công Thái Học
(11, 'Đen', '50x50x120cm', 3250000, 15.0, TRUE),

-- Đèn Trang Trí Chùm Pha Lê
(12, 'Vàng', 'Ø80cm', 6800000, 10.0, TRUE),

-- Thảm Lông Cừu Nhân Tạo
(13, 'Trắng', '2x3m', 2100000, 5.5, TRUE),

-- Gương Treo Tường Nghệ Thuật
(14, 'Khung Gỗ Tự Nhiên', 'Ø80cm', 2700000, 4.2, TRUE);

INSERT INTO locations (province, district, ward) VALUES
('Hà Nội',        'Quận Hoàn Kiếm',     'Phường Hàng Bạc'),
('Hà Nội',        'Quận Cầu Giấy',      'Phường Dịch Vọng'),
('Hà Nội',        'Quận Thanh Xuân',    'Phường Khương Trung'),
('TP. Hồ Chí Minh','Quận 1',            'Phường Bến Nghé'),
('TP. Hồ Chí Minh','Quận Bình Thạnh',   'Phường 25'),
('TP. Hồ Chí Minh','Quận Gò Vấp',       'Phường 7'),
('Đà Nẵng',       'Quận Hải Châu',      'Phường Thạch Thang'),
('Đà Nẵng',       'Quận Sơn Trà',       'Phường An Hải Bắc'),
('Hải Phòng',     'Quận Lê Chân',       'Phường Dư Hàng'),
('Cần Thơ',       'Quận Ninh Kiều',     'Phường An Cư');

INSERT INTO locations (province, district, ward) VALUES
('Hà Nội', 'Quận Ba Đình', 'Phường Điện Biên'),
('Hà Nội', 'Quận Đống Đa', 'Phường Ô Chợ Dừa'),
('Hà Nội', 'Quận Tây Hồ', 'Phường Quảng An'),
('Hà Nội', 'Quận Bắc Từ Liêm', 'Phường Cổ Nhuế 1'),
('Hà Nội', 'Quận Bắc Từ Liêm', 'Phường Cổ Nhuế 2'),
('Hà Nội', 'Quận Nam Từ Liêm', 'Phường Mỹ Đình 1'),
('Hà Nội', 'Quận Nam Từ Liêm', 'Phường Mỹ Đình 2'),
('Hà Nội', 'Quận Hai Bà Trưng', 'Phường Trần Hưng Đạo'),
('Hà Nội', 'Quận Hai Bà Trưng', 'Phường Bạch Mai'),
('Hà Nội', 'Quận Hoàng Mai', 'Phường Mai Động'),

('TP. Hồ Chí Minh','Quận 3','Phường Võ Thị Sáu'),
('TP. Hồ Chí Minh','Quận 3','Phường 7'),
('TP. Hồ Chí Minh','Quận 3','Phường 8'),
('TP. Hồ Chí Minh','Quận 10','Phường 14'),
('TP. Hồ Chí Minh','Quận 10','Phường 15'),
('TP. Hồ Chí Minh','Quận Phú Nhuận','Phường 17'),
('TP. Hồ Chí Minh','Quận Phú Nhuận','Phường 9'),
('TP. Hồ Chí Minh','Quận Tân Bình','Phường 4'),
('TP. Hồ Chí Minh','Quận Tân Bình','Phường 5'),
('TP. Hồ Chí Minh','Quận Thủ Đức','Phường Linh Xuân'),

('Đà Nẵng','Quận Ngũ Hành Sơn','Phường Mỹ An'),
('Đà Nẵng','Quận Ngũ Hành Sơn','Phường Khuê Mỹ'),
('Đà Nẵng','Quận Liên Chiểu','Phường Hòa Khánh Bắc'),
('Đà Nẵng','Quận Liên Chiểu','Phường Hòa Khánh Nam'),
('Đà Nẵng','Quận Thanh Khê','Phường Xuân Hà'),
('Đà Nẵng','Quận Thanh Khê','Phường Tân Chính'),
('Đà Nẵng','Quận Thanh Khê','Phường Thạc Gián'),
('Đà Nẵng','Quận Sơn Trà','Phường An Hải Tây'),
('Đà Nẵng','Quận Sơn Trà','Phường Thọ Quang'),
('Đà Nẵng','Quận Sơn Trà','Phường Mân Thái'),

('Hải Phòng','Quận Ngô Quyền','Phường Máy Tơ'),
('Hải Phòng','Quận Ngô Quyền','Phường Hàng Kênh'),
('Hải Phòng','Quận Hồng Bàng','Phường Hạ Lý'),
('Hải Phòng','Quận Hồng Bàng','Phường Hoàng Văn Thụ'),
('Hải Phòng','Quận Kiến An','Phường Lãm Hà'),
('Hải Phòng','Quận Kiến An','Phường Trần Thành Ngọ'),
('Hải Phòng','Quận Hải An','Phường Thành Tô'),
('Hải Phòng','Quận Hải An','Phường Nam Hải'),
('Cần Thơ','Quận Bình Thủy','Phường Trà An'),
('Cần Thơ','Quận Bình Thủy','Phường An Thới'),

('Cần Thơ','Quận Cái Răng','Phường Lê Bình'),
('Cần Thơ','Quận Cái Răng','Phường Hưng Phú'),
('Cần Thơ','Quận Ô Môn','Phường Châu Văn Liêm'),
('Cần Thơ','Quận Ô Môn','Phường Thới Hòa'),
('Cần Thơ','Quận Thốt Nốt','Phường Thốt Nốt'),
('Cần Thơ','Quận Thốt Nốt','Phường Thuận Hưng'),
('Bắc Ninh','Thị xã Từ Sơn','Phường Đồng Kỵ'),
('Bắc Ninh','Thị xã Từ Sơn','Phường Tương Giang'),
('Bắc Ninh','Huyện Yên Phong','Phường Châu Khê'),
('Bắc Ninh','Huyện Quế Võ','Phường Phượng Mao');



-- Thêm 10 đơn hàng mẫu
INSERT INTO orders (user_id, location_id, code, status, subtotal, shipping_fee, total, placed_at, shipping_address, full_name, phone)
VALUES
(2, 1, 'ORD001', 'PENDING',   12500000, 50000, 12550000, NOW(), '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',     'Nguyễn Văn A', '0901234567'),
(2, 2, 'ORD002', 'CONFIRMED', 8200000,  30000, 8230000,  NOW(), '35 Dịch Vọng, Cầu Giấy, Hà Nội',     'Trần Thị B',    '0912345678'),
(3, 3, 'ORD003', 'SHIPPED',   4500000,  25000, 4525000,  NOW(), '78 Khương Trung, Thanh Xuân, Hà Nội','Lê Văn C',      '0987654321'),
(4, 4, 'ORD004', 'DELIVERED', 14500000, 60000, 14560000, NOW(), '22 Nguyễn Huệ, Q.1, TP.HCM',         'Phạm Thị D',    '0934567890'),
(6, 5, 'ORD005', 'CANCELLED', 9500000,  40000, 9540000,  NOW(), '56 Xô Viết Nghệ Tĩnh, Bình Thạnh',   'Nguyễn Văn A',  '0901234567'),
(2, 6, 'ORD006', 'PENDING',   7800000,  35000, 7835000,  NOW(), '120 Phạm Văn Đồng, Gò Vấp',         'Trần Thị B',    '0912345678'),
(3, 7, 'ORD007', 'CONFIRMED', 3200000,  30000, 3230000,  NOW(), '45 Bạch Đằng, Hải Châu, Đà Nẵng',    'Lê Văn C',      '0987654321'),
(4, 8, 'ORD008', 'SHIPPED',   2100000,  25000, 2125000,  NOW(), '32 Võ Văn Kiệt, Sơn Trà, Đà Nẵng',   'Phạm Thị D',    '0934567890'),
(4, 9, 'ORD009', 'DELIVERED', 3250000,  20000, 3270000,  NOW(), '99 Trần Nguyên Hãn, Lê Chân, HP',    'Nguyễn Văn A',  '0901234567'),
(5,10, 'ORD010','PENDING',    1850000,  30000, 1880000,  NOW(), '14 Mậu Thân, Ninh Kiều, Cần Thơ',    'Hoàng Văn E',   '0971234567');


INSERT INTO order_items (order_id, variant_id, quantity, price)
VALUES
(41, 1, 2, 250000.00),     -- Đơn 1: 2 sản phẩm variant 1
(41, 2, 1, 500000.00),     -- Đơn 1: 1 sản phẩm variant 2
(42, 3, 1, 750000.00),     -- Đơn 2: 1 sản phẩm variant 3
(43, 4, 3, 300000.00),     -- Đơn 3: 3 sản phẩm variant 4
(44, 5, 2, 400000.00),     -- Đơn 4: 2 sản phẩm variant 5
(45, 6, 1, 650000.00),     -- Đơn 5: 1 sản phẩm variant 6
(46, 7, 2, 550000.00),     -- Đơn 6: 2 sản phẩm variant 7
(47, 8, 4, 200000.00),     -- Đơn 7: 4 sản phẩm variant 8
(48, 9, 1, 800000.00),     -- Đơn 8: 1 sản phẩm variant 9
(49, 10, 2, 350000.00);    -- Đơn 9: 2 sản phẩm variant 10


INSERT INTO payments (order_id, method, status, amount, paid_at)
VALUES
(41,  'COD',        'PENDING',  1530000.00, NULL),                       -- Chưa thanh toán
(42,  'BANK_TRANSFER','PAID',   2035000.00, '2025-09-21 09:45:00'),       -- Đã thanh toán qua chuyển khoản
(43,  'CREDIT_CARD','PAID',     775000.00,  '2025-09-21 12:00:00'),       -- Đã thanh toán qua thẻ
(44,  'COD',        'PAID',     1230000.00, '2025-09-22 11:15:00'),       -- Đã thanh toán khi nhận hàng
(45,  'E_WALLET',   'REFUNDED', 520000.00,  '2025-09-22 12:00:00'),       -- Đơn bị hủy và hoàn tiền
(46,  'BANK_TRANSFER','PAID',   1830000.00, '2025-09-23 08:45:00'),       -- Đã thanh toán qua chuyển khoản
(47,  'CREDIT_CARD','FAILED',   2235000.00, NULL),                        -- Giao dịch thất bại
(48,  'E_WALLET',   'PAID',     975000.00,  '2025-09-24 09:30:00'),       -- Thanh toán ví điện tử
(49,  'COD',        'PAID',     1380000.00, '2025-09-25 10:00:00'),       -- Thanh toán khi nhận hàng
(49, 'BANK_TRANSFER','PENDING',1680000.00, NULL);      -- Đang chờ thanh toán


INSERT INTO shipments (order_id, carrier, tracking_number, status, shipped_at, delivered_at)
VALUES
(41,  'GHN', 'GHN123456',      'PREPARING', '2025-09-21 08:00:00', NULL),
(42,  'GHTK','GHTK654321',     'SHIPPED',   '2025-09-21 09:30:00', NULL),
(43,  'VNPost','VNPOST11111',  'DELIVERED', '2025-09-20 10:00:00', '2025-09-22 14:30:00'),
(44,  'J&T','JT22222',         'DELIVERED', '2025-09-20 15:00:00', '2025-09-23 11:00:00'),
(45,  'Ninja Van','NV33333',   'RETURNED',  '2025-09-22 13:00:00', NULL),
(46,  'GHN','GHN44444',        'PREPARING', '2025-09-23 08:30:00', NULL),
(47,  'GHTK','GHTK55555',      'SHIPPED',   '2025-09-23 10:00:00', NULL),
(48,  'VNPost','VNPOST66666',  'DELIVERED', '2025-09-24 09:15:00', '2025-09-26 15:00:00'),
(49,  'J&T','JT77777',         'PREPARING', '2025-09-24 11:00:00', NULL),
(50, 'Ninja Van','NV88888',   'SHIPPED',   '2025-09-25 10:45:00', NULL);


INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
VALUES
(2, 1, 5, 'Ghế sofa rất êm và màu sắc đẹp, giao hàng nhanh.',       '2025-09-21 10:00:00'),
(2, 2, 4, 'Bàn ăn chắc chắn, hơi nặng nhưng chất lượng tốt.',      '2025-09-21 11:15:00'),
(3, 3, 5, 'Tủ quần áo rộng rãi, gỗ mịn và bền.',                   '2025-09-22 09:30:00'),
(4, 4, 3, 'Giường ngủ đẹp nhưng lắp ráp hơi khó.',                 '2025-09-22 13:00:00'),
(5, 5, 4, 'Kệ sách gọn gàng, giá hợp lý.',                          '2025-09-22 15:45:00'),
(5, 6, 5, 'Bàn làm việc thiết kế hiện đại, phù hợp văn phòng.',     '2025-09-23 08:20:00'),
(2, 7, 4, 'Ghế văn phòng thoải mái, đệm hơi cứng.',                '2025-09-23 10:10:00'),
(3, 8, 2, 'Đèn trang trí đẹp nhưng hơi mờ, nên tăng độ sáng.',      '2025-09-23 12:00:00'),
(4, 9, 5, 'Tủ giày gỗ tự nhiên rất bền và đẹp.',                    '2025-09-24 09:50:00'),
(5,10, 4, 'Bàn học chắc chắn, phù hợp trẻ em.',                     '2025-09-24 11:25:00');


