import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NTS Ltd | Heating & Air Conditioning Services",
  description: "Professional heating, ventilation, and air conditioning services for domestic and commercial clients in Hull, UK. Gas Safe registered.",
  keywords: "heating, air conditioning, ventilation, plumbing, Hull, Gas Safe",
  icons: {
    icon: "/favicon.svg",
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
        {children}

        {/* Favicon Status Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const NORMAL_FAVICON = '/favicon.svg';
                const ERROR_FAVICON = '/favicon-error.svg';

                function setFavicon(url) {
                  let link = document.querySelector("link[rel*='icon']");
                  if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                  }
                  link.href = url;
                }

                // Monitor for errors and network issues
                window.addEventListener('error', function(event) {
                  console.error('Error detected:', event.message);
                  setFavicon(ERROR_FAVICON);

                  // Auto-recover after 5 seconds if no more errors
                  setTimeout(() => {
                    setFavicon(NORMAL_FAVICON);
                  }, 5000);
                });

                // Monitor fetch/API errors
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  return originalFetch.apply(this, args)
                    .catch(error => {
                      console.error('Fetch error:', error);
                      setFavicon(ERROR_FAVICON);
                      setTimeout(() => {
                        setFavicon(NORMAL_FAVICON);
                      }, 5000);
                      throw error;
                    });
                };

                // Set initial favicon
                setFavicon(NORMAL_FAVICON);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
