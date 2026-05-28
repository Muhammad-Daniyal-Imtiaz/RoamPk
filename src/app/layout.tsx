import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "RoamPK | Pakistan Tourism Super-App",
  description: "Investor-ready UI demo for hotels, SIM cards, exchange rates, tours, destinations, and route maps in Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1a1a1a] antialiased">
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  );
}
