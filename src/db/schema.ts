import { relations } from "drizzle-orm";
import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { UserRole } from "@/lib/roles";

export const roleEnum = [
  "tourist",
  "local_user",
  "admin",
  "hotel_partner",
  "hostel_partner",
  "cafe_partner",
  "restaurant_partner",
  "sim_partner",
  "tour_guide",
  "food_expert",
  "emergency_response",
] as const satisfies readonly UserRole[];

export const roleStatusEnum = ["pending", "active", "suspended", "rejected"] as const;
export const verificationStatusEnum = ["draft", "pending", "verified", "rejected"] as const;
export const designationEnum = [
  "owner",
  "manager",
  "ceo",
  "general_manager",
  "operations_manager",
  "executive_chef",
  "head_chef",
  "front_desk_manager",
  "marketing_manager",
  "regional_manager",
  "team_lead",
  "coordinator",
  "director",
  "officer",
  "other",
] as const;

export const proofTypeEnum = ["cnic", "business_license", "passport", "other"] as const;

export const followTargetEnum = [
  "tourist",
  "local_user",
  "hotel",
  "hostel",
  "cafe",
  "restaurant",
  "sim_outlet",
  "tour_guide",
  "food_expert",
  "destination",
  "route",
  "tour_package",
  "tourist_profile",
] as const;

const timestamps = {
  createdAt: text("created_at").notNull().default("(cast(strftime('%s','now') as text))"),
  updatedAt: text("updated_at").notNull().default("(cast(strftime('%s','now') as text))"),
};

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: text("email_verified"),
    password: text("password"),
    image: text("image"),
    bio: text("bio"),
    city: text("city"),
    province: text("province"),
    activeRole: text("active_role", { enum: roleEnum }).notNull().default("tourist"),
    onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => ({
    compositePk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
);

export const sessions = sqliteTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
);

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    compositePk: primaryKey({ columns: [table.identifier, table.token] }),
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
    designation: text("designation", { enum: designationEnum }),
    designationOther: text("designation_other"),
    contactPhone: text("contact_phone"),
    city: text("city"),
    address: text("address"),
    province: text("province"),
    area: text("area"),
    about: text("about"),
    isBusiness: integer("is_business", { mode: "boolean" }).notNull().default(true),
    website: text("website"),
    proofImageUrl: text("proof_image_url"),
    proofType: text("proof_type", { enum: proofTypeEnum }),
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
    createdAt: text("created_at").notNull().default("(cast(strftime('%s','now') as text))"),
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

export const restaurants = sqliteTable(
  "restaurants",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    city: text("city").notNull(),
    address: text("address"),
    cuisine: text("cuisine"),
    priceRange: text("price_range"),
    dineIn: integer("dine_in", { mode: "boolean" }).notNull().default(true),
    takeaway: integer("takeaway", { mode: "boolean" }).notNull().default(false),
    delivery: integer("delivery", { mode: "boolean" }).notNull().default(false),
    wifiAvailable: integer("wifi_available", { mode: "boolean" }).notNull().default(false),
    menuUrl: text("menu_url"),
    rating: real("rating").notNull().default(0),
    imagesJson: text("images_json", { mode: "json" }).$type<string[]>().notNull().default([]),
    ...timestamps,
  },
  (table) => ({
    restaurantsCityIdx: index("restaurants_city_idx").on(table.city),
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

export const touristProfiles = sqliteTable("tourist_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  country: text("country").notNull().default("Pakistan"),
  city: text("city"),
  province: text("province"),
  isInternational: integer("is_international", { mode: "boolean" }).notNull().default(false),
  comingToPakistan: integer("coming_to_pakistan", { mode: "boolean" }).notNull().default(true),
  visitPurpose: text("visit_purpose"),
  arrivalDate: text("arrival_date"),
  durationDays: integer("duration_days"),
  citiesToVisitJson: text("cities_to_visit_json", { mode: "json" }).$type<string[]>().notNull().default([]),
  travelGroup: text("travel_group"),
  groupSize: integer("group_size"),
  accommodationPreference: text("accommodation_preference"),
  accommodationBudget: integer("accommodation_budget"),
  interestsJson: text("interests_json", { mode: "json" }).$type<string[]>().notNull().default([]),
  bio: text("bio"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  partnerProfiles: many(partnerProfiles),
  follows: many(follows),
  touristProfiles: many(touristProfiles),
}));

export const touristProfilesRelations = relations(touristProfiles, ({ one }) => ({
  user: one(users, {
    fields: [touristProfiles.userId],
    references: [users.id],
  }),
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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
