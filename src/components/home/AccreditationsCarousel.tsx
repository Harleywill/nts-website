"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AccreditationsCarouselProps {
  title: string;
  accreditations: Array<{ name: string; path: string }>;
}

export default function AccreditationsCarousel({
  title,
  accreditations,
}: AccreditationsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % accreditations.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [accreditations.length]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-xl font-semibold text-navy-900">{title}</h3>
      
      {/* Carousel container */}
      <div className="relative w-full h-32 flex items-center justify-center bg-white rounded-lg overflow-hidden">
        {/* Logo display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center p-6"
        >
          <Image
            src={accreditations[currentIndex].path}
            alt={accreditations[currentIndex].name}
            width={200}
            height={120}
            className="object-contain max-h-full"
            priority={false}
          />
        </motion.div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {accreditations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-green-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to accreditation ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Current accreditation name */}
      <p className="text-sm text-gray-600">
        {accreditations[currentIndex].name}
      </p>
    </div>
  );
}
