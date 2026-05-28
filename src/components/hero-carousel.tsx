"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=85",
    alt: "Nanga Parbat",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85",
    alt: "Fairy Meadows",
  },
  {
    src: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=2200&q=85",
    alt: "Hunza Valley",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85",
    alt: "Karakoram",
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
    <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden bg-black">
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
