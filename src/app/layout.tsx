import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import SaleBanner from "@/components/ui/SaleBanner";
import { WhatsAppFloat } from "@/components/ui/WhatsAppButton";
import FacebookPixel from "@/components/ui/FacebookPixel";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClothHaus - Premium Pakistani Fashion",
  description: "Discover premium kurtas, suits, sherwanis, and bridal wear. Shop the finest Pakistani fashion online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <FacebookPixel />
        <Providers>
          <SaleBanner />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
