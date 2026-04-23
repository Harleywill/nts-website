"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SAMPLE_TESTIMONIALS } from "@/lib/constants";
import Image from "next/image";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) =>
      prev === 0 ? SAMPLE_TESTIMONIALS.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_TESTIMONIALS.length);
  };

  const testimonial = SAMPLE_TESTIMONIALS[currentIndex];

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Gradient Blob Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#1a2f6e] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        {/* NTS Logo */}
        <Image
          src="/images/ntsLogo.png"
          alt="NTS Ltd Logo"
          width={140}
          height={70}
          className="mx-auto h-12 w-auto"
        />

        <figure className="mt-10">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9"
            >
              <p>"{testimonial.text}"</p>
            </motion.blockquote>
          </AnimatePresence>

          <motion.figcaption
            key={`caption-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <div className="flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold" style={{ color: "#1a2f6e" }}>
                {testimonial.name}
              </div>
              <svg
                viewBox="0 0 2 2"
                width="3"
                height="3"
                aria-hidden="true"
                className="fill-gray-400"
              >
                <circle r="1" cx="1" cy="1" />
              </svg>
              <div className="text-gray-600">{testimonial.company}</div>
            </div>
          </motion.figcaption>
        </figure>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: "#4caf50" }}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {SAMPLE_TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoPlay(false);
                  setCurrentIndex(index);
                }}
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
            className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: "#4caf50" }}
            aria-label="Next testimonial"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
