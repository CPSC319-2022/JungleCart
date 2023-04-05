CREATE TABLE temporary_user (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  EMAIL VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE department (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  NAME VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_admin boolean NOT NULL DEFAULT FALSE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department_id INT DEFAULT NULL,
  created_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);


CREATE TABLE address (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  address_line_1 VARCHAR(200) NOT NULL,
  address_line_2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(50) NOT NULL,
  recipient VARCHAR(50) NOT NULL,
  telephone VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE payment_method (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_paypal BOOLEAN NOT NULL DEFAULT FALSE,
  paypal_id VARCHAR(100) DEFAULT NULL,
  is_credit BOOLEAN NOT NULL DEFAULT FALSE,
  bank_name VARCHAR(50),
  card_num VARCHAR(50),
  expiration_date VARCHAR(10),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  constraint payment_check
    CHECK (
      (is_credit and ((card_num is not null) and (expiration_date is not null)))
      or
      (is_paypal and paypal_id is not null)
    )
);

CREATE TABLE buyer (
  id INT PRIMARY KEY,
  pref_address_id INT UNIQUE DEFAULT NULL,
  pref_pm_id INT UNIQUE DEFAULT NULL,
  FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (pref_address_id) REFERENCES address(id) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (pref_pm_id) REFERENCES payment_method(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE seller (
  id INT PRIMARY KEY,
  banking_name VARCHAR(100),
  account_num VARCHAR(100),
  FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TRIGGER create_buyer_and_seller AFTER INSERT ON user
FOR EACH ROW
BEGIN
    INSERT INTO buyer (id) VALUES (NEW.id);
    INSERT INTO seller (id) VALUES (NEW.id);
END;

CREATE TABLE category(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE product_status (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  LABEL VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE shipping_method (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  LABEL VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE product (
	id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT,
  name VARCHAR(200) NOT NULL,
  price FLOAT NOT NULL,
  discount FLOAT DEFAULT (price),
  description TEXT,
  address VARCHAR(255),
  product_status_id INT DEFAULT 1, 
  shipping_method_id INT DEFAULT 1,
  total_quantity INT NOT NULL,
  category_id INT NOT NULL,
  created_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
  updated_at DATE,
  FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES category(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (product_status_id) REFERENCES product_status(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_method(id) ON UPDATE CASCADE ON DELETE RESTRICT 
  );


CREATE TABLE order_status (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  LABEL VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT,
  order_status_id INT DEFAULT 1,
  created_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s''')),
  updated_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s''')),
  total FLOAT,
  FOREIGN KEY (buyer_id) REFERENCES buyer(id) ON DELETE SET NULL,
  FOREIGN KEY (order_status_id) REFERENCES order_status(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE shipping_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(50) NOT NULL,
  expected_delivery_date DATE
);

CREATE TABLE order_item (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  shipping_status_id INT DEFAULT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_status_id) REFERENCES shipping_status(id) ON DELETE SET NULL 
);


CREATE TABLE shipping_constraint (
  product_id INT PRIMARY KEY, 
  region VARCHAR(50),
  distance FLOAT,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE product_multimedia (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  url VARCHAR(200) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
  buyer_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  PRIMARY KEY (buyer_id, product_id) , 
  FOREIGN KEY (buyer_id) REFERENCES buyer(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE VIEW dev.email_view AS
SELECT u.first_name, u.email, p.name, oi.quantity, os.LABEL, ss.status , o.id
FROM dev.orders o
JOIN dev.user u ON o.buyer_id = u.id
JOIN dev.order_item oi ON o.id = oi.order_id
JOIN dev.product p ON p.id = oi.product_id
JOIN dev.order_status os ON o.order_status_id = os.ID
JOIN dev.shipping_status ss ON oi.shipping_status_id = ss.id;