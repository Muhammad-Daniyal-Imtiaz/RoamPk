"use client";

import { Building2, Calculator, Search } from "lucide-react";
import { useState } from "react";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { currencyRates, exchangeCompanies, heroImages } from "@/lib/mock-data";

export default function CurrencyPage() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState<"USD" | "EUR" | "GBP" | "CNY">("USD");
  const result = amount * currencyRates[from].sell;
  return (
    <main>
      <Hero title="Live Currency Exchange Rates" subtitle="Best rates from SBP-licensed exchange companies" image={heroImages.currency} />
      <Section title="Today’s Featured Rates">
        <div className="grid gap-6 md:grid-cols-3">
          {(["USD", "EUR", "GBP"] as const).map((code) => (
            <Card key={code} className="hover:-translate-y-2 hover:shadow-2xl"><CardContent><p className="text-lg font-black">{code === "USD" ? "🇺🇸 US Dollar" : code === "EUR" ? "🇪🇺 Euro" : "🇬🇧 British Pound"}</p><p className="mt-4 text-3xl font-black text-[#006600]">1 {code} = {currencyRates[code].sell.toFixed(2)} PKR</p><p className="mt-3 text-gray-500">Buy: {currencyRates[code].buy} | Sell: {currencyRates[code].sell}</p><p className="mt-2 text-sm text-gray-400">Updated: 10 min ago</p></CardContent></Card>
          ))}
        </div>
      </Section>
      <Section title="Convert Currency">
        <Card className="mx-auto max-w-3xl"><CardContent className="grid gap-4 md:grid-cols-[1fr_160px_160px_auto] md:items-center">
          <Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
          <Select value={from} onChange={(event) => setFrom(event.target.value as typeof from)}><option>USD</option><option>EUR</option><option>GBP</option><option>CNY</option></Select>
          <Select><option>PKR</option></Select>
          <Button><Calculator className="h-4 w-4" /> Convert</Button>
          <p className="md:col-span-4 text-3xl font-black text-[#006600]">{amount.toLocaleString()} {from} = {result.toLocaleString()} PKR</p>
        </CardContent></Card>
      </Section>
      <Section title="Partner Exchange Companies">
        <div className="grid gap-6 md:grid-cols-3">
          {exchangeCompanies.map((company) => <Card key={company.name} className="hover:-translate-y-2 hover:shadow-2xl"><CardContent><Building2 className="h-10 w-10 text-[#006600]" /><h3 className="mt-4 text-xl font-black">{company.name}</h3><p className="mt-2">⭐ {company.rating}/5 ({company.reviews} reviews)</p><p className="mt-2 text-gray-500">{company.branches}</p><p className="mt-2 text-gray-500">{company.features}</p><Button variant="outline" className="mt-5 w-full">Find Branch</Button></CardContent></Card>)}
        </div>
      </Section>
      <Section title="Find Nearest Exchange Branch">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="overflow-hidden rounded-[2rem]"><img src={heroImages.map} alt="Map" className="h-[420px] w-full object-cover" /></div>
          <Card><CardContent><div className="relative mb-5"><Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" /><Input className="pl-12" placeholder="Search by city" /></div>{["Blue Area Islamabad · 9am-8pm · 051-000000", "Liberty Lahore · 10am-9pm · 042-000000", "Clifton Karachi · 9am-10pm · 021-000000"].map((branch) => <p key={branch} className="border-b py-4 text-sm text-gray-600">{branch}</p>)}</CardContent></Card>
        </div>
      </Section>
    </main>
  );
}
