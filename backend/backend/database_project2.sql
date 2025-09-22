CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL
);
INSERT INTO roles (role_name) VALUES ('USER'), ('ADMIN');
select * from roles;
select * from users;
SELECT u.user_id, u.email, u.full_name, u.phone, u.is_active, u.created_at,
       r.role_id, r.role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE u.email = 'lovanthanh34523@gmail.com';


CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
select * from products p ;

INSERT INTO products (product_name, description, price, material, brand, category_id, slug, is_active)
VALUES
('Ghế Sofa Da', 'Ghế sofa da cao cấp, êm ái', 5500000, 'Da', 'Nội Thất Việt', 1, 'ghe-sofa-da', TRUE),
('Bàn Ăn Gỗ Sồi', 'Bàn ăn gỗ sồi tự nhiên, sang trọng', 4200000, 'Gỗ sồi', 'Nội Thất Việt', 2, 'ban-an-go-soi', TRUE),
('Đèn Bàn Trang Trí', 'Đèn bàn hiện đại cho phòng khách', 850000, 'Kim loại & Thủy tinh', 'LightHome', 3, 'den-ban-trang-tri', TRUE),
('Tủ Quần Áo 4 Cánh', 'Tủ quần áo gỗ MDF, nhiều ngăn', 3200000, 'Gỗ MDF', 'Nội Thất Việt', 1, 'tu-quan-ao-4-canh', TRUE),
('Giường Ngủ King Size', 'Giường ngủ king size êm ái', 7600000, 'Gỗ tự nhiên', 'Nội Thất Việt', 2, 'giuong-ngu-king-size', TRUE),
('Bàn Làm Việc Hiện Đại', 'Bàn làm việc gọn nhẹ, hiện đại', 1500000, 'Gỗ MDF', 'WorkSpace', 2, 'ban-lam-viec-hien-dai', TRUE),
('Ghế Văn Phòng Ergonomic', 'Ghế văn phòng chống mỏi lưng', 1900000, 'Vải & Kim loại', 'WorkSpace', 2, 'ghe-van-phong-ergonomic', TRUE),
('Tủ Giày Thông Minh', 'Tủ giày nhiều ngăn, tiết kiệm không gian', 1200000, 'Gỗ MDF', 'Nội Thất Việt', 1, 'tu-giay-thong-minh', TRUE),
('Đèn Treo Trần Phòng Khách', 'Đèn trang trí hiện đại, LED', 2500000, 'Kim loại & Thủy tinh', 'LightHome', 3, 'den-treo-tran-phong-khach', TRUE),
('Bàn Cà Phê Gỗ', 'Bàn cà phê gỗ tự nhiên, sang trọng', 1300000, 'Gỗ tự nhiên', 'Nội Thất Việt', 2, 'ban-ca-phe-go', TRUE);

CREATE TABLE product_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE, -- ảnh chính hay không
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

INSERT INTO product_images (product_id, image_url, is_primary)
VALUES
(1, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(2, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(3, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(4, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(5, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(6, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(7, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(8, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(9, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE),
(10, 'https://www.bing.com/th/id/OIP.2j35kJKcwvuVGTN5xOtNIgHaEr?w=245&h=211&c=8&rs=1&qlt=70&o=7&cb=thws5&dpr=2.6&pid=3.1&rm=3', TRUE);



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
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    shipping_fee DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    placed_at DATETIME NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
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
    status ENUM('preparing','shipped','delivered','returned') DEFAULT 'preparing',
    shipped_at DATETIME,
    delivered_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
    amount DECIMAL(12,2) NOT NULL,
    paid_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

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