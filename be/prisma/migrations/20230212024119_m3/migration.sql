-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `created_at` DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `address_line_1` VARCHAR(191) NOT NULL,
    `address_line_2` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Buyer` (
    `id` INTEGER NOT NULL,
    `pref_address_id` INTEGER NOT NULL,
    `pref_pm_id` INTEGER NOT NULL,

    UNIQUE INDEX `Buyer_id_key`(`id`),
    UNIQUE INDEX `Buyer_pref_address_id_key`(`pref_address_id`),
    UNIQUE INDEX `Buyer_pref_pm_id_key`(`pref_pm_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment_method` (
    `id` INTEGER NOT NULL,
    `is_paypal` BOOLEAN NOT NULL DEFAULT false,
    `paypal_id` VARCHAR(191) NOT NULL,
    `is_credit` BOOLEAN NOT NULL DEFAULT true,
    `bank_name` VARCHAR(191) NOT NULL,
    `card_num` VARCHAR(191) NOT NULL,
    `expirarion_date` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,

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
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL,
    `buyer_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),

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
CREATE TABLE `Order_item` (
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `shippings` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `Order_item_order_id_key`(`order_id`),
    UNIQUE INDEX `Order_item_product_id_key`(`product_id`),
    UNIQUE INDEX `Order_item_shippings_key`(`shippings`),
    PRIMARY KEY (`order_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL,
    `seller_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `shipping_method` VARCHAR(191) NOT NULL,
    `created_at` DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
    `updated_at` VARCHAR(191) NOT NULL,
    `total_quantity` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    UNIQUE INDEX `Product_seller_id_key`(`seller_id`),
    UNIQUE INDEX `Product_category_id_key`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipping_constraint` (
    `product_id` INTEGER NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Shipping_constraint_product_id_key`(`product_id`)
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
CREATE TABLE `Cart_item` (
    `buyer_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `Cart_item_buyer_id_key`(`buyer_id`),
    UNIQUE INDEX `Cart_item_product_id_key`(`product_id`),
    PRIMARY KEY (`buyer_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
