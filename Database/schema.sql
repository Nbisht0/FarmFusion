USE farmfusion_db;

-- Drop in correct order
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

-- Recreate users
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(50),
    contact VARCHAR(20)
);
select * from users;

-- Recreate addresses
CREATE TABLE addresses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zipcode VARCHAR(20),
    user_id BIGINT UNSIGNED,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Recreate products
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(255),
    price DOUBLE,
    farmer_id BIGINT UNSIGNED,
    CONSTRAINT fk_product_user FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- Recreate orders
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DOUBLE,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Recreate order_items
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED,
    product_id BIGINT UNSIGNED,
    quantity INT,
    price DOUBLE,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample users
INSERT INTO users (name, email, password, role, contact) VALUES
('Ravi Kumar', 'ravi@example.com', 'pass123', 'FARMER', '9876543210'),
('Neha Sharma', 'neha@example.com', 'pass123', 'CUSTOMER', '9123456789');

-- Insert sample addresses (linked to users)
INSERT INTO addresses (street, city, state, zipcode, user_id) VALUES
('123 Green St', 'Dehradun', 'Uttarakhand', '248001', 1), -- belongs to Ravi
('456 Lake Rd', 'Delhi', 'Delhi', '110001', 2);          -- belongs to Neha

-- Insert sample products (linked to farmer Ravi -> user_id = 1)
INSERT INTO products (name, description, price, farmer_id) VALUES
('Organic Tomatoes', 'Fresh organic tomatoes', 50.0, 1),
('Basmati Rice', 'Premium quality basmati rice', 120.0, 1);

-- Insert sample orders (linked to customer Neha -> user_id = 2)
INSERT INTO orders (user_id, total_price) VALUES
(2, 170.0);

-- Insert sample order_items (linked to order_id = 1, product_id = 1 & 2)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 100.0),  -- 2kg Tomatoes for ₹100
(1, 2, 1, 120.0);  -- 1 packet Rice for ₹120

select * from products;
