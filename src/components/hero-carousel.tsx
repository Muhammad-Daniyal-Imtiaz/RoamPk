"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  {
    src: "https://images.unsplash.com/photo-1598027267707-47d936a1dd8a?auto=format&fit=crop&w=1200&q=70",
    alt: "Faisal Mosque, Islamabad",
  },
  {
    src: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=70",
    alt: "Badshahi Mosque, Lahore",
  },
  {
    src: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1200&q=70",
    alt: "Hunza Valley (Passu Cones)",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=70",
    alt: "Fairy Meadows & Nanga Parbat",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=70",
    alt: "Gilgit-Baltistan (Skardu)",
  },
  {
    src: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=70",
    alt: "Pak-China Border (Khunjerab Pass)",
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black">
      {images.map((img, index) => (
        <motion.div
          key={img.src}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
          style={{ zIndex: index === currentIndex ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/35 to-black/80" />
    </div>
  );
}
