import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";

export function ImageCard({ image, title, meta, price, href }: { image: string; title: string; meta: string; price: number; href: string }) {
  return (
    <Card className="group overflow-hidden hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-black">{title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" /> {meta}</p>
        </div>
      </div>
      <CardContent className="flex items-center justify-between">
        <span className="font-bold text-green-400">From {formatPKR(price)}</span>
        <Link href={href}><Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10 text-white">Explore</Button></Link>
      </CardContent>
    </Card>
  );
}

export function ProductCard({ image, title, location, rating, reviews, price, href, actions = true }: { image: string; title: string; location: string; rating: number; reviews: number; price: string; href: string; actions?: boolean }) {
  return (
    <Card className="group overflow-hidden hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
      </div>
      <CardContent>
        <h3 className="text-xl font-black text-white">{title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-gray-400"><MapPin className="h-4 w-4" />{location}</p>
        <p className="mt-3 text-sm text-gray-300"><Star className="mr-1 inline h-4 w-4 fill-[#FFD700] text-[#FFD700]" /> {rating}/5 <span className="text-gray-500">({reviews} reviews)</span></p>
        <p className="mt-4 text-2xl font-black text-green-400">{price}</p>
        {actions && <div className="mt-5 grid grid-cols-2 gap-3"><Link href={href}><Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">View Details</Button></Link><Button className="w-full bg-green-600 hover:bg-green-700 text-white">Book Now</Button></div>}
      </CardContent>
    </Card>
  );
}
