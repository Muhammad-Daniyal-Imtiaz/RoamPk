"use client";

import { CheckCircle2, MapPin, Smartphone, Upload, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { heroImages, simPackages } from "@/lib/mock-data";
import { formatPKR } from "@/lib/utils";

export default function SimPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main>
      <Hero title="Get Your Pakistan Tourist SIM" subtitle="Pre-order online, pick up at airport or city branch" image={heroImages.sim} />
      <Section title="How It Works">
        <div className="grid gap-6 md:grid-cols-3">
          {([[Upload, "Upload Passport", "Take a photo of your passport"], [Smartphone, "Choose Provider", "Jazz, Telenor, or Zong"], [MapPin, "Pick Up SIM", "Airport or city branch"]] as [LucideIcon, string, string][]).map(([Icon, title, text], i) => (
            <Card key={String(title)} className="text-center hover:-translate-y-2 hover:shadow-2xl"><CardContent><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]"><Icon className="h-8 w-8" /></div><p className="text-sm font-black text-[#FFD700]">STEP {i + 1}</p><h3 className="mt-2 text-xl font-black">{title}</h3><p className="mt-2 text-gray-500">{text}</p></CardContent></Card>
          ))}
        </div>
      </Section>
      <Section title="Provider Comparison">
        <div className="grid gap-6 md:grid-cols-3">
          {simPackages.map((pkg) => (
            <Card key={pkg.provider} className="relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl">
              <CardContent>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#006600] text-xl font-black text-white">{pkg.provider[0]}</div>
                <h3 className="text-2xl font-black">{pkg.provider}</h3>
                <p className="mt-1 font-semibold">{pkg.package}</p>
                <p className="mt-4 text-gray-500">{pkg.details}</p>
                <p className="mt-5 text-3xl font-black text-[#006600]">{formatPKR(pkg.price)}<span className="text-sm text-gray-400">/plan</span></p>
                <p className="mt-3 flex gap-2 text-sm text-gray-500"><Wifi className="h-4 w-4" />{pkg.coverage}</p>
                <Button className="mt-6 w-full" onClick={() => toast(`${pkg.provider} selected for pre-order`)}>Pre-Order Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Pre-Order Form" subtitle="UI-only flow with simulated submission.">
        <Card className="mx-auto max-w-3xl"><CardContent className="grid gap-4">
          {submitted ? (
            <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" /><h3 className="mt-4 text-3xl font-black">Pre-Order Submitted!</h3><p className="mt-2 text-gray-500">We'll contact you within 24 hours to confirm your SIM pickup.</p><p className="mt-4 font-black text-[#006600]">Order ID: #SIM-2026-001</p></div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2"><Select><option>Jazz</option><option>Telenor</option><option>Zong</option></Select><Select><option>Tourist 6GB Weekly</option><option>Tourist Monthly</option><option>5G Tourist Unlimited</option></Select></div>
              <div className="rounded-2xl border-2 border-dashed border-[#006600]/25 p-8 text-center text-gray-500">Drag & drop passport photo here</div>
              <Select><option>Islamabad Airport</option><option>Lahore Airport</option><option>Karachi Airport</option><option>Blue Area Islamabad</option><option>Main Market Lahore</option></Select>
              <div className="grid gap-4 md:grid-cols-3"><Input placeholder="Name" /><Input placeholder="Email" /><Input placeholder="Phone" /></div>
              <label className="flex gap-3 text-sm text-gray-500"><input type="checkbox" /> I agree to PTA registration terms</label>
              <Button size="lg" onClick={() => { setSubmitted(true); toast("SIM pre-order submitted"); }}>Submit Pre-Order</Button>
            </>
          )}
        </CardContent></Card>
      </Section>
    </main>
  );
}
