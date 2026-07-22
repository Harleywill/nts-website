import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/styles/admin/theme.css";
import FaviconManager from "@/components/common/FaviconManager";
import MetaPixel from "@/components/common/MetaPixel";
import ConditionalRetell from "@/components/common/ConditionalRetell";
import EngineeringBackground from "@/components/common/EngineeringBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ntslimited.org";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
};

export const metadata: Metadata = {
  title: "NTS Ltd | Heating & Air Conditioning Services in Hull",
  description: "Professional heating, ventilation, and air conditioning services for domestic and commercial clients in Hull, UK. Gas Safe registered. Over 15 years of expertise.",
  keywords: "heating services Hull, air conditioning Hull, HVAC Hull, ventilation systems, plumbing Hull, Gas Safe registered, commercial HVAC, domestic heating",
  authors: [{ name: "NTS Ltd" }],
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "NTS Ltd | Professional Heating & Air Conditioning Services",
    description: "Expert HVAC and mechanical solutions for Hull and beyond. Gas Safe registered with 15+ years of experience.",
    type: "website",
    url: siteUrl,
    siteName: "NTS Ltd",
    locale: "en_GB",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "NTS Ltd - Professional HVAC Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NTS Ltd | Heating & Air Conditioning Services",
    description: "Professional HVAC and mechanical services in Hull, UK",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
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
      className={`${inter.variable} ${mono.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Structured Data - JSON-LD Schema */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "NTS Ltd",
              "image": `${siteUrl}/og-image.jpg`,
              "description": "Professional heating, ventilation, and air conditioning services for domestic and commercial clients",
              "url": siteUrl,
              "telephone": "01482 838080",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hull, East Yorkshire",
                "addressLocality": "Hull",
                "addressRegion": "East Yorkshire",
                "postalCode": "",
                "addressCountry": "GB"
              },
              "areaServed": ["Hull", "East Yorkshire", "Yorkshire", "Humber"],
              "serviceType": [
                "Heating Services",
                "Air Conditioning",
                "Ventilation",
                "HVAC",
                "Plumbing",
                "Commissioning"
              ],
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "17:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "09:00",
                  "closes": "13:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/ntslimited",
                "https://www.linkedin.com/company/nts-ltd"
              ]
            }),
          }}
        />

        {/* Organization Schema */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NTS Ltd",
              "url": siteUrl,
              "logo": `${siteUrl}/images/ntsLogo.png`,
              "description": "Professional HVAC and mechanical solutions for domestic and commercial clients",
              "foundingDate": "1981",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "telephone": "01482 838080"
              }
            }),
          }}
        />

        {/* FAQ Schema - Optimized for AI Assistants (Claude, ChatGPT, Perplexity) */}
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What services does NTS Ltd provide?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "NTS Ltd provides comprehensive HVAC and mechanical services including heating systems, air conditioning installation and maintenance, ventilation solutions, plumbing services, domestic and commercial servicing, and system commissioning. All work is carried out by Gas Safe registered engineers with 15+ years of experience."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are your engineers Gas Safe registered?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all our engineers are Gas Safe registered, with additional F-Gas certification, CHAS accreditation, and SafeContractor certification."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you offer 24/7 emergency services?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide 24/7 emergency breakdown and repair services across Hull and surrounding regions with response times typically under 2 hours."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What areas do you service?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We serve Hull, East Yorkshire, Yorkshire, and the Humber region, providing services to domestic properties, commercial businesses, industrial facilities, and healthcare premises."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you provide maintenance plans?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we offer comprehensive planned maintenance programs for both domestic and commercial clients including annual servicing and preventative maintenance."
                  }
                }
              ]
            }),
          }}
        />

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

        {/* Meta Pixel (no-op until NEXT_PUBLIC_META_PIXEL_ID is set) */}
        <MetaPixel />
      </head>
      <body className="min-h-screen flex flex-col text-gray-900">
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
        <EngineeringBackground />
        <FaviconManager />
        <ConditionalRetell />
        {children}
      </body>
    </html>
  );
}
