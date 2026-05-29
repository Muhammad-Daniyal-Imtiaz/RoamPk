CREATE TABLE `cafes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text,
	`cuisine` text,
	`wifi_available` integer DEFAULT false NOT NULL,
	`tourist_friendly` integer DEFAULT true NOT NULL,
	`menu_url` text,
	`rating` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `cafes_city_idx` ON `cafes` (`city`);--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`city` text,
	`province` text,
	`description` text,
	`image_url` text,
	`rating` real DEFAULT 0 NOT NULL,
	`starting_price` integer DEFAULT 0 NOT NULL,
	`best_time` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE TABLE `emergency_teams` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`organization_name` text NOT NULL,
	`city` text NOT NULL,
	`phone` text NOT NULL,
	`service_type` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` text PRIMARY KEY NOT NULL,
	`follower_user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`follower_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `follows_follower_target_idx` ON `follows` (`follower_user_id`,`target_type`,`target_id`);--> statement-breakpoint
CREATE TABLE `food_expert_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`city` text NOT NULL,
	`cuisine_specialty` text NOT NULL,
	`portfolio_url` text,
	`rating` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partner_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`business_name` text NOT NULL,
	`contact_phone` text,
	`city` text,
	`address` text,
	`verification_status` text DEFAULT 'draft' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `partner_profiles_user_id_role_idx` ON `partner_profiles` (`user_id`,`role`);--> statement-breakpoint
CREATE INDEX `partner_profiles_verification_status_idx` ON `partner_profiles` (`verification_status`);--> statement-breakpoint
CREATE TABLE `sim_outlets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`provider` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`pickup_available` integer DEFAULT true NOT NULL,
	`hours` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `sim_outlets_provider_city_idx` ON `sim_outlets` (`provider`,`city`);--> statement-breakpoint
CREATE TABLE `stays` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text,
	`description` text,
	`price_per_night` integer NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`amenities_json` text DEFAULT '[]' NOT NULL,
	`images_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `stays_type_city_idx` ON `stays` (`type`,`city`);--> statement-breakpoint
CREATE TABLE `tour_guide_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`destinations_json` text DEFAULT '[]' NOT NULL,
	`languages_json` text DEFAULT '[]' NOT NULL,
	`experience_years` integer DEFAULT 0 NOT NULL,
	`day_rate` integer DEFAULT 0 NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`assigned_by_user_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_roles_user_id_role_idx` ON `user_roles` (`user_id`,`role`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_user_id` text NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`image_url` text,
	`active_role` text DEFAULT 'tourist' NOT NULL,
	`onboarding_complete` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_user_id_idx` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);