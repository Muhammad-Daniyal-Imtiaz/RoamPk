import {
  BadgeCheck,
  BedDouble,
  Building2,
  Coffee,
  Hotel,
  LifeBuoy,
  Map,
  Shield,
  Smartphone,
  Utensils,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type UserRole =
  | "tourist"
  | "local_user"
  | "admin"
  | "hotel_partner"
  | "hostel_partner"
  | "cafe_partner"
  | "sim_partner"
  | "tour_guide"
  | "food_expert"
  | "emergency_response";

export type RoleCategory = "traveler" | "partner" | "operator" | "community";

export type RoleDefinition = {
  id: UserRole;
  label: string;
  category: RoleCategory;
  description: string;
  dashboardPath: string;
  icon: LucideIcon;
  permissions: string[];
  onboardingFields: string[];
};

export const roleDefinitions: RoleDefinition[] = [
  {
    id: "tourist",
    label: "Tourist / Traveler",
    category: "traveler",
    description: "Book hotels, follow routes, save destinations, request guides, and manage travel plans.",
    dashboardPath: "/dashboard/tourist",
    icon: Map,
    permissions: ["booking:create", "follow:create", "review:create", "trip:manage"],
    onboardingFields: ["passportCountry", "preferredLanguage", "travelDates"],
  },
  {
    id: "local_user",
    label: "Local User",
    category: "community",
    description: "Follow tourists, hotels, cafés, guides, destinations, routes, and community updates.",
    dashboardPath: "/dashboard/local",
    icon: Users,
    permissions: ["follow:create", "review:create", "post:create"],
    onboardingFields: ["city", "interests"],
  },
  {
    id: "hotel_partner",
    label: "Hotel Partner",
    category: "partner",
    description: "List hotels, manage rooms, update availability, and receive booking requests.",
    dashboardPath: "/dashboard/hotel-partner",
    icon: Hotel,
    permissions: ["hotel:create", "hotel:update", "booking:read"],
    onboardingFields: ["businessName", "ntnOrLicense", "propertyAddress"],
  },
  {
    id: "hostel_partner",
    label: "Hostel Partner",
    category: "partner",
    description: "List budget stays, dorms, backpacker rooms, shared amenities, and city hostels.",
    dashboardPath: "/dashboard/hostel-partner",
    icon: BedDouble,
    permissions: ["hostel:create", "hostel:update", "booking:read"],
    onboardingFields: ["businessName", "licenseNumber", "bedCapacity"],
  },
  {
    id: "cafe_partner",
    label: "Café Partner",
    category: "partner",
    description: "Publish café locations, menus, Wi-Fi availability, tourist offers, and events.",
    dashboardPath: "/dashboard/cafe-partner",
    icon: Coffee,
    permissions: ["cafe:create", "cafe:update", "offer:create"],
    onboardingFields: ["businessName", "foodLicense", "menuUrl"],
  },
  {
    id: "sim_partner",
    label: "SIM Partner",
    category: "partner",
    description: "Manage tourist SIM pickup points, provider packages, branch stock, and PTA support.",
    dashboardPath: "/dashboard/sim-partner",
    icon: Smartphone,
    permissions: ["sim_package:create", "sim_order:read", "pickup_location:update"],
    onboardingFields: ["providerName", "branchAddress", "ptaLicense"],
  },
  {
    id: "tour_guide",
    label: "Tour Guide",
    category: "partner",
    description: "Offer guided tours, language support, route expertise, and custom itineraries.",
    dashboardPath: "/dashboard/tour-guide",
    icon: BadgeCheck,
    permissions: ["guide_profile:update", "tour:create", "booking:read"],
    onboardingFields: ["languages", "destinations", "experienceYears"],
  },
  {
    id: "food_expert",
    label: "Food Expert",
    category: "community",
    description: "Curate food trails, recommend local dishes, review cafés, and host culinary walks.",
    dashboardPath: "/dashboard/food-expert",
    icon: Utensils,
    permissions: ["food_trail:create", "restaurant:review", "recommendation:create"],
    onboardingFields: ["city", "cuisineSpecialty", "portfolioLink"],
  },
  {
    id: "emergency_response",
    label: "Emergency Response Team",
    category: "operator",
    description: "Coordinate tourist emergency alerts, verified contacts, route safety, and response updates.",
    dashboardPath: "/dashboard/emergency",
    icon: LifeBuoy,
    permissions: ["emergency:read", "emergency:update", "safety_alert:create"],
    onboardingFields: ["organizationName", "designation", "verificationId"],
  },
  {
    id: "admin",
    label: "Admin",
    category: "operator",
    description: "Manage platform operations, approvals, content moderation, and partner verification.",
    dashboardPath: "/dashboard/admin",
    icon: Shield,
    permissions: ["admin:all", "role:assign", "partner:verify", "content:moderate"],
    onboardingFields: ["internalAccessCode"],
  },
];

export const roleCategories: Record<RoleCategory, string> = {
  traveler: "Traveler",
  partner: "Partner",
  operator: "Operations",
  community: "Community",
};

export const followTargetTypes = [
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

export const tursoSchemaPreview = `users
- id
- clerk_user_id
- display_name
- email
- active_role
- created_at

user_roles
- id
- user_id
- role
- status

follows
- id
- follower_user_id
- target_type
- target_id
- created_at

partner_profiles
- id
- user_id
- role
- business_name
- verification_status
- metadata_json`;

export const getRoleDefinition = (role: UserRole) =>
  roleDefinitions.find((definition) => definition.id === role);

export const can = (role: UserRole, permission: string) => {
  const definition = getRoleDefinition(role);
  return Boolean(definition?.permissions.includes("admin:all") || definition?.permissions.includes(permission));
};
