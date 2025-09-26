CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL
);
select * from roles;


CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
select * from users;

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);
select * from user_roles;

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

INSERT INTO categories (category_name, slug, parent_id, sort_order, is_active, image_url) VALUES
('Thời trang nam', 'thoi-trang-nam', NULL, 1, TRUE, 'images/male-fashion.jpg'),
('Thời trang nữ', 'thoi-trang-nu', NULL, 2, TRUE, 'images/female-fashion.jpg'),
('Điện thoại & Tablet', 'dien-thoai-tablet', NULL, 3, TRUE, 'images/phones-tablets.jpg'),
('Laptop & Máy tính', 'laptop-may-tinh', NULL, 4, TRUE, 'images/laptops.jpg'),
('Điện tử & Âm thanh', 'dien-tu-am-thanh', NULL, 5, TRUE, 'images/electronics.jpg'),
('Thời trang trẻ em', 'thoi-trang-tre-em', NULL, 6, TRUE, 'images/kids-fashion.jpg'),
('Phụ kiện thời trang', 'phu-kien-thoi-trang', NULL, 7, TRUE, 'images/accessories.jpg'),
('Giày dép nam', 'giay-dep-nam', 1, 1, TRUE, 'images/male-shoes.jpg'),
('Áo sơ mi nam', 'ao-so-mi-nam', 1, 2, TRUE, 'images/male-shirts.jpg'),
('Quần jeans nam', 'quan-jeans-nam', 1, 3, TRUE, 'images/male-jeans.jpg'),
('Váy nữ', 'vay-nu', 2, 1, TRUE, 'images/female-dresses.jpg'),
('Áo khoác nữ', 'ao-khoac-nu', 2, 2, TRUE, 'images/female-coats.jpg'),
('Túi xách nữ', 'tui-xach-nu', 2, 3, TRUE, 'images/female-bags.jpg'),
('Smartphone', 'smartphone', 3, 1, TRUE, 'images/smartphones.jpg'),
('Tablet', 'tablet', 3, 2, TRUE, 'images/tablets.jpg'),
('Laptop gaming', 'laptop-gaming', 4, 1, TRUE, 'images/gaming-laptops.jpg'),
('Laptop văn phòng', 'laptop-van-phong', 4, 2, TRUE, 'images/office-laptops.jpg'),
('Tai nghe', 'tai-nghe', 5, 1, TRUE, 'images/headphones.jpg'),
('Loa Bluetooth', 'loa-bluetooth', 5, 2, TRUE, 'images/bluetooth-speakers.jpg'),
('Balo & Túi xách', 'balo-tui-xach', 7, 1, TRUE, 'images/backpacks-bags.jpg');

