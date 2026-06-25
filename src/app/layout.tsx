import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "RoamPK | Pakistan Tourism Super-App",
  description: "Book hotels, get tourist SIM, exchange currency, find guides — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-[#111511] text-gray-300 antialiased">
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
