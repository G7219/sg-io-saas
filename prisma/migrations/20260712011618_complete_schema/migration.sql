/*
  Warnings:

  - You are about to drop the column `mobile_money_network` on the `securityincident` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_money_number` on the `securityincident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `images` LONGTEXT NULL,
    ADD COLUMN `productImage` LONGTEXT NULL,
    ADD COLUMN `product_image` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `securityincident` DROP COLUMN `mobile_money_network`,
    DROP COLUMN `mobile_money_number`;

-- AlterTable
ALTER TABLE `tenant` ADD COLUMN `ai_message_reset_date` DATETIME(3) NULL,
    ADD COLUMN `ai_messages_limit` INTEGER NOT NULL DEFAULT 10000,
    ADD COLUMN `ai_messages_used` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `branding_config` JSON NULL,
    ADD COLUMN `logo_url` LONGTEXT NULL,
    ADD COLUMN `subscription_plan_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tenantsettings` ADD COLUMN `api_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `branding_config` LONGTEXT NULL,
    ADD COLUMN `language` VARCHAR(191) NULL DEFAULT 'en',
    ADD COLUMN `maps_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `mobile_money_network` VARCHAR(50) NULL,
    ADD COLUMN `mobile_money_number` VARCHAR(50) NULL,
    ADD COLUMN `reviews_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `theme` VARCHAR(191) NULL DEFAULT 'light',
    ADD COLUMN `timezone` VARCHAR(191) NULL DEFAULT 'UTC',
    ADD COLUMN `white_label` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `SubscriptionPlan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `price_usd` DOUBLE NOT NULL DEFAULT 0,
    `price_kes` DOUBLE NOT NULL DEFAULT 0,
    `price_eur` DOUBLE NOT NULL DEFAULT 0,
    `ai_messages_monthly` INTEGER NOT NULL DEFAULT 10000,
    `overage_cost_per_1k` DOUBLE NOT NULL DEFAULT 0,
    `max_users` INTEGER NOT NULL DEFAULT 1,
    `max_products` INTEGER NOT NULL DEFAULT 100,
    `max_orders` INTEGER NOT NULL DEFAULT 1000,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SubscriptionPlan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `minTier` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Feature_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanFeature` (
    `id` VARCHAR(191) NOT NULL,
    `plan_id` VARCHAR(191) NOT NULL,
    `feature_id` VARCHAR(191) NOT NULL,

    INDEX `PlanFeature_plan_id_idx`(`plan_id`),
    INDEX `PlanFeature_feature_id_idx`(`feature_id`),
    UNIQUE INDEX `PlanFeature_plan_id_feature_id_key`(`plan_id`, `feature_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `User_tenant_id_idx`(`tenant_id`),
    UNIQUE INDEX `User_tenant_id_email_key`(`tenant_id`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` LONGTEXT NOT NULL,
    `altText` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanFeature` ADD CONSTRAINT `PlanFeature_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `SubscriptionPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanFeature` ADD CONSTRAINT `PlanFeature_feature_id_fkey` FOREIGN KEY (`feature_id`) REFERENCES `Feature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tenant` ADD CONSTRAINT `Tenant_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `SubscriptionPlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
