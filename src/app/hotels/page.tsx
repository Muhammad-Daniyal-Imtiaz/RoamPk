import { BedDouble, Car, Dumbbell, Search, Utensils, Wifi } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { hotels } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default function HotelsPage() {
  return (
    <main className="pt-28">
      <Section title="Find Your Perfect Stay" subtitle="500+ hotels across Pakistan">
        <div className="sticky top-20 z-20 mb-10 rounded-[2rem] border border-black/5 bg-white/90 p-4 shadow-xl backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
            <div className="relative"><Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" /><Input className="pl-12" placeholder="Search by city or hotel name" /></div>
            <Select><option>Location</option><option>Lahore</option><option>Karachi</option><option>Islamabad</option><option>Hunza</option></Select>
            <Select><option>Rs. 0 – Rs. 50,000</option></Select>
            <Select><option>4+ stars</option><option>3+ stars</option><option>2+ stars</option></Select>
            <Select><option>Amenities</option><option>WiFi</option><option>Parking</option><option>Pool</option></Select>
            <Select><option>Sort by</option><option>Price low to high</option><option>Rating high to low</option></Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel) => (
            <div key={hotel.id}>
              <ProductCard image={hotel.images[0]} title={hotel.name} location={hotel.location} rating={hotel.rating} reviews={hotel.reviews} price={`${formatPKR(hotel.price)}/night`} href={`/hotels/${hotel.id}`} />
              <div className="-mt-20 mb-12 ml-6 flex gap-2 text-white"><Wifi /><Car /><BedDouble /><Utensils /><Dumbbell /></div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
