import { Fuel, MapPinned, Navigation } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { heroImages, routeStops } from "@/lib/mock-data";

export default function RoutesPage() {
  return (
    <main>
      <Hero title="Interactive Route Maps" subtitle="Plan your journey with SIM outlets, currency exchange, and attractions" image={heroImages.map} />
      <Section title="Plan Your Route">
        <Card className="mx-auto max-w-4xl"><CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"><Select><option>Lahore</option><option>Karachi</option><option>Islamabad</option></Select><Select><option>Islamabad</option><option>Hunza</option><option>Skardu</option></Select><Button size="lg">Plan Route</Button></CardContent></Card>
      </Section>
      <Section title="Lahore to Islamabad">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="overflow-hidden rounded-[2rem]"><img src={heroImages.map} alt="Route map" className="h-[430px] w-full object-cover" /></div>
          <div className="grid gap-4">
            {([["380 km", "Distance", MapPinned], ["4.5 hours", "Duration", Navigation], ["Rs. 4,500", "Fuel estimate", Fuel]] as [string, string, LucideIcon][]).map(([value, label, Icon]) => <Card key={label}><CardContent className="flex items-center gap-4"><Icon className="h-8 w-8 text-[#006600]" /><div><p className="text-2xl font-black">{value}</p><p className="text-gray-500">{label}</p></div></CardContent></Card>)}
          </div>
        </div>
      </Section>
      <Section title="Stops Along Your Route">
        <div className="mx-auto max-w-4xl">
          {routeStops.map((stop, index) => (
            <div key={stop.city} className="relative border-l-2 border-[#006600]/20 pb-10 pl-8">
              <div className="absolute -left-4 grid h-8 w-8 place-items-center rounded-full bg-[#006600] text-sm font-black text-white">{index + 1}</div>
              <Card className="hover:shadow-2xl"><CardContent><h3 className="text-2xl font-black">{stop.city}</h3><p className="text-gray-500">{stop.distance}</p><div className="mt-5 grid gap-3">{stop.items.map((item) => <p key={item} className="rounded-xl bg-gray-50 p-3">{item}</p>)}</div><Button className="mt-5" variant={index === 2 ? "default" : "outline"}>{index === 2 ? "Explore Islamabad" : "View Details"}</Button></CardContent></Card>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
