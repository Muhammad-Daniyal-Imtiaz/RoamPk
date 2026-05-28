import { notFound } from "next/navigation";
import { Bus, MapPin, Plane, ShieldCheck, Star } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { destinations, hotels, tourGuides } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = destinations.find((item) => item.id === id);
  if (!destination) notFound();
  return (
    <main className="pt-20">
      <section className="relative flex min-h-[72vh] items-end overflow-hidden px-4 pb-16 text-white lg:px-8">
        <img src={destination.image} alt={destination.name} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="mx-auto w-full max-w-7xl"><h1 className="text-5xl font-black md:text-7xl">{destination.name}</h1><p className="mt-4 flex gap-3 text-xl"><MapPin /> Pakistan <Star className="fill-[#FFD700] text-[#FFD700]" /> {destination.rating}/5</p></div>
      </section>
      <Section>
        <div className="grid gap-4 md:grid-cols-4">{[`📍 200 km from Gilgit`, `🌡️ Best Time: ${destination.bestTime}`, `💰 Budget: Rs. 30,000–50,000`, `⭐ ${destination.rating}/5 (2,500+ reviews)`].map((info) => <Card key={info}><CardContent className="font-bold">{info}</CardContent></Card>)}</div>
      </Section>
      <Section title="Top Attractions">
        <div className="grid gap-6 md:grid-cols-3">{["Viewpoint", "Old Fort", "Lake", "Bazaar", "Food Street", "Sunset Point"].map((name, index) => <Card key={name} className="overflow-hidden"><img src={destination.image} alt="" className="h-44 w-full object-cover" /><CardContent><h3 className="font-black">{name}</h3><p className="text-gray-500">Entry from Rs. {index * 200}</p></CardContent></Card>)}</div>
      </Section>
      <Section title="Plan the Essentials">
        <div className="grid gap-6 lg:grid-cols-3">
          {hotels.slice(0, 3).map((hotel) => <Card key={hotel.id}><CardContent><h3 className="font-black">{hotel.name}</h3><p className="mt-2 text-[#006600]">{formatPKR(hotel.price)}/night</p></CardContent></Card>)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card><CardContent><h3 className="text-xl font-black">SIM Coverage</h3><p className="mt-3 text-gray-600">Jazz (4G), Telenor (3G), Zong (limited/no signal in remote valleys).</p><h3 className="mt-6 text-xl font-black">Currency Exchange</h3><p className="mt-3 text-gray-600">Exchange in major cities before departure; northern valleys have limited licensed branches.</p></CardContent></Card>
          <Card><CardContent><h3 className="text-xl font-black">How to Get There</h3><p className="mt-3 flex gap-2"><Bus /> Bus via Islamabad/Gilgit routes</p><p className="mt-3 flex gap-2"><Plane /> Flight to nearest airport, then private transfer</p><h3 className="mt-6 flex gap-2 text-xl font-black"><ShieldCheck /> Safety Tips</h3><p className="mt-3 text-gray-600">Carry cash, keep offline maps, confirm road conditions, and travel with local guides for remote routes.</p></CardContent></Card>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{tourGuides.slice(0, 2).map((guide) => <Card key={guide.id}><CardContent><h3 className="font-black">{guide.name}</h3><p className="text-gray-500">{guide.languages.join(", ")}</p><p className="text-[#006600]">{formatPKR(guide.rate)}/day</p></CardContent></Card>)}<Card><CardContent><h3 className="font-black">Offline Map</h3><p className="text-gray-500">Download routes before you go.</p></CardContent></Card></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button>Book Hotel</Button><Button variant="outline">Book Guide</Button><Button variant="outline">Download Offline Map</Button></div>
      </Section>
    </main>
  );
}
