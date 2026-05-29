"use client";

import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Ambulance, Truck, Shield } from "lucide-react";

export default function EmergencyPage() {
  const handleSendHelp = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const message = `I need help! My location: https://www.google.com/maps?q=${latitude},${longitude}`;
        // Open default mail client with prefilled message
        window.location.href = `mailto:?subject=Emergency%20Help&body=${encodeURIComponent(message)}`;
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
      }
    );
  };

  const contacts = [
    { name: "Police", number: "15" },
    { name: "Ambulance", number: "115" },
    { name: "Fire Brigade", number: "16" },
    { name: "Army Emergency", number: "111" },
  ];

  const zongBooths = [
    { name: "Zong SIM Booth - Islamabad", location: "Blue Area, Islamabad" },
    { name: "Zong SIM Booth - Karachi", location: "Clifton, Karachi" },
    { name: "Zong SIM Booth - Lahore", location: "Gulberg, Lahore" },
    { name: "Zong SIM Booth - Peshawar", location: "University Road, Peshawar" },
    { name: "Zong SIM Booth - Quetta", location: "Jinnah Road, Quetta" },
  ];

  return (
    <section className="min-h-screen bg-[#111511] py-12 text-gray-300 flex flex-col items-center">
      <Section title="Emergency Contacts" subtitle="Quick numbers for safety" className="max-w-4xl mx-auto text-center">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contacts.map((c) => {
            const iconMap: Record<string, JSX.Element> = {
              Police: <Shield className="h-8 w-8 text-[#006600]" />,
              Ambulance: <Ambulance className="h-8 w-8 text-[#006600]" />,
              "Fire Brigade": <Truck className="h-8 w-8 text-[#006600]" />,
              "Army Emergency": <Shield className="h-8 w-8 text-[#006600]" />,
            };
            return (
              <Card
                key={c.name}
                className="bg-[#1a201a] border border-gray-600 hover:scale-105 hover:shadow-xl transition-transform"
              >
                <CardContent className="flex flex-col items-center py-8">
                  {iconMap[c.name]}
                  <h3 className="mt-3 text-lg font-semibold text-white">{c.name}</h3>
                  <a
                    href={`tel:${c.number}`}
                    className="mt-2 text-2xl font-mono text-green-400 hover:underline"
                  >
                    {c.number}
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Zong SIM Booths Section */}
        <Section title="Zong SIM Booths" subtitle="Locations for Zong network" className="mt-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {zongBooths.map((b) => (
              <Card key={b.name} className="bg-[#1a201a] border border-gray-600">
                <CardContent className="flex flex-col items-center py-6">
                  <h4 className="text-lg font-medium text-white">{b.name}</h4>
                  <p className="mt-1 text-sm text-gray-400">{b.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
        <div className="mt-10 flex justify-center">
          <Button variant="default" size="lg" onClick={handleSendHelp}>
            Send Help with My Location
          </Button>
        </div>
      </Section>
    </section>
  );
}
