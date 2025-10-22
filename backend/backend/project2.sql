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

SELECT * from users u ;


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

select * from products;

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

select * from locations l ;

CREATE TABLE orders (
    order_id INT NOT NULL PRIMARY KEY,
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

select * from orders o ;

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);
select * from order_items ;

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
select * from reviews;

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
    unit_cost DECIMAL(15,2) DEFAULT 0.00,
    transaction_source ENUM('PURCHASE','SALE','RETURN','ADJUSTMENT') DEFAULT 'PURCHASE',
    reference_id  BIGINT,
    created_by INT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);


    SELECT 
                p.product_id AS productId,
                p.product_name AS productName,
                p.description AS description,
                p.material AS material,
                p.slug AS slug,
                p.price AS price,
                p.brand AS brand,
                pi.image_url AS imageUrl,
                p.category_id AS categoryId,
                c.category_name AS categoryName,
                COALESCE(SUM(oi.quantity), 0) AS totalSold,
                p.is_featured AS isFeatured
            FROM products p
            LEFT JOIN product_variants v ON v.product_id = p.product_id
            LEFT JOIN order_items oi ON oi.variant_id = v.variant_id
            LEFT JOIN orders o ON o.order_id = oi.order_id AND o.status = 'DELIVERED'
            LEFT JOIN (
                SELECT product_id, MIN(image_url) AS image_url
                FROM product_images
                WHERE is_primary = true
                GROUP BY product_id
            ) pi ON pi.product_id = p.product_id
            LEFT JOIN categories c ON c.category_id = p.category_id
            WHERE p.is_active = true 
              AND p.is_featured = true    -- 🔹 chỉ sản phẩm nổi bật
            GROUP BY p.product_id, p.product_name, p.description, p.material, 
                     p.slug, p.price, p.brand, pi.image_url, p.category_id, 
                     c.category_name, p.is_featured
            ORDER BY totalSold DESC
            LIMIT 8;

-- =============================
-- 35 dòng dữ liệu mẫu cho bảng categories (nội thất)
-- =============================

INSERT INTO categories (category_name, slug, parent_id, sort_order, is_active, image_url) VALUES
-- ===== DANH MỤC GỐC =====
('Phòng Khách',       'phong-khach',       NULL, 1, TRUE, 'images/categories/phong-khach.jpg'),
('Phòng Ngủ',         'phong-ngu',         NULL, 2, TRUE, 'images/categories/phong-ngu.jpg'),
('Phòng Ăn',          'phong-an',          NULL, 3, TRUE, 'images/categories/phong-an.jpg'),
('Văn Phòng',         'van-phong',         NULL, 4, TRUE, 'images/categories/van-phong.jpg'),
('Trang Trí',         'trang-tri',         NULL, 5, TRUE, 'images/categories/trang-tri.jpg'),
('Ngoài Trời',        'ngoai-troi',        NULL, 6, TRUE, 'images/categories/ngoai-troi.jpg'),
('Nhà Tắm',           'nha-tam',           NULL, 7, TRUE, 'images/categories/nha-tam.jpg'),

-- ===== Phòng Khách =====
('Sofa & Ghế Bành',   'sofa-ghe-banh',     1, 1, TRUE, 'images/categories/sofa-ghe-banh.jpg'),
('Bàn Trà',           'ban-tra',           1, 2, TRUE, 'images/categories/ban-tra.jpg'),
('Kệ Tivi',           'ke-tivi',           1, 3, TRUE, 'images/categories/ke-tivi.jpg'),
('Tủ Trang Trí',      'tu-trang-tri',      1, 4, TRUE, 'images/categories/tu-trang-tri.jpg'),
('Thảm Trang Trí',    'tham-trang-tri',    1, 5, TRUE, 'images/categories/tham-trang-tri.jpg'),

