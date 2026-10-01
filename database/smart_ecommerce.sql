-- =====================================================================
-- SMART E-COMMERCE PRODUCT COMPARISON WEBSITE
-- BSCS Final Year Project (Session 2023-2027)
-- Complete Relational MySQL Database Schema & Seed Data
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `smart_ecommerce`;
CREATE DATABASE `smart_ecommerce` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_ecommerce`;

-- ---------------------------------------------------------------------
-- Table: roles
-- ---------------------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'super_admin', 'Full system access and controls'),
(2, 'admin', 'Catalog, product, and message management'),
(3, 'user', 'Regular registered shopper');

-- ---------------------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL DEFAULT 3,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `plan` ENUM('free', 'basic', 'premium') DEFAULT 'free',
  `avatar_url` VARCHAR(255) NULL,
  `status` ENUM('active', 'suspended', 'pending') DEFAULT 'active',
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Default password is 'Admin@123' and 'User@123' (PHP password_hash BCRYPT format)
INSERT INTO `users` (`id`, `role_id`, `name`, `email`, `password_hash`, `plan`) VALUES
(1, 1, 'System Administrator', 'admin@smartcompare.com', '$2y$10$w1qE1vH7k7Jvj2c.N360.eZ4b1tVlWc1s4eGv.Lw1e8ZqH2e8uJWy', 'premium'),
(2, 3, 'Ali Khan (Shopper)', 'user@smartcompare.com', '$2y$10$w1qE1vH7k7Jvj2c.N360.eZ4b1tVlWc1s4eGv.Lw1e8ZqH2e8uJWy', 'basic');

-- ---------------------------------------------------------------------
-- Table: categories
-- ---------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icon` VARCHAR(50) DEFAULT 'package',
  `benchmark_price` DECIMAL(10,2) DEFAULT 500.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `benchmark_price`) VALUES
(1, 'Smartphones', 'smartphones', 'smartphone', 800.00),
(2, 'Laptops', 'laptops', 'laptop', 1200.00),
(3, 'Headphones', 'headphones', 'headphones', 250.00),
(4, 'Smart Watches', 'smart-watches', 'watch', 400.00),
(5, 'Gaming & Accessories', 'gaming-accessories', 'gamepad-2', 150.00),
(6, 'Cameras', 'cameras', 'camera', 1800.00);