select * from categories;


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
INSERT INTO products (product_name, description, price, material, brand, category_id, slug, is_active) VALUES
('Áo sơ mi nam trắng', 'Áo sơ mi nam chất liệu cotton cao cấp, form vừa vặn.', 350000.00, 'Cotton', 'Viettien', 9, 'ao-so-mi-nam-trang', TRUE),
('Quần jeans nam xanh', 'Quần jeans nam trẻ trung, phù hợp đi làm và đi chơi.', 420000.00, 'Denim', 'Levis', 10, 'quan-jeans-nam-xanh', TRUE),
('Giày thể thao nam', 'Giày thể thao nam năng động, đế cao su chống trơn.', 750000.00, 'Da tổng hợp', 'Nike', 8, 'giay-the-thao-nam', TRUE),
('Váy dạ hội nữ', 'Váy dạ hội nữ sang trọng, chất liệu lụa mềm mại.', 1200000.00, 'Lụa', 'Zara', 11, 'vay-da-hoi-nu', TRUE),
('Áo khoác nữ dạ', 'Áo khoác nữ dạ ấm áp, kiểu dáng thanh lịch.', 980000.00, 'Dạ', 'Mango', 12, 'ao-khoac-nu-da', TRUE),
('Túi xách nữ da thật', 'Túi xách nữ bằng da thật, thiết kế thời trang.', 850000.00, 'Da thật', 'Michael Kors', 13, 'tui-xach-nu-da-that', TRUE),
('Smartphone Samsung Galaxy S23', 'Điện thoại Samsung Galaxy S23, màn hình 6.1 inch, RAM 8GB.', 22000000.00, 'Kim loại & kính', 'Samsung', 14, 'samsung-galaxy-s23', TRUE),
('Tablet iPad Air 5', 'iPad Air 5, chip M1, màn hình 10.9 inch.', 18000000.00, 'Nhôm', 'Apple', 15, 'ipad-air-5', TRUE),
('Laptop Gaming MSI GF63', 'Laptop gaming MSI GF63, card GTX 1650, RAM 16GB.', 22000000.00, 'Nhựa & kim loại', 'MSI', 16, 'laptop-gaming-msi-gf63', TRUE),
('Laptop văn phòng Dell Inspiron', 'Laptop Dell Inspiron, CPU i5, RAM 8GB, SSD 512GB.', 15000000.00, 'Nhựa', 'Dell', 17, 'laptop-van-phong-dell-inspiron', TRUE),
('Tai nghe Bluetooth Sony', 'Tai nghe không dây Sony, chống ồn, pin 30 giờ.', 2200000.00, 'Nhựa', 'Sony', 18, 'tai-nghe-bluetooth-sony', TRUE),
('Loa Bluetooth JBL', 'Loa Bluetooth JBL chống nước, công suất 20W.', 1800000.00, 'Nhựa', 'JBL', 19, 'loa-bluetooth-jbl', TRUE),
('Balo nữ thời trang', 'Balo nữ nhỏ gọn, chất liệu canvas bền.', 450000.00, 'Canvas', 'H&M', 20, 'balo-nu-thoi-trang', TRUE),
('Áo thun nam in hình', 'Áo thun nam cotton in hình cá tính.', 250000.00, 'Cotton', 'Uniqlo', 9, 'ao-thun-nam-in-hinh', TRUE),
('Quần short nam kaki', 'Quần short nam kaki co giãn, thoải mái.', 300000.00, 'Kaki', 'Topman', 10, 'quan-short-nam-kaki', TRUE),
('Giày lười nam da bò', 'Giày lười nam da bò thật, kiểu dáng lịch sự.', 650000.00, 'Da bò', 'Geox', 8, 'giay-luoi-nam-da-bo', TRUE),
('Váy công sở nữ', 'Váy công sở nữ nhẹ nhàng, chất liệu thun cao cấp.', 550000.00, 'Thun', 'Vera', 11, 'vay-cong-so-nu', TRUE),
('Áo khoác nữ thể thao', 'Áo khoác nữ thể thao chống gió, chống nước.', 700000.00, 'Polyester', 'Adidas', 12, 'ao-khoac-nu-the-thao', TRUE),
('Túi xách nữ thời trang', 'Túi xách nữ thời trang, nhiều ngăn tiện lợi.', 600000.00, 'PU', 'Charles & Keith', 13, 'tui-xach-nu-thoi-trang', TRUE),
('Laptop văn phòng HP Pavilion', 'Laptop HP Pavilion, CPU i7, RAM 16GB, SSD 512GB.', 18000000.00, 'Nhựa & kim loại', 'HP', 17, 'laptop-van-phong-hp-pavilion', TRUE);