-- ===== Phòng Ngủ =====
('Giường Ngủ',        'giuong-ngu',        2, 1, TRUE, 'images/categories/giuong-ngu.jpg'),
('Tủ Quần Áo',        'tu-quan-ao',        2, 2, TRUE, 'images/categories/tu-quan-ao.jpg'),
('Bàn Trang Điểm',    'ban-trang-diem',    2, 3, TRUE, 'images/categories/ban-trang-diem.jpg'),
('Tủ Đầu Giường',     'tu-dau-giuong',     2, 4, TRUE, 'images/categories/tu-dau-giuong.jpg'),
('Đèn Ngủ',           'den-ngu',           2, 5, TRUE, 'images/categories/den-ngu.jpg'),

-- ===== Phòng Ăn =====
('Bàn Ăn',            'ban-an',            3, 1, TRUE, 'images/categories/ban-an.jpg'),
('Ghế Ăn',            'ghe-an',            3, 2, TRUE, 'images/categories/ghe-an.jpg'),
('Tủ Bát',            'tu-bat',            3, 3, TRUE, 'images/categories/tu-bat.jpg'),
('Kệ Rượu',           'ke-ruou',           3, 4, TRUE, 'images/categories/ke-ruou.jpg'),

-- ===== Văn Phòng =====
('Bàn Làm Việc',      'ban-lam-viec',      4, 1, TRUE, 'images/categories/ban-lam-viec.jpg'),
('Ghế Văn Phòng',     'ghe-van-phong',     4, 2, TRUE, 'images/categories/ghe-van-phong.jpg'),
('Tủ Hồ Sơ',          'tu-ho-so',          4, 3, TRUE, 'images/categories/tu-ho-so.jpg'),
('Kệ Sách',           'ke-sach',           4, 4, TRUE, 'images/categories/ke-sach.jpg'),

-- ===== Trang Trí =====
('Tranh Treo Tường',  'tranh-treo-tuong',  5, 1, TRUE, 'images/categories/tranh-treo-tuong.jpg'),
('Đèn Trang Trí',     'den-trang-tri',     5, 2, TRUE, 'images/categories/den-trang-tri.jpg'),
('Bình Hoa',          'binh-hoa',          5, 3, TRUE, 'images/categories/binh-hoa.jpg'),
('Đồng Hồ Treo Tường','dong-ho-treo-tuong',5, 4, TRUE, 'images/categories/dong-ho-treo-tuong.jpg'),

-- ===== Ngoài Trời =====
('Bàn Ghế Sân Vườn',  'ban-ghe-san-vuon',  6, 1, TRUE, 'images/categories/ban-ghe-san-vuon.jpg'),
('Ô Che Nắng',        'o-che-nang',        6, 2, TRUE, 'images/categories/o-che-nang.jpg'),
('Xích Đu Ngoài Trời','xich-du-ngoai-troi',6, 3, TRUE, 'images/categories/xich-du-ngoai-troi.jpg'),

-- ===== Nhà Tắm =====
('Tủ Lavabo',         'tu-lavabo',         7, 1, TRUE, 'images/categories/tu-lavabo.jpg'),
('Gương Trang Trí',   'guong-trang-tri',   7, 2, TRUE, 'images/categories/guong-trang-tri.jpg'),
('Kệ Để Đồ',          'ke-de-do',          7, 3, TRUE, 'images/categories/ke-de-do.jpg');




-- =============================
-- 30 DÒNG DỮ LIỆU MẪU CHO BẢNG PRODUCTS (NỘI THẤT)
-- =============================

