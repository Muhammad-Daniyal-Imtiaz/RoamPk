import { CalendarDays, Hotel, MapPin, Utensils, UsersRound } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/cards";
import { Section } from "@/components/section";
import { Select } from "@/components/ui/select";
import { tourPackages, heroImages } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default function ToursPage() {
  return (
    <main>
      <Hero title="Discover Guided Tour Packages" subtitle="Expert local guides for every destination" image={heroImages.tours} cta="Explore Packages" />
      <Section>
        <div className="mb-10 grid gap-3 rounded-[2rem] bg-gray-50 p-4 md:grid-cols-4">
          <Select><option>Northern Areas</option><option>Kashmir</option><option>Punjab</option><option>Sindh</option></Select>
          <Select><option>Rs. 0 – Rs. 100,000</option></Select>
          <Select><option>3-7 days</option><option>7-14 days</option><option>14+ days</option></Select>
          <Select><option>Difficulty</option><option>Easy</option><option>Moderate</option><option>Difficult</option></Select>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tourPackages.map((tour) => (
            <div key={tour.id}>
              <ProductCard image={tour.images[0]} title={tour.name} location={tour.location} rating={tour.rating} reviews={tour.reviews} price={`${formatPKR(tour.price)}/person`} href="/tours" />
              <div className="-mt-20 mb-12 ml-6 flex gap-2 text-white"><Hotel /><Utensils /><CalendarDays /><UsersRound /><MapPin /></div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
