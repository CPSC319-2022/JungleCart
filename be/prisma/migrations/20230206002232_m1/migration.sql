/*
  Warnings:

  - You are about to drop the column `item_num` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Shipping_constraInt` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pref_pm_id]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pref_pm_id` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Payment_user_id_key` ON `Payment`;

-- AlterTable
ALTER TABLE `Buyer` ADD COLUMN `pref_pm_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `item_num`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Shipping_constraInt`;

-- CreateTable
CREATE TABLE `Shipping_constraint` (
    `product_id` INTEGER NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Shipping_constraint_product_id_key`(`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Buyer_pref_pm_id_key` ON `Buyer`(`pref_pm_id`);