select * from products p ;

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE, -- ảnh chính hay không
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
(1, 'images/products/ao-so-mi-nam-trang-1.jpg', TRUE),
(1, 'images/products/ao-so-mi-nam-trang-2.jpg', FALSE),
(2, 'images/products/quan-jeans-nam-xanh-1.jpg', TRUE),
(2, 'images/products/quan-jeans-nam-xanh-2.jpg', FALSE),
(3, 'images/products/giay-the-thao-nam-1.jpg', TRUE),
(3, 'images/products/giay-the-thao-nam-2.jpg', FALSE),
(4, 'images/products/vay-da-hoi-nu-1.jpg', TRUE),
(5, 'images/products/ao-khoac-nu-da-1.jpg', TRUE),
(6, 'images/products/tui-xach-nu-da-that-1.jpg', TRUE),
(7, 'images/products/samsung-galaxy-s23-1.jpg', TRUE),
(8, 'images/products/ipad-air-5-1.jpg', TRUE),
(9, 'images/products/laptop-gaming-msi-gf63-1.jpg', TRUE),
(10, 'images/products/laptop-van-phong-dell-inspiron-1.jpg', TRUE),
(11, 'images/products/tai-nghe-bluetooth-sony-1.jpg', TRUE),
(12, 'images/products/loa-bluetooth-jbl-1.jpg', TRUE);

SELECT * from product_images;


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
INSERT INTO product_variants (product_id, color, size, price, weight, is_active) VALUES
(1, 'Trắng', 'S', 350000.00, 0.3, TRUE),
(1, 'Trắng', 'M', 350000.00, 0.32, TRUE),
(2, 'Xanh', '32', 420000.00, 0.5, TRUE),
(2, 'Xanh', '34', 420000.00, 0.52, TRUE),
(3, 'Đen', '39', 750000.00, 0.8, TRUE),
(3, 'Đen', '40', 750000.00, 0.82, TRUE),
(4, 'Đỏ', 'M', 1200000.00, 0.4, TRUE),
(4, 'Đỏ', 'L', 1200000.00, 0.42, TRUE),
(5, 'Xám', 'S', 980000.00, 0.6, TRUE),
(5, 'Xám', 'M', 980000.00, 0.62, TRUE),
(6, 'Nâu', 'One Size', 850000.00, 0.5, TRUE),
(7, 'Đen', '128GB', 22000000.00, 0.2, TRUE),
(7, 'Đỏ', '256GB', 24000000.00, 0.21, TRUE),
(8, 'Xám', '64GB', 18000000.00, 0.45, TRUE),
(9, 'Đen', '15 inch', 22000000.00, 2.0, TRUE);

select * from product_variants;




CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
INSERT INTO carts (user_id) VALUES
(1),
(2);


CREATE TABLE cart_items (
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);
INSERT INTO cart_items (cart_id, variant_id, quantity, price) VALUES
(1, 1, 2, 250000.00),
(2, 2, 1, 300000.00);


CREATE TABLE locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100)
);

INSERT INTO locations (province, district, ward) VALUES
('Hà Nội', 'Ba Đình', 'Phúc Xá'),
('Hà Nội', 'Hoàn Kiếm', 'Hàng Bạc'),
('Hà Nội', 'Tây Hồ', 'Quảng An'),
('Hồ Chí Minh', 'Quận 1', 'Bến Nghé'),
('Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu'),
('Hồ Chí Minh', 'Quận 7', 'Phú Mỹ'),
('Đà Nẵng', 'Hải Châu', 'Thạch Thang'),
('Đà Nẵng', 'Ngũ Hành Sơn', 'Khuê Mỹ'),
('Cần Thơ', 'Ninh Kiều', 'An Phú'),
('Cần Thơ', 'Bình Thủy', 'Bùi Hữu Nghĩa'),
('Hải Phòng', 'Ngô Quyền', 'Máy Chai'),
('Hải Phòng', 'Lê Chân', 'An Dương'),
('Huế', 'Thừa Thiên', 'Phú Hội'),
('Huế', 'Phong Điền', 'Phong An'),
('Bình Dương', 'Thủ Dầu Một', 'Phú Hòa');

select * from locations;

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

