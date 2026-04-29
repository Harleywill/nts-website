"use client";

import { useEffect } from "react";

export default function FaviconManager() {
  useEffect(() => {
    const NORMAL_FAVICON = "/favicon.png";
    const ERROR_FAVICON = "/favicon-error.png";
    let isLoading = false;
    let hasError = false;

    function setFavicon(url: string) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link") as HTMLLinkElement;
        link.rel = "icon";
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
    window.addEventListener("load", function () {
      isLoading = false;
      updateFavicon();
    });

    window.addEventListener("beforeunload", function () {
      isLoading = true;
      updateFavicon();
    });

    // Monitor navigation (Next.js router)
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState.bind(window.history);
      window.history.pushState = function (data: any, title: string, url?: string | URL | null) {
        isLoading = true;
        updateFavicon();
        const result = originalPushState(data, title, url);
        setTimeout(() => {
          isLoading = false;
          updateFavicon();
        }, 2000);
        return result;
      };
    }

    // Monitor for JavaScript errors
    window.addEventListener("error", function (event) {
      console.error("Error detected:", event.message);
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
    (window as any).fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      try {
        const response = await originalFetch(input, init);
        // Handle 404 and other error status codes
        if (!response.ok && response.status >= 400) {
          console.error("HTTP Error:", response.status);
          hasError = true;
          updateFavicon();
          setTimeout(() => {
            hasError = false;
            updateFavicon();
          }, 3000);
        }
        return response;
      } catch (error) {
        console.error("Fetch error:", error);
        hasError = true;
        updateFavicon();
        setTimeout(() => {
          hasError = false;
          updateFavicon();
        }, 3000);
        throw error;
      }
    };

    // Monitor network connectivity
    window.addEventListener("offline", function () {
      console.warn("Network connection lost");
      hasError = true;
      updateFavicon();
    });

    window.addEventListener("online", function () {
      console.log("Network connection restored");
      hasError = false;
      updateFavicon();
    });

    // Set initial favicon
    setFavicon(NORMAL_FAVICON);
  }, []);

  return null;
}
