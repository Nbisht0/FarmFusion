USE farmfusion_db;

-- 1) Drop in correct order (children first)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

-- 2) USERS table - matches User entity
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(50),
    contact VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100)
);

-- 3) ADDRESSES table (optional, if you still use it)
CREATE TABLE addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    user_id BIGINT UNSIGNED,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4) PRODUCTS table - matches Products entity
--    NOTE: added_by_user_id column to match @JoinColumn(name = "added_by_user_id")
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(255),
    price DOUBLE,
    image_url VARCHAR(255),
    category VARCHAR(100),
    added_by_user_id BIGINT UNSIGNED,
    CONSTRAINT fk_product_user FOREIGN KEY (added_by_user_id) REFERENCES users(id)
);

-- 5) ORDERS table
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DOUBLE,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6) ORDER_ITEMS table
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    quantity INT,
    price DOUBLE,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 7) SAMPLE USERS
INSERT INTO users (name, email, password, role, contact, city, state) VALUES
('Ravi Kumar', 'ravi@example.com', 'pass123', 'FARMER', '9876543210', 'Dehradun', 'Uttarakhand'),
('Neha Sharma', 'neha@example.com', 'pass123', 'CUSTOMER', '9123456789', 'Delhi', 'Delhi');

-- 8) SAMPLE ADDRESSES
INSERT INTO addresses (street, city, state, zipcode, user_id) VALUES
('123 Green St', 'Dehradun', 'Uttarakhand', '248001', 1),
('456 Lake Rd', 'Delhi', 'Delhi', '110001', 2);

-- 9) SAMPLE PRODUCTS - link to user 1 (Ravi) via added_by_user_id
INSERT INTO products (name, description, price, image_url, category, added_by_user_id) VALUES
('Organic Tomatoes', 'Fresh organic tomatoes', 50.0, NULL, 'Vegetables', 1),
('Basmati Rice', 'Premium quality basmati rice', 120.0, NULL, 'Grains', 1);

-- 10) SAMPLE ORDER
INSERT INTO orders (user_id, total_price) VALUES
(2, 170.0);

-- 11) SAMPLE ORDER ITEMS
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 100.0),
(1, 2, 1, 120.0);

-- 12) Quick checks
SELECT * FROM users;
SELECT * FROM products;