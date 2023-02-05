-- CreateTable
CREATE TABLE `Buyer` (
    `id` INTEGER NOT NULL,
    `pref_address_id` INTEGER NOT NULL,

    UNIQUE INDEX `Buyer_id_key`(`id`),
    UNIQUE INDEX `Buyer_pref_address_id_key`(`pref_address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_paypal` BOOLEAN NOT NULL DEFAULT false,
    `paypal_id` VARCHAR(191) NULL,
    `is_credit` BOOLEAN NOT NULL DEFAULT true,
    `bank_name` VARCHAR(191) NULL,
    `card_num` INTEGER NULL,
    `expirarion_date` VARCHAR(191) NULL,
    `name_on_card` VARCHAR(191) NULL,

    UNIQUE INDEX `Payment_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seller` (
    `id` INTEGER NOT NULL,
    `bank_name` VARCHAR(191) NOT NULL,
    `account_num` INTEGER NOT NULL,

    UNIQUE INDEX `Seller_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Orders_buyer_id_key`(`buyer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipping_status` (
    `id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `expected_delivery_date` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order_items` (
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `shippings` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `Order_items_order_id_key`(`order_id`),
    UNIQUE INDEX `Order_items_product_id_key`(`product_id`),
    UNIQUE INDEX `Order_items_shippings_key`(`shippings`),
    PRIMARY KEY (`order_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL,
    `seller_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `tag` VARCHAR(191) NOT NULL,
    `promoting` BOOLEAN NOT NULL,
    `discription` VARCHAR(191) NOT NULL,
    `remaing_quantity` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` VARCHAR(191) NOT NULL,
    `shipping_cost` DOUBLE NOT NULL,
    `expected_delivery_date` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Products_seller_id_key`(`seller_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipping_constraInt` (
    `product_id` INTEGER NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Shipping_constraInt_product_id_key`(`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product_multimedia` (
    `id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,

    UNIQUE INDEX `Product_multimedia_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `total_item_price` DOUBLE NOT NULL,
    `item_num` INTEGER NOT NULL,
    `shipping_cost` DOUBLE NOT NULL,

    UNIQUE INDEX `Cart_buyer_id_key`(`buyer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart_items` (
    `cart_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `shipping` DOUBLE NOT NULL,

    UNIQUE INDEX `Cart_items_cart_id_key`(`cart_id`),
    UNIQUE INDEX `Cart_items_product_id_key`(`product_id`),
    PRIMARY KEY (`cart_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
