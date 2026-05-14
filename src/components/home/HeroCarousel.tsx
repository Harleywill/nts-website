"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroCrossfadeVariants } from "@/lib/animations";

// HVAC-themed images - Professional equipment and technical work photos
const heroImages = [
  "/images/hero-electrical.jpg", // Electrical panel installation
  "/images/hero-rooftop-hvac.jpg", // HVAC rooftop units
  "/images/hero-hvac-equipment.webp", // HVAC cooling equipment
  "/images/hero-electrical-testing.jpg", // Electrical testing with multimeter
  "/images/hero-circuit-board.avif", // Circuit board and electronics
];

interface HeroCarouselProps {
  className?: string;
}

export default function HeroCarousel({ className = "" }: HeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    // If user prefers reduced motion, don't cycle (static image)
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={currentImageIndex}
        variants={heroCrossfadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </AnimatePresence>
  );
}