INSERT INTO products (product_name, description, price, material, brand, category_id, slug, is_active) VALUES
-- ====== PHÒNG KHÁCH ======
('Sofa Góc Vải Nhung Hiện Đại', 'Sofa góc chữ L bọc vải nhung cao cấp, phù hợp phòng khách rộng.', 12900000, 'Vải nhung', 'FurniHome', 8, 'sofa-vai-nhung-hien-dai', TRUE),
('Bàn Trà Gỗ Sồi Tự Nhiên', 'Bàn trà tròn gỗ sồi phủ sơn mờ, phong cách Bắc Âu tinh tế.', 3500000, 'Gỗ sồi', 'WoodArt', 9, 'ban-tra-go-soi-tu-nhien', TRUE),
('Kệ Tivi Gỗ Công Nghiệp', 'Kệ tivi dài 1m8, thiết kế hiện đại, có 3 ngăn kéo tiện lợi.', 4200000, 'Gỗ MDF phủ Melamine', 'DecoHouse', 10, 'ke-tivi-go-cong-nghiep', TRUE),
('Tủ Trang Trí 3 Tầng', 'Tủ trang trí đa năng, màu trắng, dễ kết hợp nội thất khác.', 2900000, 'Gỗ công nghiệp', 'UrbanDecor', 11, 'tu-trang-tri-3-tang', TRUE),
('Thảm Trang Trí Lông Ngắn', 'Thảm trải sàn cao cấp, chống trượt, dễ vệ sinh.', 950000, 'Sợi polyester', 'SoftHome', 12, 'tham-trang-tri-long-ngan', TRUE),

-- ====== PHÒNG NGỦ ======
('Giường Ngủ Gỗ Tự Nhiên Queen Size', 'Giường ngủ gỗ cao su tự nhiên, thiết kế chắc chắn và sang trọng.', 6800000, 'Gỗ cao su', 'DreamWood', 13, 'giuong-ngu-go-tu-nhien-queen', TRUE),
('Tủ Quần Áo Cửa Lùa 2m', 'Tủ áo cửa lùa hiện đại, tiết kiệm không gian, 3 ngăn rộng rãi.', 8900000, 'Gỗ MDF', 'UrbanDecor', 14, 'tu-quan-ao-cua-lua-2m', TRUE),
('Bàn Trang Điểm Có Gương Đèn LED', 'Bàn trang điểm có gương cảm ứng và ngăn kéo tiện dụng.', 4900000, 'Gỗ công nghiệp', 'BeautyDesk', 15, 'ban-trang-diem-guong-led', TRUE),
('Tủ Đầu Giường 2 Ngăn Kéo', 'Tủ nhỏ đầu giường, màu nâu gỗ, 2 ngăn tiện lợi.', 1450000, 'Gỗ công nghiệp', 'CozyHome', 16, 'tu-dau-giuong-2-ngan', TRUE),
('Đèn Ngủ Để Bàn Kiểu Nhật', 'Đèn ngủ phong cách Nhật Bản, ánh sáng ấm dịu, tiết kiệm điện.', 650000, 'Gỗ tre', 'LightCraft', 17, 'den-ngu-kieu-nhat', TRUE),

-- ====== PHÒNG ĂN ======
('Bộ Bàn Ăn 6 Ghế Gỗ Sồi', 'Bộ bàn ăn gồm bàn chữ nhật và 6 ghế bọc nệm.', 11900000, 'Gỗ sồi', 'FurniHome', 18, 'bo-ban-an-6-ghe-go-soi', TRUE),
('Ghế Ăn Lưng Cong Đệm Da', 'Ghế ăn kiểu dáng hiện đại, đệm da PU êm ái.', 1200000, 'Gỗ cao su, da PU', 'DecoHouse', 19, 'ghe-an-lung-cong-dem-da', TRUE),
('Tủ Bát 3 Cánh Gỗ Sồi', 'Tủ đựng bát đĩa gỗ sồi tự nhiên, màu sáng sang trọng.', 5200000, 'Gỗ sồi', 'WoodArt', 20, 'tu-bat-3-canh-go-soi', TRUE),
('Kệ Rượu Mini Kiểu Âu', 'Kệ trưng bày rượu nhỏ gọn, phong cách châu Âu cổ điển.', 2700000, 'Gỗ công nghiệp', 'UrbanDecor', 21, 'ke-ruou-mini-kieu-au', TRUE),

