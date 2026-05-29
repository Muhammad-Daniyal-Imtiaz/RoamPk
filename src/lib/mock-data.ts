export const heroImages = {
  hunza: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=2200&q=85",
  sim: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1600&q=85",
  currency: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1600&q=85",
  tours: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
  map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1800&q=85",
};

export const hotels = Array.from({ length: 12 }, (_, index) => {
  const names = [
    "Pearl Continental Islamabad",
    "Serena Hunza Retreat",
    "Avari Towers Karachi",
    "Nishat Hotel Lahore",
    "Shangrila Resort Skardu",
    "Luxus Grand Lahore",
    "Ramada Islamabad",
    "Beach Luxury Karachi",
    "Arcadian Riverside Naran",
    "Gilgit Gateway Hotel",
    "Movenpick Karachi",
    "Islamabad Marriott",
  ];
  const cities = ["Islamabad, Sector F-7", "Hunza, Karimabad", "Karachi, Club Road", "Lahore, Gulberg", "Skardu, Lower Kachura", "Lahore, Mall Road"];
  return {
    id: index + 1,
    name: names[index],
    location: cities[index % cities.length],
    price: 6500 + index * 1450,
    rating: Number((4.3 + (index % 6) * 0.1).toFixed(1)),
    reviews: 75 + index * 17,
    amenities: ["WiFi", "Parking", index % 2 ? "Restaurant" : "Pool", "Gym"],
    description:
      "A polished stay with warm Pakistani hospitality, premium rooms, reliable service, and easy access to top attractions, markets, restaurants, and transport links.",
    images: [
      `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
      `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
      `https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
    ],
  };
});

export const simPackages = [
  { provider: "Jazz", package: "Tourist 6GB Weekly", details: "6GB data + 600 mins + 100 SMS", price: 60, coverage: "60% market share, best network" },
  { provider: "Telenor", package: "Tourist Monthly", details: "10GB data + unlimited on-net", price: 1499, coverage: "Good northern areas coverage" },
  { provider: "Zong", package: "5G Tourist Unlimited", details: "Unlimited 5G data", price: 2499, coverage: "Fastest 5G, urban areas" },
];

export const currencyRates = {
  USD: { buy: 278.5, sell: 280 },
  EUR: { buy: 302, sell: 304.5 },
  GBP: { buy: 351, sell: 353.5 },
  CNY: { buy: 38.5, sell: 39 },
  lastUpdated: "2026-05-28T15:30:00Z",
};

export const exchangeCompanies = [
  { name: "Link International Exchange", rating: 4.8, reviews: 120, branches: "75+ locations nationwide", features: "FATF compliant, Best rate guarantee" },
  { name: "HBL Currency Exchange", rating: 4.6, reviews: 85, branches: "9 branches (Karachi, Lahore, Islamabad)", features: "Western Union partner, Bank-backed" },
  { name: "ZeeQue Exchange", rating: 4.9, reviews: 95, branches: "Multiple branches", features: "Modern app-based, Competitive rates" },
];

export const tourPackages = Array.from({ length: 9 }, (_, index) => {
  const names = ["7-Day Hunza Adventure", "Skardu Lakes Escape", "Lahore Heritage Walk", "Naran Kaghan Alpine Tour", "Karachi Food & Coast", "Islamabad Margalla Weekend", "Fairy Meadows Trek", "Kashmir Valley Retreat", "Sindh Sufi Trail"];
  const locations = ["Hunza Valley, Gilgit-Baltistan", "Skardu, Gilgit-Baltistan", "Lahore, Punjab", "Naran Kaghan", "Karachi, Sindh", "Islamabad", "Diamer", "Azad Kashmir", "Sehwan & Bhit Shah"];
  return {
    id: index + 1,
    name: names[index],
    location: locations[index],
    price: 22000 + index * 6500,
    duration: index % 3 === 0 ? "7 days / 6 nights" : index % 3 === 1 ? "5 days / 4 nights" : "3 days / 2 nights",
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    reviews: 35 + index * 8,
    inclusions: ["Hotel", "Meals", "Transport", "Guide"],
    images: [
      `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
      `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
      `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80&sig=${index}`,
    ],
  };
});

export const tourGuides = [
  { id: 1, name: "Ali Khan", destination: "Hunza, Skardu, Naran", languages: ["English", "Urdu", "Arabic"], experience: "8 years, 200+ tourists", rate: 8000, rating: 4.9, reviews: 85, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Sara Ahmed", destination: "Lahore, Islamabad", languages: ["English", "Urdu", "French"], experience: "6 years, 160+ tourists", rate: 7000, rating: 4.8, reviews: 72, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Mehdi Shah", destination: "Skardu, Deosai", languages: ["English", "Urdu", "Balti"], experience: "10 years, 300+ tourists", rate: 9500, rating: 5, reviews: 110, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" },
];

export const destinations = [
  { id: "faisal-mosque", name: "Faisal Mosque", image: "https://images.unsplash.com/photo-1598027267707-47d936a1dd8a?auto=format&fit=crop&w=1200&q=70", rating: 5.0, price: 5000, bestTime: "All Year" },
  { id: "badshahi-mosque", name: "Badshahi Mosque", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=70", rating: 4.9, price: 4000, bestTime: "October–March" },
  { id: "hunza", name: "Hunza Valley", image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1200&q=70", rating: 4.9, price: 15000, bestTime: "April–October" },
  { id: "skardu", name: "Skardu & Gilgit", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=70", rating: 4.8, price: 18000, bestTime: "May–September" },
  { id: "islamabad", name: "Islamabad Beauty", image: "https://images.unsplash.com/photo-1598027267707-47d936a1dd8a?auto=format&fit=crop&w=1200&q=70", rating: 4.8, price: 8000, bestTime: "All Year" },
  { id: "khunjerab", name: "Khunjerab (Pak-China Border)", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=70", rating: 5.0, price: 22000, bestTime: "May–October" },
];

export const testimonials = [
  { name: "Emma Wilson", country: "UK", quote: "RoamPK made my Pakistan trip so easy!", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { name: "Omar Khalid", country: "UAE", quote: "Hotels, SIM, guides — everything felt premium.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { name: "Mia Chen", country: "Singapore", quote: "Investor-ready polish and genuinely useful travel flows.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
];

export const routeStops = [
  { city: "Sheikhupura", distance: "50 km from Lahore", items: ["📍 Jahangir's Tomb", "📱 Jazz Store, Main Market (2 km)", "💱 Link Exchange (10 min from highway)", "🍽️ BBQ Tonight", "🏨 Pearl Continental (Rs. 12,000/night)"] },
  { city: "Rawalpindi", distance: "100 km from Islamabad", items: ["📍 Rajaratti Site", "📱 Telenor Store, Rawalpindi Mall", "💱 HBL Currency, Satellite Town", "🍽️ Chen One Restaurant", "🏨 Pearl Continental Rawalpindi (Rs. 8,000/night)"] },
  { city: "Islamabad", distance: "Destination", items: ["📍 Faisal Mosque, Pakistan Monument, Daman-e-Koh", "📱 Jazz/Telenor/Zong at Airport", "💱 Link Exchange, Blue Area", "🏨 20+ hotel options", "🎯 15+ guides available"] },
];
