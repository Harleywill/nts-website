"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroCrossfadeVariants } from "@/lib/animations";

// HVAC-themed images - Professional equipment and technical work photos.
// Keep these small (~1920px WebP/AVIF): they're CSS backgrounds, so Next.js
// image optimization does not apply and full files are decoded on swap.
const heroImages = [
  "/images/hero-electrical.webp", // Electrical panel installation
  "/images/hero-rooftop-hvac.webp", // HVAC rooftop units
  "/images/work-in-progress.webp", // NTS engineer welding on site
  "/images/hero-electrical-testing.webp", // Electrical testing with multimeter
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

  // Auto-advance carousel every 9 seconds (2s crossfade; longer dwell keeps
  // the hero feeling calm rather than constantly mid-transition)
  useEffect(() => {
    // If user prefers reduced motion, don't cycle (static image)
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Pre-decode the upcoming image so the crossfade never decodes mid-swap
  useEffect(() => {
    const next = new Image();
    next.src = heroImages[(currentImageIndex + 1) % heroImages.length];
    next.decode?.().catch(() => {});
  }, [currentImageIndex]);

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
