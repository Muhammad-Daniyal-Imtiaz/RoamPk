CREATE TABLE `international_tourist_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`coming_to_pakistan` integer DEFAULT true NOT NULL,
	`visit_purpose` text,
	`arrival_date` text,
	`duration_days` integer,
	`cities_to_visit_json` text DEFAULT '[]' NOT NULL,
	`travel_group` text,
	`group_size` integer,
	`accommodation_preference` text,
	`accommodation_budget` integer,
	`home_city` text,
	`bio` text,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `international_tourist_profiles_user_id_unique` ON `international_tourist_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `local_tourist_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`city` text,
	`province` text,
	`visit_purpose` text,
	`arrival_date` text,
	`duration_days` integer,
	`cities_to_visit_json` text DEFAULT '[]' NOT NULL,
	`travel_group` text,
	`group_size` integer,
	`accommodation_preference` text,
	`accommodation_budget` integer,
	`bio` text,
	`created_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	`updated_at` text DEFAULT '(cast(strftime(''%s'',''now'') as text))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `local_tourist_profiles_user_id_unique` ON `local_tourist_profiles` (`user_id`);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `city` text;--> statement-breakpoint
ALTER TABLE `users` ADD `province` text;