-- ====== VĂN PHÒNG ======
('Bàn Làm Việc Gỗ 1m2', 'Bàn làm việc nhỏ gọn, phù hợp không gian gia đình.', 2200000, 'Gỗ MDF phủ Melamine', 'OfficePlus', 22, 'ban-lam-viec-go-1m2', TRUE),
('Ghế Văn Phòng Ergonomic', 'Ghế xoay công thái học, hỗ trợ cột sống, chất liệu lưới thoáng.', 3400000, 'Lưới + khung thép', 'ErgoChair', 23, 'ghe-van-phong-ergonomic', TRUE),
('Tủ Hồ Sơ 2 Cánh Lớn', 'Tủ hồ sơ văn phòng 2 cánh, khóa an toàn, nhiều ngăn chứa.', 3100000, 'Thép sơn tĩnh điện', 'OfficeMate', 24, 'tu-ho-so-2-canh-lon', TRUE),
('Kệ Sách Đứng 5 Tầng', 'Kệ sách đứng bằng gỗ công nghiệp, tiết kiệm không gian.', 1850000, 'Gỗ MDF', 'BookNest', 25, 'ke-sach-dung-5-tang', TRUE),

-- ====== TRANG TRÍ ======
('Tranh Canvas Trừu Tượng', 'Tranh treo tường canvas khung gỗ, in UV chống phai màu.', 890000, 'Vải canvas', 'ArtHouse', 26, 'tranh-canvas-truu-tuong', TRUE),
('Đèn Thả Trần Nghệ Thuật', 'Đèn thả trần bằng kim loại, ánh sáng vàng ấm áp.', 2150000, 'Thép sơn tĩnh điện', 'LightCraft', 27, 'den-tha-tran-nghe-thuat', TRUE),
('Bình Hoa Gốm Trang Trí', 'Bình hoa gốm sứ trắng, kiểu dáng thanh lịch, cao 25cm.', 420000, 'Gốm sứ', 'DecorLine', 28, 'binh-hoa-gom-trang-tri', TRUE),
('Đồng Hồ Treo Tường Vintage', 'Đồng hồ treo tường kim trôi, phong cách cổ điển.', 980000, 'Kim loại + gỗ', 'TimeArt', 29, 'dong-ho-treo-tuong-vintage', TRUE),

-- ====== NGOÀI TRỜI ======
('Bộ Bàn Ghế Sân Vườn Nhôm Đúc', 'Bàn ghế sân vườn nhôm đúc sơn tĩnh điện chống gỉ.', 12500000, 'Nhôm đúc', 'OutdoorPro', 30, 'bo-ban-ghe-san-vuon-nhom-duc', TRUE),
('Ô Che Nắng Tròn 3m', 'Ô che nắng chống tia UV, dễ gập gọn.', 1950000, 'Vải dù + nhôm', 'SunnyShade', 31, 'o-che-nang-tron-3m', TRUE),
('Xích Đu Sân Vườn 2 Chỗ', 'Xích đu ngoài trời khung sắt sơn tĩnh điện, mái che.', 5600000, 'Sắt + vải', 'RelaxGarden', 32, 'xich-du-san-vuon-2-cho', TRUE),

-- ====== NHÀ TẮM ======
('Tủ Lavabo Treo Tường', 'Tủ lavabo gỗ chống ẩm, bề mặt phủ Melamine chống trầy.', 4200000, 'Gỗ MDF chống ẩm', 'BathLine', 33, 'tu-lavabo-treo-tuong', TRUE),
('Gương Tròn Trang Trí Viền Gỗ', 'Gương tròn treo tường viền gỗ tự nhiên, dễ phối hợp.', 890000, 'Gỗ cao su + gương', 'MirrorArt', 34, 'guong-tron-vien-go', TRUE),
('Kệ Để Đồ 3 Tầng Nhà Tắm', 'Kệ inox 3 tầng chống gỉ, tiện dụng cho nhà tắm nhỏ.', 690000, 'Inox 304', 'BathLine', 35, 'ke-de-do-3-tang', TRUE);