-- ---------------------------------------------------------------------
-- Table: platforms / product_sources
-- ---------------------------------------------------------------------
CREATE TABLE `product_sources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `domain` VARCHAR(100) NOT NULL,
  `api_endpoint` VARCHAR(255) NULL,
  `trust_score` DECIMAL(3,1) DEFAULT 4.8,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `product_sources` (`id`, `name`, `domain`, `trust_score`) VALUES
(1, 'Amazon', 'amazon.com', 4.9),
(2, 'eBay', 'ebay.com', 4.7),
(3, 'Shopify Store', 'shopify.com', 4.6),
(4, 'BestBuy', 'bestbuy.com', 4.8),
(5, 'Walmart', 'walmart.com', 4.7);

-- ---------------------------------------------------------------------
-- Table: products
-- ---------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(100) UNIQUE NOT NULL,
  `category_id` INT NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `primary_image` VARCHAR(255) NOT NULL,
  `lowest_price` DECIMAL(10,2) NOT NULL,
  `highest_price` DECIMAL(10,2) NOT NULL,
  `average_rating` DECIMAL(3,2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `smart_score` INT DEFAULT 75,
  `smart_reason` TEXT NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `products` (`id`, `sku`, `category_id`, `brand`, `title`, `description`, `primary_image`, `lowest_price`, `highest_price`, `average_rating`, `total_reviews`, `smart_score`, `smart_reason`, `is_featured`) VALUES
(1, 'APPLE-IPHONE-16-PRO', 1, 'Apple', 'Apple iPhone 16 Pro (128GB, Natural Titanium)', 'Grade 5 titanium design, A18 Pro chip, 48MP Fusion camera system.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 969.00, 999.00, 4.80, 3420, 93, 'Lowest price on eBay with top customer ratings and free shipping.', 1),
(2, 'SAMSUNG-S25-ULTRA', 1, 'Samsung', 'Samsung Galaxy S25 Ultra 5G (256GB, Titanium Black)', 'Snapdragon 8 Elite, 200MP Quad Telephoto camera, integrated S Pen.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80', 1149.00, 1299.99, 4.70, 2890, 91, '12% discount active on eBay outlet with Galaxy AI suite included.', 1),
(3, 'APPLE-MACBOOK-PRO-M4', 2, 'Apple', 'Apple MacBook Pro 14-inch (M4 Chip, 16GB RAM, 512GB SSD)', 'Pro speeds, Liquid Retina XDR display, 24-hour battery life.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 1449.00, 1599.00, 4.90, 1820, 96, 'Highest customer satisfaction rating of 4.9/5 stars. Best deal on Best Buy.', 1),
(4, 'DELL-XPS-14', 2, 'Dell', 'Dell XPS 14 (Intel Core Ultra 7, 32GB RAM, 1TB SSD)', 'CNC aluminum design with invisible haptic glass touchpad, 3.2K OLED.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', 1699.00, 1899.99, 4.50, 940, 84, 'Solid Windows workstation deal saving $200 on eBay direct store.', 0),
(5, 'SONY-WH-1000XM5', 3, 'Sony', 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'Industry-leading noise canceling with two processors and 8 microphones.', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', 328.00, 399.99, 4.80, 8750, 94, 'Massive 18% price drop on Amazon Prime with 8,750+ verified reviews.', 1),
(6, 'APPLE-WATCH-ULTRA-2', 4, 'Apple', 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)', '3000-nit display, dual-frequency precision GPS, Action button.', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80', 739.00, 799.00, 4.80, 2410, 88, 'Great durability score with free expedited shipping.', 0);

-- ---------------------------------------------------------------------
-- Table: product_prices (Multi-store prices)
-- ---------------------------------------------------------------------
CREATE TABLE `product_prices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `source_id` INT NOT NULL,
  `store_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NOT NULL,
  `discount_percent` DECIMAL(5,2) DEFAULT 0.00,
  `product_url` TEXT NOT NULL,
  `in_stock` BOOLEAN DEFAULT TRUE,
  `shipping_cost` DECIMAL(10,2) DEFAULT 0.00,
  `shipping_text` VARCHAR(100) DEFAULT 'Free Shipping',
  `store_rating` DECIMAL(3,2) DEFAULT 4.8,
  `store_reviews_count` INT DEFAULT 100,
  `badge` VARCHAR(50) NULL,
  `last_checked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`source_id`) REFERENCES `product_sources`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO `product_prices` (`product_id`, `source_id`, `store_name`, `price`, `original_price`, `discount_percent`, `product_url`, `in_stock`, `shipping_cost`, `shipping_text`, `badge`) VALUES
(1, 1, 'Apple Authorized Store (Amazon)', 999.00, 999.00, 0.00, 'https://www.amazon.com/dp/B0DGH7P89X', 1, 0.00, 'Free Prime Delivery', 'Official'),
(1, 2, 'TechDirect Official (eBay)', 969.00, 999.00, 3.00, 'https://www.ebay.com/itm/386123456789', 1, 0.00, 'Free 2-Day FedEx', 'Lowest Price'),
(1, 3, 'ElectroHub Shopify Direct', 985.00, 999.00, 1.40, 'https://electrohub.myshopify.com/products/iphone-16-pro', 1, 9.99, '$9.99 Standard', NULL),
(2, 1, 'Samsung Store (Amazon)', 1199.99, 1299.99, 8.00, 'https://www.amazon.com/dp/B0DGS25ULT', 1, 0.00, 'Free 1-Day Prime', 'Amazon Choice'),
(2, 2, 'AllStarCellular (eBay)', 1149.00, 1299.99, 12.00, 'https://www.ebay.com/itm/195827364829', 1, 0.00, 'Free Shipping', 'Lowest Price'),
(3, 4, 'Best Buy Electronics', 1449.00, 1599.00, 9.00, 'https://www.bestbuy.com/site/apple-macbook-pro-14-m4', 1, 0.00, 'Free 2-Day Shipping', 'Lowest Price'),
(3, 1, 'Amazon Retail', 1499.00, 1599.00, 6.00, 'https://www.amazon.com/dp/B0DGM4PRO', 1, 0.00, 'Free Prime Shipping', 'Best Seller'),
(5, 1, 'Amazon Electronics', 328.00, 399.99, 18.00, 'https://www.amazon.com/dp/B09XS7JWHH', 1, 0.00, 'Free Same-Day Prime', 'Best Deal'),
(5, 2, 'ProAudio Outlet (eBay)', 334.99, 399.99, 16.00, 'https://www.ebay.com/itm/284910283749', 1, 0.00, 'Free Standard', NULL);

