import { Languages, MapPin } from "lucide-react";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { heroImages, tourGuides } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default function GuidesPage() {
  return (
    <main>
      <Hero title="Find Expert Local Guides" subtitle="Book verified guides by destination, language, and experience." image={heroImages.tours} />
      <Section>
        <Input className="mx-auto mb-10 max-w-2xl" placeholder="Search by destination or language" />
        <div className="grid gap-6 md:grid-cols-3">
          {tourGuides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden text-center hover:-translate-y-2 hover:shadow-2xl">
              <CardContent>
                <img src={guide.image} alt={guide.name} className="mx-auto h-28 w-28 rounded-full object-cover ring-8 ring-[#006600]/10" />
                <h3 className="mt-5 text-xl font-black">{guide.name}</h3>
                <p className="mt-2 flex justify-center gap-2 text-gray-500"><MapPin className="h-4 w-4" />{guide.destination}</p>
                <p className="mt-2 flex justify-center gap-2 text-gray-500"><Languages className="h-4 w-4" />{guide.languages.join(", ")}</p>
                <p className="mt-2 text-gray-500">{guide.experience}</p>
                <p className="mt-3">⭐ {guide.rating}/5 ({guide.reviews} reviews)</p>
                <p className="mt-4 text-2xl font-black text-[#006600]">{formatPKR(guide.rate)}/day</p>
                <Button className="mt-5 w-full">Book Guide</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
