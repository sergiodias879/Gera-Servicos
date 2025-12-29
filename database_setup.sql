-- CleanPro Database Setup
-- Execute este arquivo no painel de controle do InfinityFree (phpMyAdmin)
-- Database: ifo_40788079_db_servicos

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_openId` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20),
  `email` varchar(320),
  `address` text,
  `cpfCnpj` varchar(20),
  `notes` text,
  `isActive` int NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `clientId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `address` text NOT NULL,
  `status` enum('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `scheduledDate` timestamp NULL,
  `scheduledTime` varchar(5),
  `completedAt` timestamp NULL,
  `value` int,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_clientId` (`clientId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_scheduledDate` (`scheduledDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orderItems
CREATE TABLE IF NOT EXISTS `orderItems` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `orderId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `isCompleted` int NOT NULL DEFAULT 0,
  `order` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: schedules
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `orderId` int,
  `title` varchar(255) NOT NULL,
  `description` text,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NULL,
  `location` text,
  `type` enum('service', 'meeting', 'break', 'other') NOT NULL DEFAULT 'service',
  `reminderMinutes` int DEFAULT 15,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_orderId` (`orderId`),
  INDEX `idx_startDate` (`startDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample user for testing
INSERT INTO `users` (`openId`, `name`, `email`, `loginMethod`, `role`) 
VALUES ('test-user-001', 'João Silva', 'joao@cleanpro.com', 'oauth', 'admin')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `email`=VALUES(`email`);

-- Insert sample clients
INSERT INTO `clients` (`userId`, `name`, `phone`, `email`, `address`, `cpfCnpj`, `isActive`) 
VALUES 
(1, 'João Silva', '11999312379', 'joao@example.com', 'Rua A, 123', '12345678901', 1),
(1, 'Maria Santos', '11987654321', 'maria@example.com', 'Rua B, 456', '98765432101', 1),
(1, 'Pedro Costa', '11912345678', 'pedro@example.com', 'Rua C, 789', '55555555501', 1)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Insert sample orders
INSERT INTO `orders` (`userId`, `clientId`, `title`, `description`, `address`, `status`, `scheduledDate`, `scheduledTime`, `value`) 
VALUES 
(1, 1, 'Limpeza Residencial', 'Limpeza completa da casa', 'Rua A, 123', 'in_progress', NOW(), '10:00', 15000),
(1, 2, 'Limpeza de Escritório', 'Limpeza do escritório', 'Rua B, 456', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), '14:00', 20000),
(1, 3, 'Limpeza Pós-Obra', 'Limpeza após reforma', 'Rua C, 789', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY), '16:00', 18000)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Insert sample schedules
INSERT INTO `schedules` (`userId`, `orderId`, `title`, `description`, `startDate`, `endDate`, `location`, `type`) 
VALUES 
(1, 1, 'Limpeza Residencial', 'Limpeza completa da casa', NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 'Rua A, 123', 'service'),
(1, 2, 'Limpeza de Escritório', 'Limpeza do escritório', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY 2 HOUR), 'Rua B, 456', 'service'),
(1, 3, 'Reunião de Planejamento', 'Reunião com cliente', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY 1 HOUR), 'Escritório', 'meeting')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);
