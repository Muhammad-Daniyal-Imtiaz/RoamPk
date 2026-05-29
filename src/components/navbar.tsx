"use client";

import Link from "next/link";
import { Menu, Moon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  ["Hotels", "/hotels"],
  ["SIM", "/sim"],
  ["Currency", "/currency"],
  ["Tours", "/tours"],
  ["Emergency", "/emergency"],
  ["Language", "/language"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 border-b border-white/10", dark ? "bg-[#101510]/90 text-white" : "glass")}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#006600] text-white shadow-lg shadow-green-900/20">PK</span>
          RoamPK
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={cn("rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#006600]/10 hover:text-[#006600]", dark ? "text-gray-200" : "text-gray-700")}>
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            <Moon className="h-4 w-4" />
          </Button>
          <Button className="hidden sm:inline-flex" size="sm">Plan Trip</Button>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div className={cn("mx-4 mb-4 grid gap-2 rounded-2xl p-4 shadow-xl lg:hidden", dark ? "bg-[#1a201a] text-white" : "bg-white")}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
