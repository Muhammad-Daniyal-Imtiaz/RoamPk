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
  ChefHat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { designationEnum } from "@/db/schema";

export type UserRole =
  | "tourist"
  | "local_user"
  | "admin"
  | "hotel_partner"
  | "hostel_partner"
  | "cafe_partner"
  | "restaurant_partner"
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
  isBusiness: boolean;
  designations?: { value: string; label: string }[];
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
    onboardingFields: ["country", "city", "interests", "visitPurpose", "arrivalDate", "duration", "travelGroup", "accommodation"],
    isBusiness: false,
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
    isBusiness: false,
  },
  {
    id: "hotel_partner",
    label: "Hotel Partner",
    category: "partner",
    description: "List hotels, manage rooms, update availability, and receive booking requests.",
    dashboardPath: "/dashboard/hotel-partner",
    icon: Hotel,
    permissions: ["hotel:create", "hotel:update", "booking:read"],
    onboardingFields: ["businessName", "designation", "ntnOrLicense", "propertyAddress"],
    isBusiness: true,
    designations: [
      { value: "owner", label: "Owner" },
      { value: "general_manager", label: "General Manager" },
      { value: "operations_manager", label: "Operations Manager" },
      { value: "front_desk_manager", label: "Front Desk Manager" },
      { value: "marketing_manager", label: "Marketing Manager" },
      { value: "manager", label: "Manager" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "hostel_partner",
    label: "Hostel Partner",
    category: "partner",
    description: "List budget stays, dorms, backpacker rooms, shared amenities, and city hostels.",
    dashboardPath: "/dashboard/hostel-partner",
    icon: BedDouble,
    permissions: ["hostel:create", "hostel:update", "booking:read"],
    onboardingFields: ["businessName", "designation", "licenseNumber", "bedCapacity"],
    isBusiness: true,
    designations: [
      { value: "owner", label: "Owner" },
      { value: "manager", label: "Manager" },
      { value: "operations_manager", label: "Operations Manager" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "cafe_partner",
    label: "Café Partner",
    category: "partner",
    description: "Publish café locations, menus, Wi-Fi availability, tourist offers, and events.",
    dashboardPath: "/dashboard/cafe-partner",
    icon: Coffee,
    permissions: ["cafe:create", "cafe:update", "offer:create"],
    onboardingFields: ["businessName", "designation", "foodLicense", "menuUrl"],
    isBusiness: true,
    designations: [
      { value: "owner", label: "Owner" },
      { value: "manager", label: "Manager" },
      { value: "head_chef", label: "Head Chef" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "restaurant_partner",
    label: "Restaurant Partner",
    category: "partner",
    description: "List restaurants, menus, dine-in/takeaway options, and receive reservations.",
    dashboardPath: "/dashboard/restaurant-partner",
    icon: ChefHat,
    permissions: ["restaurant:create", "restaurant:update", "reservation:read"],
    onboardingFields: ["businessName", "designation", "foodLicense", "cuisineType"],
    isBusiness: true,
    designations: [
      { value: "owner", label: "Owner" },
      { value: "executive_chef", label: "Executive Chef" },
      { value: "manager", label: "Restaurant Manager" },
      { value: "operations_manager", label: "Operations Manager" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "sim_partner",
    label: "SIM Partner",
    category: "partner",
    description: "Manage tourist SIM pickup points, provider packages, branch stock, and PTA support.",
    dashboardPath: "/dashboard/sim-partner",
    icon: Smartphone,
    permissions: ["sim_package:create", "sim_order:read", "pickup_location:update"],
    onboardingFields: ["providerName", "branchAddress", "designation", "ptaLicense"],
    isBusiness: true,
    designations: [
      { value: "owner", label: "Owner" },
      { value: "manager", label: "Store Manager" },
      { value: "regional_manager", label: "Regional Manager" },
      { value: "other", label: "Other" },
    ],
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
    isBusiness: false,
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
    isBusiness: false,
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
    isBusiness: true,
    designations: [
      { value: "director", label: "Director" },
      { value: "team_lead", label: "Team Lead" },
      { value: "coordinator", label: "Coordinator" },
      { value: "officer", label: "Officer" },
      { value: "other", label: "Other" },
    ],
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
    isBusiness: false,
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
  "restaurant",
  "sim_outlet",
  "tour_guide",
  "food_expert",
  "destination",
  "route",
  "tour_package",
  "tourist_profile",
] as const;

export const getRoleDefinition = (role: UserRole) =>
  roleDefinitions.find((definition) => definition.id === role);

export const can = (role: UserRole, permission: string) => {
  const definition = getRoleDefinition(role);
  return Boolean(definition?.permissions.includes("admin:all") || definition?.permissions.includes(permission));
};

export const pakistanProvinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
] as const;

export const pakistanCities = [
  "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Sukkur",
  "Murree", "Naran", "Hunza", "Skardu", "Gilgit", "Swat",
  "Mardan", "Abbottabad", "Bahawalpur", "Sargodha", "Sheikhupura",
  "Mirpur", "Muzaffarabad", "Gwadar", "Chitral", "Fairy Meadows",
  "Deosai", "Kashmir", "Larkana", "Thatta", "Nawabshah",
] as const;

export const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bhutan", "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti",
  "Egypt", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France",
  "Georgia", "Germany", "Ghana", "Greece",
  "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
  "Malaysia", "Maldives", "Mauritius", "Mexico", "Mongolia", "Morocco", "Myanmar",
  "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway",
  "Oman",
  "Pakistan", "Palestine", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan",
  "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
] as const;
