CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`address` text,
	`cpfCnpj` varchar(20),
	`notes` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`isCompleted` int NOT NULL DEFAULT 0,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`scheduledDate` timestamp,
	`scheduledTime` varchar(5),
	`completedAt` timestamp,
	`value` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`location` text,
	`type` enum('service','meeting','break','other') NOT NULL DEFAULT 'service',
	`reminderMinutes` int DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
