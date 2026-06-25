"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, Menu, Moon, User, X } from "lucide-react";
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
  ["Join", "/join"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 border-b border-white/10", dark ? "bg-[#101510]/90 text-white" : "glass")}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#006600] text-white shadow-lg shadow-green-900/20">PK</span>
          Roam-PK
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
          {!isSignedIn && (
            <Link href="/sign-up" className="hidden sm:block">
              <Button size="sm">Join RoamPK</Button>
            </Link>
          )}
          {isSignedIn && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full bg-[#1a201a] px-3 py-1.5 text-sm font-semibold hover:bg-[#006600]/20"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span>{session.user?.name?.split(" ")[0] || "User"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#1a201a] p-2 shadow-2xl">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#006600]/10">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#006600]/10">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button onClick={() => signOut()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
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
          {isSignedIn && (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10">Dashboard</Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10">Profile</Link>
              <button onClick={() => signOut()} className="rounded-xl px-4 py-3 text-left font-semibold text-red-400 hover:bg-red-400/10">Sign Out</button>
            </>
          )}
          {!isSignedIn && (
            <Link href="/sign-up" onClick={() => setOpen(false)} className="rounded-xl bg-[#006600] px-4 py-3 text-center font-black text-white">Join RoamPK</Link>
          )}
        </div>
      )}
    </header>
  );
}