INSERT INTO orders (user_id, location_id, code, status, subtotal, shipping_fee, total, placed_at, shipping_address, full_name, phone) VALUES
(1, 1, 'ORD001', 'PENDING', 1200000.00, 30000.00, 1230000.00, '2025-09-26 10:00:00', 'Số 1 Phúc Xá, Ba Đình, Hà Nội', 'Nguyễn Văn A', '0901234567'),
(2, 2, 'ORD002', 'CONFIRMED', 850000.00, 20000.00, 870000.00, '2025-09-25 15:30:00', 'Số 5 Hàng Bạc, Hoàn Kiếm, Hà Nội', 'Trần Thị B', '0912345678'),
(3, 3, 'ORD003', 'SHIPPED', 2200000.00, 50000.00, 2250000.00, '2025-09-24 09:45:00', 'Số 12 Quảng An, Tây Hồ, Hà Nội', 'Lê Văn C', '0923456789'),
(4, 4, 'ORD004', 'DELIVERED', 1800000.00, 40000.00, 1840000.00, '2025-09-23 14:20:00', 'Số 8 Bến Nghé, Quận 1, HCM', 'Phạm Thị D', '0934567890'),
(5, 5, 'ORD005', 'CANCELLED', 650000.00, 15000.00, 665000.00, '2025-09-22 11:10:00', 'Số 3 Phường Võ Thị Sáu, Quận 3, HCM', 'Hoàng Văn E', '0945678901'),
(1, 6, 'ORD006', 'PENDING', 950000.00, 25000.00, 975000.00, '2025-09-21 16:45:00', 'Số 7 Phú Mỹ, Quận 7, HCM', 'Nguyễn Văn A', '0901234567'),
(2, 7, 'ORD007', 'CONFIRMED', 1200000.00, 30000.00, 1230000.00, '2025-09-20 12:30:00', 'Số 4 Thạch Thang, Hải Châu, Đà Nẵng', 'Trần Thị B', '0912345678'),
(3, 8, 'ORD008', 'SHIPPED', 1800000.00, 40000.00, 1840000.00, '2025-09-19 10:15:00', 'Số 9 Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng', 'Lê Văn C', '0923456789'),
(4, 9, 'ORD009', 'DELIVERED', 450000.00, 10000.00, 460000.00, '2025-09-18 09:50:00', 'Số 2 An Phú, Ninh Kiều, Cần Thơ', 'Phạm Thị D', '0934567890'),
(5, 10, 'ORD010', 'CANCELLED', 800000.00, 20000.00, 820000.00, '2025-09-17 13:40:00', 'Số 6 Bùi Hữu Nghĩa, Bình Thủy, Cần Thơ', 'Hoàng Văn E', '0945678901'),
(1, 11, 'ORD011', 'PENDING', 700000.00, 15000.00, 715000.00, '2025-09-16 11:25:00', 'Số 5 Máy Chai, Ngô Quyền, Hải Phòng', 'Nguyễn Văn A', '0901234567'),
(2, 12, 'ORD012', 'CONFIRMED', 900000.00, 20000.00, 920000.00, '2025-09-15 15:10:00', 'Số 7 An Dương, Lê Chân, Hải Phòng', 'Trần Thị B', '0912345678'),
(3, 13, 'ORD013', 'SHIPPED', 1250000.00, 30000.00, 1280000.00, '2025-09-14 14:50:00', 'Số 1 Phú Hội, Thừa Thiên, Huế', 'Lê Văn C', '0923456789'),
(4, 14, 'ORD014', 'DELIVERED', 1100000.00, 25000.00, 1125000.00, '2025-09-13 09:30:00', 'Số 3 Phong An, Phong Điền, Huế', 'Phạm Thị D', '0934567890'),
(5, 15, 'ORD015', 'PENDING', 950000.00, 20000.00, 970000.00, '2025-09-12 16:05:00', 'Số 2 Phú Hòa, Thủ Dầu Một, Bình Dương', 'Hoàng Văn E', '0945678901');

select * from orders;

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

