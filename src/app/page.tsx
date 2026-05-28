import Link from "next/link";
import { BadgeDollarSign, BedDouble, Map, Phone, Quote, Route, Star, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MotionDiv } from "@/components/motion";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageCard } from "@/components/cards";
import { destinations, heroImages, testimonials } from "@/lib/mock-data";

export default function Home() {
  const features: [LucideIcon, string, string][] = [
    [BedDouble, "Book Hotels", "500+ hotels across Pakistan"],
    [Phone, "Get SIM Card", "Pre-order tourist SIM instantly"],
    [BadgeDollarSign, "Exchange Currency", "Live rates from trusted partners"],
    [Users, "Guided Tours", "Expert local guides for every destination"],
  ];
  return (
    <main>
      <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20 text-center text-white">
        <img src={heroImages.hunza} alt="Hunza Valley" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
        <MotionDiv initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[2rem] bg-white/15 text-2xl font-black backdrop-blur">PK</div>
          <h1 className="text-6xl font-black tracking-tight md:text-8xl">RoamPK</h1>
          <p className="mt-5 text-xl font-semibold md:text-2xl">Your All-in-One Pakistan Travel Companion</p>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-white/80">Book hotels, get tourist SIM cards, exchange currency, and discover guided tours — all in one place.</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/hotels"><Button size="lg">Find Hotels</Button></Link>
            <Link href="/sim"><Button variant="secondary" size="lg">Get Tourist SIM</Button></Link>
            <Link href="/currency"><Button variant="secondary" size="lg">Check Exchange Rates</Button></Link>
          </div>
        </MotionDiv>
      </section>

      <Section title="Everything You Need for Stress-Free Travel">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, text]) => (
            <Card key={String(title)} className="p-2 hover:-translate-y-2 hover:shadow-2xl">
              <CardContent>
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]"><Icon className="h-7 w-7" /></div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-gray-500">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Popular Destinations" subtitle="Handpicked icons of mountains, food, culture, coastline, and calm.">
        <div className="grid gap-6 md:grid-cols-3">
          {destinations.slice(0, 3).map((destination) => (
            <ImageCard key={destination.id} image={destination.image} title={destination.name} meta={`${destination.rating}/5`} price={destination.price} href={`/destinations/${destination.id}`} />
          ))}
        </div>
      </Section>

      <Section title="What Travelers Say">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="hover:-translate-y-2 hover:shadow-2xl">
              <CardContent>
                <Quote className="h-8 w-8 text-[#006600]" />
                <p className="mt-4 text-lg font-semibold">“{item.quote}”</p>
                <div className="mt-5 flex text-[#FFD700]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <div className="mt-6 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  <div><p className="font-bold">{item.name}</p><p className="text-sm text-gray-500">{item.country}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="py-20">
        <div className="overflow-hidden rounded-[2rem] bg-[#006600] p-8 text-white shadow-2xl md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-5xl">Get Travel Tips & Exclusive Deals</h2>
              <p className="mt-3 text-white/75">No spam, unsubscribe anytime.</p>
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row md:min-w-[520px]">
              <Input placeholder="Email address" className="bg-white" />
              <Button variant="secondary" size="lg">Subscribe</Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