-- ---------------------------------------------------------------------
-- Table: product_specifications
-- ---------------------------------------------------------------------
CREATE TABLE `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `spec_name` VARCHAR(100) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `product_specifications` (`product_id`, `spec_name`, `spec_value`) VALUES
(1, 'Display', '6.3-inch Super Retina XDR OLED, 120Hz'),
(1, 'Processor', 'Apple A18 Pro (3nm architecture)'),
(1, 'Rear Camera', '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto'),
(1, 'Storage', '128GB NVMe'),
(2, 'Display', '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits'),
(2, 'Processor', 'Snapdragon 8 Elite for Galaxy'),
(2, 'Rear Camera', '200MP Main + 50MP 5x + 50MP UW + 10MP 3x'),
(2, 'Storage', '256GB UFS 4.0'),
(3, 'Display', '14.2-inch Liquid Retina XDR (3024 x 1964)'),
(3, 'Processor', 'Apple M4 chip (10-core CPU, 10-core GPU)'),
(3, 'RAM', '16GB unified memory'),
(3, 'Storage', '512GB SSD');

-- ---------------------------------------------------------------------
-- Table: comparisons
-- ---------------------------------------------------------------------
CREATE TABLE `comparisons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `comparison_code` VARCHAR(50) UNIQUE NOT NULL,
  `product_ids` JSON NOT NULL,
  `winner_product_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`winner_product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: favorites / saved_products
-- ---------------------------------------------------------------------
CREATE TABLE `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product_unique` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `favorites` (`user_id`, `product_id`) VALUES
(1, 1),
(1, 3),
(2, 5);

-- ---------------------------------------------------------------------
-- Table: price_tracking (User Price Alerts)
-- ---------------------------------------------------------------------
CREATE TABLE `price_tracking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `target_price` DECIMAL(10,2) NOT NULL,
  `initial_price` DECIMAL(10,2) NOT NULL,
  `is_triggered` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `price_tracking` (`user_id`, `product_id`, `target_price`, `initial_price`, `is_active`) VALUES
(1, 1, 950.00, 969.00, 1),
(2, 5, 300.00, 328.00, 1);

-- ---------------------------------------------------------------------
-- Table: search_history
-- ---------------------------------------------------------------------
CREATE TABLE `search_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `query` VARCHAR(255) NOT NULL,
  `results_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: notifications
-- ---------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('price_drop', 'deal_alert', 'system', 'comparison') DEFAULT 'system',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
(1, 'Price Drop Detected!', 'Sony WH-1000XM5 fell by 18% on Amazon to $328.00.', 'price_drop', 0),
(1, 'Welcome to Smart Compare', 'Your account is ready. Discover deals across 500+ integrated stores.', 'system', 1);

-- ---------------------------------------------------------------------
-- Table: contact_messages
-- ---------------------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `contact_messages` (`name`, `email`, `subject`, `message`) VALUES
('Prof. Qasim Siddiqui', 'qasim.cs@fast.edu.pk', 'FYP Presentation Demonstration', 'Please ensure the side-by-side spec differential and Smart Score breakdown are highlighted in your final viva slides.');

-- ---------------------------------------------------------------------
-- Table: chatbot_messages
-- ---------------------------------------------------------------------
CREATE TABLE `chatbot_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_query` TEXT NOT NULL,
  `bot_response` TEXT NOT NULL,
  `matched_product_ids` JSON NULL,
  `engine_used` VARCHAR(50) DEFAULT 'Gemini 3.8 Flash',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: subscriptions & payments
-- ---------------------------------------------------------------------
CREATE TABLE `subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_name` ENUM('free', 'basic', 'premium') NOT NULL,
  `monthly_price` DECIMAL(10,2) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('active', 'canceled', 'expired') DEFAULT 'active',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_code` VARCHAR(100) UNIQUE NOT NULL,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_gateway` VARCHAR(50) DEFAULT 'Stripe Sandbox',
  `payment_method` VARCHAR(100) NOT NULL,
  `status` ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
-- End of SQL schema
