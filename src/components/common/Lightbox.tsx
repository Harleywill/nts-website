"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

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
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
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
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-8 z-60">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="p-3 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-200 text-white shadow-lg"
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
          className="p-3 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-200 text-white shadow-lg"
          aria-label="Next image"
        >
          <FaChevronRight size={28} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-3 z-60">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
              index === currentIndex ? "w-4 h-4 bg-green-400 shadow-lg shadow-green-400/50" : "w-3 h-3 bg-white bg-opacity-60 hover:bg-opacity-100"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
