import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <FaviconManager />
        {children}
      </body>
    </html>
  );
}
