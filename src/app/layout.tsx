import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import FaviconManager from "@/components/common/FaviconManager";
import QuickEnquiryModal from "@/components/common/QuickEnquiryModal";
import StickyButtonClient from "@/components/common/StickyButtonClient";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

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
  const gtmId = "GTM-55DBJ6TK";

  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google Analytics 4 */}
        <Script
          id="ga4-script"
          src="https://www.googletagmanager.com/gtag/js?id=G-PEK7PKH64Z"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PEK7PKH64Z');`,
          }}
        />
        {/* End Google Analytics 4 */}
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <FaviconManager />
        <PageTransition>{children}</PageTransition>
        <StickyButtonClient />
      </body>
    </html>
  );
}
