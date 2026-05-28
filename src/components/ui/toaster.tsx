"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("roampk-toast", { detail: message }));
}

export function Toaster() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const handler = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      setTimeout(() => setMessage(""), 3000);
    };
    window.addEventListener("roampk-toast", handler);
    return () => window.removeEventListener("roampk-toast", handler);
  }, []);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      {message}
    </div>
  );
}
