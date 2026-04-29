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
                let isLoading = false;
                let hasError = false;

                function setFavicon(url) {
                  let link = document.querySelector("link[rel*='icon']");
                  if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                  }
                  link.href = url;
                }

                function updateFavicon() {
                  if (isLoading || hasError) {
                    setFavicon(ERROR_FAVICON);
                  } else {
                    setFavicon(NORMAL_FAVICON);
                  }
                }

                // Track page loading state
                window.addEventListener('load', function() {
                  isLoading = false;
                  updateFavicon();
                });

                window.addEventListener('beforeunload', function() {
                  isLoading = true;
                  updateFavicon();
                });

                // Monitor navigation (Next.js router)
                if (window.history && window.history.pushState) {
                  const originalPushState = window.history.pushState;
                  window.history.pushState = function(...args) {
                    isLoading = true;
                    updateFavicon();
                    const result = originalPushState.apply(this, args);
                    setTimeout(() => {
                      isLoading = false;
                      updateFavicon();
                    }, 2000);
                    return result;
                  };
                }

                // Monitor for JavaScript errors
                window.addEventListener('error', function(event) {
                  console.error('Error detected:', event.message);
                  hasError = true;
                  updateFavicon();

                  // Auto-recover after 3 seconds if no more errors
                  setTimeout(() => {
                    hasError = false;
                    updateFavicon();
                  }, 3000);
                });

                // Monitor fetch/API errors and 404s
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  return originalFetch.apply(this, args)
                    .then(response => {
                      // Handle 404 and other error status codes
                      if (!response.ok && (response.status >= 400)) {
                        console.error('HTTP Error:', response.status);
                        hasError = true;
                        updateFavicon();
                        setTimeout(() => {
                          hasError = false;
                          updateFavicon();
                        }, 3000);
                      }
                      return response;
                    })
                    .catch(error => {
                      console.error('Fetch error:', error);
                      hasError = true;
                      updateFavicon();
                      setTimeout(() => {
                        hasError = false;
                        updateFavicon();
                      }, 3000);
                      throw error;
                    });
                };

                // Monitor network connectivity
                window.addEventListener('offline', function() {
                  console.warn('Network connection lost');
                  hasError = true;
                  updateFavicon();
                });

                window.addEventListener('online', function() {
                  console.log('Network connection restored');
                  hasError = false;
                  updateFavicon();
                });

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
