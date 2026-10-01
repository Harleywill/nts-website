"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroCrossfadeVariants } from "@/lib/animations";
import { DEFAULT_HERO_IMAGES } from "@/lib/hero/defaults";

// Slides are managed in the admin (Hero Images) and served by /api/hero-images.
// Keep uploads small (~1920px WebP/JPEG): they're CSS backgrounds, so Next.js
// image optimization does not apply and full files are decoded on swap.
interface HeroSlide {
  imageUrl: string;
  caption?: string | null;
}

interface HeroCarouselProps {
  className?: string;
}

export default function HeroCarousel({ className = "" }: HeroCarouselProps) {
  // null until the admin's slides load (the hero's navy background shows
  // meanwhile), so a default photo never flashes up first. An empty table or
  // failed fetch falls back to the defaults.
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/hero-images")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: HeroSlide[]) => {
        if (cancelled) return;
        setSlides(Array.isArray(data) && data.length > 0 ? data : DEFAULT_HERO_IMAGES);
      })
      .catch(() => {
        if (!cancelled) setSlides(DEFAULT_HERO_IMAGES);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
    // If user prefers reduced motion, or there's only one slide, don't cycle
    const count = slides?.length ?? 0;
    if (prefersReducedMotion || count < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % count);
    }, 9000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, slides?.length]);

  // Pre-decode the upcoming image so the crossfade never decodes mid-swap
  useEffect(() => {
    if (!slides || slides.length < 2) return;
    const next = new Image();
    next.src = slides[(currentImageIndex + 1) % slides.length].imageUrl;
    next.decode?.().catch(() => {});
  }, [currentImageIndex, slides]);

  if (!slides) return null;

  const current = slides[currentImageIndex % slides.length];

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key={`${current.imageUrl}-${currentImageIndex}`}
          variants={heroCrossfadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
          style={{
            backgroundImage: `url(${current.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      {/* Optional caption — names the job / location of the current photo */}
      <AnimatePresence>
        {current.caption && (
          <motion.p
            key={`caption-${currentImageIndex}`}
            variants={heroCrossfadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-10 max-w-[70%] text-right text-xs sm:text-sm font-medium text-white/90"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {current.caption}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
