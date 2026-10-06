"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

// Dots shown either side of the selected one (9 in total). The selected dot is
// always in the centre; slots past the first/last image are left empty.
const DOTS_EACH_SIDE = 4;
// Dot diameter (px) by distance from the selected dot, so the row tapers off.
const DOT_SIZES = [12, 8, 8, 6, 4];

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (difference > 50) {
      handleNext();
    } else if (difference < -50) {
      handlePrevious();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 !text-white hover:!text-gray-300 transition-colors z-[60]"
        aria-label="Close lightbox"
      >
        <FaTimes size={32} />
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-full max-h-[90vh] object-contain cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-8 z-[60]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="p-3 rounded-full bg-brand-green-500 hover:bg-brand-green-600 hover:scale-110 transition-all duration-200 !text-white shadow-lg"
          aria-label="Previous image"
        >
          <FaChevronLeft size={28} />
        </button>

        <div className="text-white font-semibold text-lg min-w-16 text-center">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="p-3 rounded-full bg-brand-green-500 hover:bg-brand-green-600 hover:scale-110 transition-all duration-200 !text-white shadow-lg"
          aria-label="Next image"
        >
          <FaChevronRight size={28} />
        </button>
      </div>

      {/* Dot Indicators — selected dot always centred, neighbours taper off */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-[60]">
        {Array.from({ length: DOTS_EACH_SIDE * 2 + 1 }, (_, slot) => {
          const offset = slot - DOTS_EACH_SIDE;
          const index = currentIndex + offset;
          const size = DOT_SIZES[Math.abs(offset)];
          // Empty slot keeps the selected dot centred at the gallery's ends
          if (index < 0 || index >= images.length) {
            return <span key={`empty-${slot}`} aria-hidden="true" style={{ width: size, height: size }} />;
          }
          const isCurrent = offset === 0;
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                isCurrent ? "bg-white shadow-md shadow-black/40" : "bg-white/40 hover:bg-white/80"
              }`}
              style={{ width: size, height: size }}
              aria-label={`Go to image ${index + 1}`}
              aria-current={isCurrent ? "true" : undefined}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
