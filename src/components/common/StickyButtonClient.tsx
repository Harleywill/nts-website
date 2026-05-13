"use client";

import { useState, useEffect, useRef } from "react";
import QuickEnquiryModal from "./QuickEnquiryModal";

export default function StickyButtonClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if screen is mobile (< 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Get the hero section
    const heroSection = document.querySelector('div[style*="1a2f6e"]') || document.querySelector('[class*="Hero"]');

    if (!heroSection) return;

    // Create intersection observer to detect when hero is out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky button only when hero is NOT visible AND on mobile
        setShowButton(!entry.isIntersecting && isMobile);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, [isMobile]);

  if (!showButton) return null;

  return (
    <>
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
          padding: "0 16px",
          border: "none",
          borderTop: "1px solid #ddd",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
          zIndex: 9999,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#45a049";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4caf50";
        }}
        aria-label="Get Free Quote"
      >
        Get Free Quote
      </button>

      <QuickEnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
