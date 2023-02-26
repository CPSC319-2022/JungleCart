CREATE DATABASE backend;

CREATE TABLE backend.user
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    email      VARCHAR(100) UNIQUE,
    department VARCHAR(50),
    created_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d'))
);

CREATE TABLE backend.address
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    user_id        INT NOT NULL,
    address_line_1 VARCHAR(200),
    address_line_2 VARCHAR(200),
    city           VARCHAR(100),
    province       VARCHAR(100),
    postal_code    VARCHAR(50),
    recipient      VARCHAR(50),
    telephone      VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE CASCADE
);

CREATE TABLE backend.payment_method
(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    is_paypal       BOOLEAN,
    paypal_id       VARCHAR(100),
    is_credit       BOOLEAN,
    bank_name       VARCHAR(50),
    card_num        VARCHAR(50),
    expiration_date VARCHAR(10),
    first_name      VARCHAR(50),
    last_name       VARCHAR(50)
);

CREATE TABLE backend.buyer
(
    id              INT,
    pref_address_id INT UNIQUE,
    pref_pm_id      INT UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES user (id) ON UPDATE CASCADE,
    FOREIGN KEY (pref_address_id) REFERENCES address (id) ON UPDATE CASCADE,
    FOREIGN KEY (pref_pm_id) REFERENCES payment_method (id) ON UPDATE CASCADE
);

CREATE TABLE backend.seller
(
    id           INT,
    banking_name VARCHAR(100),
    account_num  VARCHAR(100),
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES user (id) ON UPDATE CASCADE
);

CREATE TABLE backend.category
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

CREATE TABLE backend.product
(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    seller_id       INT NOT NULL,
    name            VARCHAR(200),
    price           FLOAT,
    discount        FLOAT,
    description     TEXT,
    address         VARCHAR(255),
    status          VARCHAR(50),
    shipping_method VARCHAR(100),
    created_at      DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
    updated_at      VARCHAR(10),
    total_quantity  INT,
    category_id     INT,
    FOREIGN KEY (seller_id) REFERENCES seller (id) ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (id) ON UPDATE CASCADE
);

CREATE TABLE backend.orders
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    buyer_id   INT NOT NULL,
    status     VARCHAR(50),
    created_at DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
    FOREIGN KEY (buyer_id) REFERENCES buyer (id) ON UPDATE CASCADE
);

CREATE TABLE backend.shipping_status
(
    id                     INT PRIMARY KEY AUTO_INCREMENT,
    status                 VARCHAR(50),
    expected_delivery_date VARCHAR(50)
);

CREATE TABLE backend.order_item
(
    order_id   INT,
    product_id INT,
    shippings  INT UNIQUE NOT NULL,
    quantity   INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE CASCADE,
    FOREIGN KEY (shippings) REFERENCES shipping_status (id) ON UPDATE CASCADE
);


CREATE TABLE backend.shipping_constraint
(
    product_id INT PRIMARY KEY,
    region     VARCHAR(50),
    distance   FLOAT,
    FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE CASCADE
);

CREATE TABLE backend.product_multimedia
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    url        VARCHAR(200),
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE CASCADE
);

CREATE TABLE backend.cart_item
(
    buyer_id   INT,
    product_id INT,
    quantity   INT,
    PRIMARY KEY (buyer_id, product_id),
    FOREIGN KEY (buyer_id) REFERENCES buyer (id) ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE CASCADE
);

CREATE TABLE backend.admin
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    email      VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    department VARCHAR(50),
    role       VARCHAR(50)
)
