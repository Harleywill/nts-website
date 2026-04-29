import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FaviconManager from "@/components/common/FaviconManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NTS Ltd | Heating & Air Conditioning Services",
  description: "Professional heating, ventilation, and air conditioning services for domestic and commercial clients in Hull, UK. Gas Safe registered.",
  keywords: "heating, air conditioning, ventilation, plumbing, Hull, Gas Safe",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "NTS Ltd | Reliable Heating & Air Conditioning Services",
    description: "Professional HVAC and mechanical services in Hull, UK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <FaviconManager />
        {children}
      </body>
    </html>
  );
}
