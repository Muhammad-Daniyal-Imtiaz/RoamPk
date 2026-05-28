import { Hero } from "@/components/hero";
import { ImageCard } from "@/components/cards";
import { Section } from "@/components/section";
import { destinations, heroImages } from "@/lib/mock-data";

export default function DestinationsPage() {
  return (
    <main>
      <Hero title="Discover Pakistan's Beauty" subtitle="Explore detailed guides for every destination" image={heroImages.hunza} />
      <Section title="Choose Your Next Story">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => <ImageCard key={destination.id} image={destination.image} title={destination.name} meta={`${destination.rating}/5`} price={destination.price} href={`/destinations/${destination.id}`} />)}
        </div>
      </Section>
    </main>
  );
}
