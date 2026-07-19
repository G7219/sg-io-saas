-- CreateTable
CREATE TABLE `Tenant` (
    `id` VARCHAR(191) NOT NULL,
    `business_name` VARCHAR(255) NOT NULL,
    `subdomain` VARCHAR(100) NOT NULL,
    `owner_email` VARCHAR(255) NOT NULL,
    `tier` VARCHAR(191) NOT NULL DEFAULT 'lite',
    `status` VARCHAR(191) NOT NULL DEFAULT 'trial',
    `is_launched` BOOLEAN NOT NULL DEFAULT false,
    `subscription_expires_at` DATETIME(3) NULL,
    `selected_niche` VARCHAR(50) NULL,
    `primary_color` VARCHAR(191) NULL DEFAULT '#667eea',
    `business_location` VARCHAR(255) NULL,
    `phone_number` VARCHAR(20) NULL,
    `website_url` VARCHAR(255) NULL,
    `main_branch_id` VARCHAR(191) NULL,
    `api_requests_this_month` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tenant_subdomain_key`(`subdomain`),
    UNIQUE INDEX `Tenant_owner_email_key`(`owner_email`),
    INDEX `Tenant_subdomain_idx`(`subdomain`),
    INDEX `Tenant_owner_email_idx`(`owner_email`),
    INDEX `Tenant_tier_idx`(`tier`),
    INDEX `Tenant_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TenantSettings` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL DEFAULT '#667eea',
    `secondary_color` VARCHAR(191) NOT NULL DEFAULT '#667eea',
    `logo_url` LONGTEXT NULL,
    `custom_brand_name` VARCHAR(255) NULL,
    `opening_hours` VARCHAR(100) NULL,
    `closing_hours` VARCHAR(100) NULL,
    `contact_email` VARCHAR(255) NULL,
    `contact_phone` VARCHAR(20) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `payment_methods` LONGTEXT NULL,
    `shipping_providers` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TenantSettings_tenant_id_key`(`tenant_id`),
    INDEX `TenantSettings_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantAccount` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `dashboard_user` VARCHAR(255) NOT NULL,
    `dashboard_pass_hash` VARCHAR(255) NOT NULL,
    `login_attempts` INTEGER NOT NULL DEFAULT 0,
    `last_login` DATETIME(3) NULL,
    `is_locked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MerchantAccount_tenant_id_key`(`tenant_id`),
    UNIQUE INDEX `MerchantAccount_dashboard_user_key`(`dashboard_user`),
    INDEX `MerchantAccount_tenant_id_idx`(`tenant_id`),
    INDEX `MerchantAccount_dashboard_user_idx`(`dashboard_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `opening_hours` VARCHAR(100) NULL,
    `closing_hours` VARCHAR(100) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_main_branch` BOOLEAN NOT NULL DEFAULT false,
    `instagram_handle` VARCHAR(100) NULL,
    `facebook_page` VARCHAR(100) NULL,
    `tiktok_handle` VARCHAR(100) NULL,
    `twitter_handle` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Location_tenant_id_idx`(`tenant_id`),
    INDEX `Location_is_main_branch_idx`(`is_main_branch`),
    INDEX `Location_is_active_idx`(`is_active`),
    UNIQUE INDEX `Location_tenant_id_slug_key`(`tenant_id`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `description` LONGTEXT NULL,
    `category` VARCHAR(100) NULL,
    `image_url` LONGTEXT NULL,
    `niche` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `wholesale_price` DOUBLE NULL,
    `b2b_min_quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Product_tenant_id_idx`(`tenant_id`),
    INDEX `Product_category_idx`(`category`),
    INDEX `Product_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `reorder_level` INTEGER NOT NULL DEFAULT 10,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Inventory_location_id_idx`(`location_id`),
    INDEX `Inventory_product_id_idx`(`product_id`),
    UNIQUE INDEX `Inventory_location_id_product_id_key`(`location_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `order_number` VARCHAR(50) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_phone` VARCHAR(20) NULL,
    `customer_name` VARCHAR(255) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `shipping_address` LONGTEXT NULL,
    `shipping_method` VARCHAR(100) NULL,
    `tracking_number` VARCHAR(255) NULL,
    `estimated_delivery` DATETIME(3) NULL,
    `is_b2b` BOOLEAN NOT NULL DEFAULT false,
    `b2b_discount_applied` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_order_number_key`(`order_number`),
    INDEX `Order_tenant_id_idx`(`tenant_id`),
    INDEX `Order_location_id_idx`(`location_id`),
    INDEX `Order_customer_email_idx`(`customer_email`),
    INDEX `Order_status_idx`(`status`),
    INDEX `Order_is_b2b_idx`(`is_b2b`),
    INDEX `Order_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DOUBLE NOT NULL,

    INDEX `OrderItem_order_id_idx`(`order_id`),
    INDEX `OrderItem_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `method_type` VARCHAR(50) NOT NULL,
    `provider_id` VARCHAR(255) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `api_key` VARCHAR(500) NULL,
    `api_secret` VARCHAR(500) NULL,
    `merchant_id` VARCHAR(255) NULL,
    `webhook_secret` VARCHAR(500) NULL,
    `public_key` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `PaymentMethod_tenant_id_idx`(`tenant_id`),
    INDEX `PaymentMethod_is_active_idx`(`is_active`),
    UNIQUE INDEX `PaymentMethod_tenant_id_method_type_key`(`tenant_id`, `method_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentLog` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `payment_method_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `provider` VARCHAR(50) NOT NULL,
    `provider_transaction_id` VARCHAR(255) NULL,
    `checkout_url` LONGTEXT NULL,
    `is_location_payment` BOOLEAN NOT NULL DEFAULT false,
    `additional_locations` INTEGER NOT NULL DEFAULT 0,
    `location_cost_per` DOUBLE NOT NULL DEFAULT 10,
    `refund_reason` VARCHAR(255) NULL,
    `refund_date` DATETIME(3) NULL,
    `refund_amount` DOUBLE NULL,
    `metadata` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentLog_order_id_key`(`order_id`),
    INDEX `PaymentLog_tenant_id_idx`(`tenant_id`),
    INDEX `PaymentLog_order_id_idx`(`order_id`),
    INDEX `PaymentLog_status_idx`(`status`),
    INDEX `PaymentLog_provider_idx`(`provider`),
    INDEX `PaymentLog_is_location_payment_idx`(`is_location_payment`),
    INDEX `PaymentLog_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingConfig` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `base_cost` DOUBLE NOT NULL DEFAULT 0,
    `per_km_cost` DOUBLE NOT NULL DEFAULT 0.5,
    `free_shipping_above` DOUBLE NULL,
    `provider_api_key` VARCHAR(500) NULL,
    `provider_api_secret` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `ShippingConfig_tenant_id_idx`(`tenant_id`),
    INDEX `ShippingConfig_location_id_idx`(`location_id`),
    UNIQUE INDEX `ShippingConfig_tenant_id_location_id_provider_key`(`tenant_id`, `location_id`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingTracking` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `tracking_number` VARCHAR(255) NOT NULL,
    `provider` VARCHAR(100) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `current_location` VARCHAR(255) NULL,
    `last_update` DATETIME(3) NULL,
    `estimated_delivery` DATETIME(3) NULL,
    `tracking_data` LONGTEXT NULL,
    `proof_photo_url` LONGTEXT NULL,
    `signed_by` VARCHAR(255) NULL,
    `delivered_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShippingTracking_order_id_key`(`order_id`),
    UNIQUE INDEX `ShippingTracking_tracking_number_key`(`tracking_number`),
    INDEX `ShippingTracking_order_id_idx`(`order_id`),
    INDEX `ShippingTracking_tracking_number_idx`(`tracking_number`),
    INDEX `ShippingTracking_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyAnalytics` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `week_start` DATETIME(3) NOT NULL,
    `week_end` DATETIME(3) NOT NULL,
    `total_orders` INTEGER NOT NULL DEFAULT 0,
    `total_revenue` DOUBLE NOT NULL DEFAULT 0,
    `total_items_sold` INTEGER NOT NULL DEFAULT 0,
    `avg_order_value` DOUBLE NOT NULL DEFAULT 0,
    `completed_orders` INTEGER NOT NULL DEFAULT 0,
    `pending_orders` INTEGER NOT NULL DEFAULT 0,
    `cancelled_orders` INTEGER NOT NULL DEFAULT 0,
    `unique_customers` INTEGER NOT NULL DEFAULT 0,
    `repeat_customers` INTEGER NOT NULL DEFAULT 0,
    `new_customers` INTEGER NOT NULL DEFAULT 0,
    `b2b_orders` INTEGER NOT NULL DEFAULT 0,
    `b2b_revenue` DOUBLE NOT NULL DEFAULT 0,
    `discounts_given` DOUBLE NOT NULL DEFAULT 0,
    `discount_count` INTEGER NOT NULL DEFAULT 0,
    `top_products` LONGTEXT NULL,
    `daily_breakdown` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `WeeklyAnalytics_tenant_id_idx`(`tenant_id`),
    INDEX `WeeklyAnalytics_location_id_idx`(`location_id`),
    INDEX `WeeklyAnalytics_week_start_idx`(`week_start`),
    UNIQUE INDEX `WeeklyAnalytics_tenant_id_location_id_week_start_key`(`tenant_id`, `location_id`, `week_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `title` VARCHAR(255) NULL,
    `content` LONGTEXT NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `google_review_id` VARCHAR(255) NULL,
    `is_verified_purchase` BOOLEAN NOT NULL DEFAULT false,
    `is_approved` BOOLEAN NOT NULL DEFAULT true,
    `admin_response` LONGTEXT NULL,
    `admin_responded_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Review_tenant_id_idx`(`tenant_id`),
    INDEX `Review_location_id_idx`(`location_id`),
    INDEX `Review_source_idx`(`source`),
    INDEX `Review_rating_idx`(`rating`),
    INDEX `Review_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `google_rating` DOUBLE NULL DEFAULT 0,
    `google_review_count` INTEGER NOT NULL DEFAULT 0,
    `facebook_rating` DOUBLE NULL,
    `facebook_review_count` INTEGER NOT NULL DEFAULT 0,
    `trustpilot_rating` DOUBLE NULL,
    `trustpilot_review_count` INTEGER NOT NULL DEFAULT 0,
    `website_rating` DOUBLE NOT NULL DEFAULT 0,
    `website_review_count` INTEGER NOT NULL DEFAULT 0,
    `overall_rating` DOUBLE NOT NULL DEFAULT 0,
    `last_google_sync` DATETIME(3) NULL,
    `last_facebook_sync` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Rating_tenant_id_idx`(`tenant_id`),
    INDEX `Rating_location_id_idx`(`location_id`),
    UNIQUE INDEX `Rating_tenant_id_location_id_key`(`tenant_id`, `location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialMediaConfig` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `instagram_handle` VARCHAR(100) NULL,
    `instagram_api_key` VARCHAR(500) NULL,
    `instagram_feed_count` INTEGER NOT NULL DEFAULT 0,
    `facebook_page_id` VARCHAR(100) NULL,
    `facebook_api_key` VARCHAR(500) NULL,
    `facebook_pixel_id` VARCHAR(100) NULL,
    `tiktok_handle` VARCHAR(100) NULL,
    `twitter_handle` VARCHAR(100) NULL,
    `linkedin_page` VARCHAR(255) NULL,
    `youtube_channel` VARCHAR(255) NULL,
    `brand_primary_color` VARCHAR(10) NULL,
    `brand_secondary_color` VARCHAR(10) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SocialMediaConfig_tenant_id_key`(`tenant_id`),
    INDEX `SocialMediaConfig_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `B2BDiscount` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_name` VARCHAR(255) NULL,
    `customer_company` VARCHAR(255) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `requested_discount` DOUBLE NOT NULL DEFAULT 0,
    `approved_discount` DOUBLE NULL,
    `min_order_value` DOUBLE NOT NULL DEFAULT 0,
    `admin_notes` LONGTEXT NULL,
    `customer_message` LONGTEXT NULL,
    `is_volume_based` BOOLEAN NOT NULL DEFAULT false,
    `min_quantity` INTEGER NULL,
    `discount_percentage` DOUBLE NOT NULL DEFAULT 0,
    `valid_from` DATETIME(3) NULL,
    `valid_until` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `B2BDiscount_tenant_id_idx`(`tenant_id`),
    INDEX `B2BDiscount_status_idx`(`status`),
    INDEX `B2BDiscount_customer_email_idx`(`customer_email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `action_type` VARCHAR(100) NOT NULL,
    `details` LONGTEXT NULL,
    `ip_address` VARCHAR(50) NULL,
    `user_agent` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_tenant_id_idx`(`tenant_id`),
    INDEX `AuditLog_action_type_idx`(`action_type`),
    INDEX `AuditLog_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecurityIncident` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `attacker_ip` VARCHAR(50) NOT NULL,
    `malicious_payload` LONGTEXT NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'low',
    `incident_type` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mobile_money_network` VARCHAR(50) NULL,
    `mobile_money_number` VARCHAR(50) NULL,

    INDEX `SecurityIncident_tenant_id_idx`(`tenant_id`),
    INDEX `SecurityIncident_severity_idx`(`severity`),
    INDEX `SecurityIncident_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TenantSettings` ADD CONSTRAINT `TenantSettings_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MerchantAccount` ADD CONSTRAINT `MerchantAccount_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentLog` ADD CONSTRAINT `PaymentLog_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentLog` ADD CONSTRAINT `PaymentLog_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentLog` ADD CONSTRAINT `PaymentLog_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `PaymentMethod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingConfig` ADD CONSTRAINT `ShippingConfig_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingConfig` ADD CONSTRAINT `ShippingConfig_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingTracking` ADD CONSTRAINT `ShippingTracking_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAnalytics` ADD CONSTRAINT `WeeklyAnalytics_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAnalytics` ADD CONSTRAINT `WeeklyAnalytics_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SocialMediaConfig` ADD CONSTRAINT `SocialMediaConfig_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `B2BDiscount` ADD CONSTRAINT `B2BDiscount_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecurityIncident` ADD CONSTRAINT `SecurityIncident_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `Tenant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