INSERT INTO locations (province, district, ward) VALUES
-- Hà Nội & Miền Bắc
('Hà Nội', 'Ba Đình', 'Phúc Xá'),
('Hà Nội', 'Cầu Giấy', 'Dịch Vọng Hậu'),
('Hà Nội', 'Hoàng Mai', 'Tân Mai'),
('Hà Nội', 'Đống Đa', 'Nam Đồng'),
('Hà Nội', 'Tây Hồ', 'Quảng An'),
('Hà Nội', 'Thanh Xuân', 'Hạ Đình'),
('Bắc Ninh', 'Từ Sơn', 'Đông Ngàn'),
('Bắc Giang', 'Yên Dũng', 'Tân Liễu'),
('Thái Nguyên', 'Phổ Yên', 'Ba Hàng'),
('Vĩnh Phúc', 'Vĩnh Yên', 'Định Trung'),
('Phú Thọ', 'Việt Trì', 'Tiên Cát'),
('Hải Dương', 'Chí Linh', 'Sao Đỏ'),
('Hải Phòng', 'Lê Chân', 'Trại Cau'),
('Quảng Ninh', 'Hạ Long', 'Bãi Cháy'),
('Nam Định', 'Nam Trực', 'Nam Giang'),
('Ninh Bình', 'Tam Điệp', 'Tân Bình'),
('Hòa Bình', 'TP Hòa Bình', 'Phương Lâm'),

-- Miền Trung
('Thanh Hóa', 'TP Thanh Hóa', 'Đông Thọ'),
('Nghệ An', 'Vinh', 'Hưng Phúc'),
('Hà Tĩnh', 'Hồng Lĩnh', 'Đậu Liêu'),
('Quảng Bình', 'Đồng Hới', 'Hải Đình'),
('Quảng Trị', 'Đông Hà', 'Phường 1'),
('Thừa Thiên Huế', 'Huế', 'Phước Vĩnh'),
('Đà Nẵng', 'Hải Châu', 'Thạch Thang'),
('Đà Nẵng', 'Sơn Trà', 'An Hải Bắc'),
('Quảng Nam', 'Tam Kỳ', 'Tân Thạnh'),
('Quảng Ngãi', 'TP Quảng Ngãi', 'Nghĩa Chánh'),
('Bình Định', 'Quy Nhơn', 'Ngô Mây'),
('Phú Yên', 'Tuy Hòa', 'Phường 7'),
('Khánh Hòa', 'Nha Trang', 'Vĩnh Phước'),
('Ninh Thuận', 'Phan Rang – Tháp Chàm', 'Phủ Hà'),
('Bình Thuận', 'Phan Thiết', 'Phú Trinh'),

-- Tây Nguyên
('Kon Tum', 'TP Kon Tum', 'Duy Tân'),
('Gia Lai', 'Pleiku', 'Diên Hồng'),
('Đắk Lắk', 'Buôn Ma Thuột', 'Tân Lợi'),
('Đắk Nông', 'Gia Nghĩa', 'Nghĩa Trung'),
('Lâm Đồng', 'Đà Lạt', 'Phường 4'),

-- Miền Nam
('Hồ Chí Minh', 'Quận 1', 'Bến Nghé'),
('Hồ Chí Minh', 'Quận 3', 'Phường 6'),
('Hồ Chí Minh', 'Bình Thạnh', 'Phường 25'),
('Hồ Chí Minh', 'Thủ Đức', 'Hiệp Bình Chánh'),
('Bình Dương', 'Thủ Dầu Một', 'Hiệp Thành'),
('Đồng Nai', 'Biên Hòa', 'Tân Phong'),
('Bà Rịa - Vũng Tàu', 'Vũng Tàu', 'Thắng Nhất'),
('Long An', 'Tân An', 'Phường 2'),
('Tiền Giang', 'Mỹ Tho', 'Phường 5'),
('Bến Tre', 'TP Bến Tre', 'Phú Khương'),
('Vĩnh Long', 'TP Vĩnh Long', 'Phường 9'),
('Cần Thơ', 'Ninh Kiều', 'An Khánh'),
('An Giang', 'Long Xuyên', 'Mỹ Bình'),
('Kiên Giang', 'Rạch Giá', 'Vĩnh Thanh'),
('Cà Mau', 'TP Cà Mau', 'Phường 7');
