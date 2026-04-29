"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Lightbox from "./Lightbox";

interface GalleryProps {
  images: string[];
  title?: string;
}

export default function Gallery({ images, title = "Gallery" }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerWidth = container.offsetWidth;
    const itemWidth = containerWidth / 3;

    container.scrollTo({
      left: itemWidth * index,
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, images.length - 3);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    if (difference > 50) {
      goToNext();
    } else if (difference < -50) {
      goToPrevious();
    }
  };

  const maxScrollIndex = Math.max(0, images.length - 3);

  return (
    <>
      <section className="bg-gray-50 py-16 sm:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {title}
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">
              View more images from this {title.toLowerCase()}
            </p>
          </motion.div>

          {/* Gallery Carousel */}
          <div className="border-t border-gray-200 pt-12">
            <style>{`
              .gallery-carousel::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div
              ref={scrollContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="gallery-carousel w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory gap-6 -mx-6 lg:-mx-8 px-6 lg:px-8 cursor-grab active:cursor-grabbing user-select-none"
              style={{ display: "flex", scrollbarWidth: "none", msOverflowStyle: "none", minHeight: "auto", touchAction: "pan-y" }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 snap-center snap-always px-4 sm:px-6 lg:px-8"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.2 }}
                    onClick={() => handleImageClick(index)}
                    className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 h-64 sm:h-72"
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ color: "#4caf50" }}
                aria-label="Previous images"
              >
                <FaChevronLeft size={24} />
              </button>

              {/* Dot Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: Math.max(1, maxScrollIndex + 1) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentIndex ? "w-8 h-2" : "w-2 h-2"
                    }`}
                    style={{
                      backgroundColor:
                        index === currentIndex ? "#4caf50" : "rgba(0, 0, 0, 0.2)",
                    }}
                    aria-label={`Go to gallery item ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ color: "#4caf50" }}
                aria-label="Next images"
              >
                <FaChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
