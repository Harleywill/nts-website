"use client";

import { useState, useEffect } from "react";
import QuickEnquiryModal from "./QuickEnquiryModal";

export default function StickyButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);

    // Check if screen is mobile (< 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render on server or during hydration
  // Only render on client after checking viewport
  if (!isClient || isMobile === null) {
    return null;
  }

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Sticky Button - Mobile only (< 768px) */}
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "56px",
            width: "100%",
            backgroundColor: "#4caf50",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "8px 16px",
            border: "1px solid #e0e0e0",
            borderBottom: "none",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            zIndex: 50,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
          aria-label="Get Free Quote"
        >
          Get Free Quote
        </button>
      </div>

      {/* Modal Form */}
      <QuickEnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
