"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#006600] text-white shadow-2xl hover:scale-110" aria-label="Scroll to top">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
