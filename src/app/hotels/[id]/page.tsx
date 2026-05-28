import { notFound } from "next/navigation";
import { Calendar, MapPin, Star, Users, Wifi } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { hotels, destinations } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = hotels.find((item) => item.id === Number(id));
  if (!hotel) notFound();
  return (
    <main className="pt-24">
      <Section>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <img src={hotel.images[0]} alt={hotel.name} className="h-[520px] w-full rounded-[2rem] object-cover" />
          <div className="grid grid-cols-2 gap-4">{hotel.images.concat(hotel.images[0]).slice(0, 4).map((image, index) => <img key={index} src={image} alt="" className="h-full min-h-40 rounded-2xl object-cover" />)}</div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="text-4xl font-black md:text-6xl">{hotel.name}</h1>
            <p className="mt-4 flex gap-2 text-gray-500"><MapPin className="h-5 w-5" />{hotel.location}</p>
            <p className="mt-3"><Star className="mr-1 inline h-5 w-5 fill-[#FFD700] text-[#FFD700]" /> {hotel.rating}/5 ({hotel.reviews} reviews)</p>
            <p className="mt-6 text-4xl font-black text-[#006600]">{formatPKR(hotel.price)}/night</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">{hotel.description} Designed for international travelers, this property keeps booking simple, amenities clear, and local discovery close at hand.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">{hotel.amenities.map((amenity) => <Card key={amenity}><CardContent className="flex items-center gap-2 p-4"><Wifi className="h-5 w-5 text-[#006600]" />{amenity}</CardContent></Card>)}</div>
            <h2 className="mt-12 text-3xl font-black">Room Types</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">{["Single", "Double", "Suite"].map((room, index) => <Card key={room}><CardContent><h3 className="font-black">{room}</h3><p className="mt-2 text-[#006600]">{formatPKR(hotel.price + index * 4500)}</p></CardContent></Card>)}</div>
          </div>
          <Card className="h-fit"><CardContent className="grid gap-4"><h2 className="text-2xl font-black">Check Availability</h2><Input type="date" /><Input type="date" /><Select>{Array.from({ length: 10 }).map((_, i) => <option key={i}>{i + 1} guests</option>)}</Select><Button size="lg"><Calendar className="h-5 w-5" /> Check Availability</Button></CardContent></Card>
        </div>
      </Section>
      <Section title="Reviews & Nearby Attractions">
        <div className="grid gap-6 md:grid-cols-3">{["Flawless service and great location.", "Perfect for a first Pakistan trip.", "Clean rooms, excellent breakfast."].map((review) => <Card key={review}><CardContent><p>⭐⭐⭐⭐⭐</p><p className="mt-3 text-gray-600">{review}</p></CardContent></Card>)}</div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{destinations.slice(0, 3).map((destination) => <Card key={destination.id}><img src={destination.image} className="h-40 w-full rounded-t-2xl object-cover" alt="" /><CardContent><h3 className="font-black">{destination.name}</h3><Button className="mt-4 w-full" variant="outline">View Attraction</Button></CardContent></Card>)}</div>
      </Section>
    </main>
  );
}