INSERT INTO order_items (order_id, variant_id, quantity, price) VALUES
(1, 1, 2, 350000.00),
(1, 3, 1, 750000.00),
(2, 2, 1, 420000.00),
(2, 5, 2, 1200000.00),
(3, 7, 1, 22000000.00),
(3, 11, 1, 2200000.00),
(4, 4, 1, 980000.00),
(4, 6, 1, 850000.00),
(5, 9, 1, 22000000.00),
(5, 12, 1, 1800000.00),
(6, 8, 2, 18000000.00),
(7, 13, 1, 450000.00),
(8, 14, 2, 24000000.00),
(9, 15, 1, 22000000.00),
(10, 3, 1, 750000.00);


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
INSERT INTO shipments (order_id, carrier, tracking_number, status, shipped_at, delivered_at) VALUES
(1, 'Giao Hàng Nhanh', 'GHN001', 'PREPARING', NULL, NULL),
(2, 'VNPost', 'VN001', 'SHIPPED', '2025-09-25 16:00:00', NULL),
(3, 'Giao Hàng Nhanh', 'GHN002', 'DELIVERED', '2025-09-24 10:00:00', '2025-09-25 12:00:00'),
(4, 'VNPost', 'VN002', 'DELIVERED', '2025-09-23 15:00:00', '2025-09-24 14:00:00'),
(5, 'Giao Hàng Tiết Kiệm', 'GHTK001', 'RETURNED', '2025-09-22 12:00:00', '2025-09-23 10:00:00'),
(6, 'Giao Hàng Nhanh', 'GHN003', 'PREPARING', NULL, NULL),
(7, 'VNPost', 'VN003', 'SHIPPED', '2025-09-20 13:00:00', NULL),
(8, 'Giao Hàng Tiết Kiệm', 'GHTK002', 'SHIPPED', '2025-09-19 11:00:00', NULL),
(9, 'VNPost', 'VN004', 'DELIVERED', '2025-09-18 10:00:00', '2025-09-19 09:00:00'),
(10, 'Giao Hàng Nhanh', 'GHN004', 'PREPARING', NULL, NULL),
(11, 'VNPost', 'VN005', 'PREPARING', NULL, NULL),
(12, 'Giao Hàng Tiết Kiệm', 'GHTK003', 'SHIPPED', '2025-09-15 16:00:00', NULL),
(13, 'Giao Hàng Nhanh', 'GHN005', 'DELIVERED', '2025-09-14 15:00:00', '2025-09-15 14:00:00'),
(14, 'VNPost', 'VN006', 'DELIVERED', '2025-09-13 10:00:00', '2025-09-14 09:00:00'),
(15, 'Giao Hàng Tiết Kiệm', 'GHTK004', 'PREPARING', NULL, NULL);

select * from shipments;

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    amount DECIMAL(12,2) NOT NULL,
    paid_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO payments (order_id, method, status, amount, paid_at) VALUES
(1, 'COD', 'PENDING', 1230000.00, NULL),
(2, 'Momo', 'PAID', 870000.00, '2025-09-25 16:05:00'),
(3, 'Bank Transfer', 'PAID', 2250000.00, '2025-09-24 10:15:00'),
(4, 'COD', 'PAID', 1840000.00, '2025-09-23 15:10:00'),
(5, 'Momo', 'REFUNDED', 665000.00, '2025-09-22 12:30:00'),
(6, 'COD', 'PENDING', 975000.00, NULL),
(7, 'Bank Transfer', 'PAID', 1230000.00, '2025-09-20 13:10:00'),
(8, 'COD', 'PAID', 1840000.00, '2025-09-19 11:15:00'),
(9, 'Momo', 'PAID', 460000.00, '2025-09-18 10:05:00'),
(10, 'Bank Transfer', 'FAILED', 820000.00, NULL),
(11, 'COD', 'PENDING', 715000.00, NULL),
(12, 'Momo', 'PAID', 920000.00, '2025-09-15 16:05:00'),
(13, 'Bank Transfer', 'PAID', 1280000.00, '2025-09-14 15:10:00'),
(14, 'COD', 'PAID', 1125000.00, '2025-09-13 10:10:00'),
(15, 'Momo', 'PENDING', 970000.00, NULL);

select * from payments;

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE inventory_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    transaction_type ENUM('import','export') NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    reference_id INT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);