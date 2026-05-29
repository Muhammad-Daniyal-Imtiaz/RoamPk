import { relations, sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { UserRole } from "@/lib/roles";

export const roleEnum = [
  "tourist",
  "local_user",
  "admin",
  "hotel_partner",
  "hostel_partner",
  "cafe_partner",
  "sim_partner",
  "tour_guide",
  "food_expert",
  "emergency_response",
] as const satisfies readonly UserRole[];

export const roleStatusEnum = ["pending", "active", "suspended", "rejected"] as const;
export const verificationStatusEnum = ["draft", "pending", "verified", "rejected"] as const;
export const followTargetEnum = [
  "tourist",
  "local_user",
  "hotel",
  "hostel",
  "cafe",
  "sim_outlet",
  "tour_guide",
  "food_expert",
  "destination",
  "route",
  "tour_package",
] as const;

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    imageUrl: text("image_url"),
    activeRole: text("active_role", { enum: roleEnum }).notNull().default("tourist"),
    onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => ({
    clerkUserIdIdx: uniqueIndex("users_clerk_user_id_idx").on(table.clerkUserId),
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const userRoles = sqliteTable(
  "user_roles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: roleEnum }).notNull(),
    status: text("status", { enum: roleStatusEnum }).notNull().default("pending"),
    assignedByUserId: text("assigned_by_user_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => ({
    userRoleIdx: uniqueIndex("user_roles_user_id_role_idx").on(table.userId, table.role),
  }),
);

export const partnerProfiles = sqliteTable(
  "partner_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: roleEnum }).notNull(),
    businessName: text("business_name").notNull(),
    contactPhone: text("contact_phone"),
    city: text("city"),
    address: text("address"),
    verificationStatus: text("verification_status", { enum: verificationStatusEnum }).notNull().default("draft"),
    metadataJson: text("metadata_json", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (table) => ({
    partnerUserRoleIdx: uniqueIndex("partner_profiles_user_id_role_idx").on(table.userId, table.role),
    partnerStatusIdx: index("partner_profiles_verification_status_idx").on(table.verificationStatus),
  }),
);

export const follows = sqliteTable(
  "follows",
  {
    id: text("id").primaryKey(),
    followerUserId: text("follower_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    targetType: text("target_type", { enum: followTargetEnum }).notNull(),
    targetId: text("target_id").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    followerTargetIdx: uniqueIndex("follows_follower_target_idx").on(table.followerUserId, table.targetType, table.targetId),
  }),
);

export const destinations = sqliteTable("destinations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city"),
  province: text("province"),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: real("rating").notNull().default(0),
  startingPrice: integer("starting_price").notNull().default(0),
  bestTime: text("best_time"),
  ...timestamps,
});

export const stays = sqliteTable(
  "stays",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    type: text("type", { enum: ["hotel", "hostel"] }).notNull(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    address: text("address"),
    description: text("description"),
    pricePerNight: integer("price_per_night").notNull(),
    rating: real("rating").notNull().default(0),
    amenitiesJson: text("amenities_json", { mode: "json" }).$type<string[]>().notNull().default([]),
    imagesJson: text("images_json", { mode: "json" }).$type<string[]>().notNull().default([]),
    ...timestamps,
  },
  (table) => ({
    staysTypeCityIdx: index("stays_type_city_idx").on(table.type, table.city),
  }),
);

export const cafes = sqliteTable(
  "cafes",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    city: text("city").notNull(),
    address: text("address"),
    cuisine: text("cuisine"),
    wifiAvailable: integer("wifi_available", { mode: "boolean" }).notNull().default(false),
    touristFriendly: integer("tourist_friendly", { mode: "boolean" }).notNull().default(true),
    menuUrl: text("menu_url"),
    rating: real("rating").notNull().default(0),
    ...timestamps,
  },
  (table) => ({
    cafesCityIdx: index("cafes_city_idx").on(table.city),
  }),
);

export const simOutlets = sqliteTable(
  "sim_outlets",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    provider: text("provider").notNull(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    address: text("address").notNull(),
    pickupAvailable: integer("pickup_available", { mode: "boolean" }).notNull().default(true),
    hours: text("hours"),
    ...timestamps,
  },
  (table) => ({
    simProviderCityIdx: index("sim_outlets_provider_city_idx").on(table.provider, table.city),
  }),
);

export const tourGuideProfiles = sqliteTable("tour_guide_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  destinationsJson: text("destinations_json", { mode: "json" }).$type<string[]>().notNull().default([]),
  languagesJson: text("languages_json", { mode: "json" }).$type<string[]>().notNull().default([]),
  experienceYears: integer("experience_years").notNull().default(0),
  dayRate: integer("day_rate").notNull().default(0),
  rating: real("rating").notNull().default(0),
  ...timestamps,
});

export const foodExpertProfiles = sqliteTable("food_expert_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  city: text("city").notNull(),
  cuisineSpecialty: text("cuisine_specialty").notNull(),
  portfolioUrl: text("portfolio_url"),
  rating: real("rating").notNull().default(0),
  ...timestamps,
});

export const emergencyTeams = sqliteTable("emergency_teams", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  organizationName: text("organization_name").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  partnerProfiles: many(partnerProfiles),
  follows: many(follows),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const partnerProfilesRelations = relations(partnerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [partnerProfiles.userId],
    references: [users.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  user: one(users, {
    fields: [follows.followerUserId],
    references: [users.id],
  }),
}));
