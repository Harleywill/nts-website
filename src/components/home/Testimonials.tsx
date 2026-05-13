"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goToPage = (index: number) => {
    setCurrentIndex(index);
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

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl mb-2 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Real feedback from satisfied customers across the UK
          </p>
        </motion.div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="cursor-grab active:cursor-grabbing max-w-2xl mx-auto h-80 sm:h-[380px] lg:h-[420px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col rounded-2xl bg-gray-50 p-4 sm:p-6 lg:p-10 border border-gray-200 h-full overflow-y-auto"
              whileHover={{ scale: 1.03, y: -8, boxShadow: "0 20px 25px -5px rgba(76, 175, 80, 0.2)" }}
            >
              <div className="flex gap-1 mb-4 sm:mb-6 flex-shrink-0">
                {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                  <FaStar key={i} size={16} className="sm:w-5 sm:h-5" style={{ color: "#4caf50" }} />
                ))}
              </div>

              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 mb-6 sm:mb-8">
                "{currentTestimonial.text}"
              </p>

              <div className="border-t border-gray-200 pt-4 sm:pt-6 flex-shrink-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {currentTestimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {currentTestimonial.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-between sm:justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
            style={{ color: "#4caf50" }}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <div className="flex gap-2 flex-wrap justify-center">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 h-2" : "w-2 h-2"
                }`}
                style={{
                  backgroundColor:
                    index === currentIndex ? "#4caf50" : "rgba(0, 0, 0, 0.2)",
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
            style={{ color: "#4caf50" }}
            aria-label="Next testimonial"
          >
            <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
          {currentIndex + 1} of {testimonials.length}
        </div>
      </div>
    </section>
  );
}
