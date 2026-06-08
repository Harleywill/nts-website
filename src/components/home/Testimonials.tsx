"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedHeading from "@/components/common/AnimatedHeading";
import Image from "next/image";
import { useLogoVersion } from "@/hooks/useLogoVersion";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  rating: number;
  text: string;
}

export default function Testimonials() {
  const logoVersion = useLogoVersion();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const touchStartX = useRef(0);

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

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsToShow) : prev - 1
    );
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, testimonials.length - itemsToShow);
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsToShow);
  const maxIndex = Math.max(0, testimonials.length - itemsToShow);

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-6 lg:px-8" style={{ backgroundColor: "#101828" }}>
      <div className="mx-auto max-w-7xl">
        {/* NTS Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <Image
            src={logoVersion === "old" ? "/images/ntsLogo-old.png" : "/images/ntsLogo.png"}
            alt="NTS Ltd Logo"
            width={140}
            height={70}
            className="h-12 w-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-2xl text-center mb-8 sm:mb-12"
        >
          <AnimatedHeading
            text="What Our Clients Say"
            level="h2"
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white lg:text-5xl"
          />
          <p className="mt-2 text-base sm:text-lg text-gray-300">
            Real feedback from satisfied customers across the UK
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-8 sm:pt-12">
          {/* Testimonials Grid with Sliding Animation */}
          <motion.div
            ref={{ current: null }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            layout
          >
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-700 shadow-md h-full"
                style={{ backgroundColor: "#1f2937" }}
                whileHover={{ scale: 1.05, y: -6, boxShadow: "0 20px 25px -5px rgba(76, 175, 80, 0.2)" }}
              >
                <div className="p-4 sm:p-6 lg:p-6 flex flex-col grow">
                  <div className="flex gap-1 mb-4 sm:mb-6 flex-shrink-0">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <FaStar key={i} size={16} className="sm:w-5 sm:h-5" style={{ color: "#4caf50" }} />
                    ))}
                  </div>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-4 mb-4 sm:mb-6 flex-grow">
                    "{testimonial.text}"
                  </p>

                  <div className="border-t border-gray-700 pt-4 sm:pt-6 flex-shrink-0">
                    <p className="font-semibold text-white text-sm sm:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
              style={{ color: "#4caf50" }}
              aria-label="Previous testimonials"
            >
              <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 h-2" : "w-2 h-2"
                  }`}
                  style={{
                    backgroundColor:
                      index === currentIndex ? "#4caf50" : "rgba(255, 255, 255, 0.2)",
                  }}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
              style={{ color: "#4caf50" }}
              aria-label="Next testimonials"
            >
              <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-400">
            {currentIndex + 1}-{Math.min(currentIndex + itemsToShow, testimonials.length)} of {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}
