CREATE TABLE `accounts` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` text PRIMARY KEY NOT NULL,
	`follower_user_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partner_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`business_name` text NOT NULL,
	`designation` text,
	`designation_other` text,
	`contact_phone` text,
	`city` text,
	`address` text,
	`province` text,
	`area` text,
	`about` text,
	`is_business` integer DEFAULT true NOT NULL,
	`website` text,
	`proof_image_url` text,
	`proof_type` text,
	`verification_status` text DEFAULT 'draft' NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `partner_profiles_user_id_role_idx` ON `partner_profiles` (`user_id`,`role`);--> statement-breakpoint
CREATE INDEX `partner_profiles_verification_status_idx` ON `partner_profiles` (`verification_status`);--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text,
	`cuisine` text,
	`price_range` text,
	`dine_in` integer DEFAULT true NOT NULL,
	`takeaway` integer DEFAULT false NOT NULL,
	`delivery` integer DEFAULT false NOT NULL,
	`wifi_available` integer DEFAULT false NOT NULL,
	`menu_url` text,
	`rating` real DEFAULT 0 NOT NULL,
	`images_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `restaurants_city_idx` ON `restaurants` (`city`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sim_outlets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text,
	`provider` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`pickup_available` integer DEFAULT true NOT NULL,
	`hours` text,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
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
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`assigned_by_user_id` text,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_roles_user_id_role_idx` ON `user_roles` (`user_id`,`role`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` text,
	`password` text,
	`image` text,
	`active_role` text DEFAULT 'tourist' NOT NULL,
	`onboarding_complete` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
