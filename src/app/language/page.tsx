"use client";

import { useState } from "react";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { languagePhrases } from "@/lib/language-data";
import { Search, Globe2 } from "lucide-react";

export default function LanguagePage() {
  const [search, setSearch] = useState("");

  const filteredPhrases = languagePhrases.filter(
    (p) =>
      p.en.toLowerCase().includes(search.toLowerCase()) ||
      p.rom.toLowerCase().includes(search.toLowerCase()) ||
      p.ur.includes(search)
  );

  return (
    <section className="min-h-screen bg-[#111511] py-20 text-gray-300">
      <Section
        title="Local Translator Guide"
        subtitle="Learn essential travel phrases in Urdu, Roman Urdu (English letters), Punjabi, and Pashto."
        className="max-w-6xl mx-auto"
      >
        {/* Search Bar */}
        <div className="relative mx-auto mb-12 max-w-2xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phrases (e.g. 'water', 'who are you', 'naam')..."
            className="pl-12 bg-[#1a201a] border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>

        {/* Phrases Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPhrases.slice(0, 100).map((p, idx) => (
            <Card
              key={idx}
              className="bg-[#1a201a] border border-white/5 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-950/20 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                {/* English phrase */}
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400 mb-3">
                    <Globe2 className="h-3 w-3" /> English
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {p.en}
                  </h3>
                </div>

                {/* Roman Urdu Pronunciation */}
                <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                  <span className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">
                    Spoken Urdu (Roman Letters)
                  </span>
                  <p className="text-base font-bold text-yellow-400 font-sans">
                    "{p.rom}"
                  </p>
                </div>

                {/* Regional Languages */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Urdu Script</span>
                    <span className="font-semibold text-green-400 text-right text-lg truncate">
                      {p.ur}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Punjabi</span>
                    <span className="font-medium text-indigo-300 text-right text-base truncate">
                      {p.pa}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Pashto</span>
                    <span className="font-medium text-orange-300 text-right text-base truncate">
                      {p.ps}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPhrases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No phrases found matching "{search}". Try searching for something else!
          </div>
        )}

        {filteredPhrases.length > 100 && (
          <p className="text-center mt-8 text-xs text-gray-500">
            Showing top 100 matches. Use the search box above to search through all 2,000+ phrases!
          </p>
        )}
      </Section>
    </section>
  );
}
