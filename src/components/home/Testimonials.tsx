"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedHeading from "@/components/common/AnimatedHeading";
import Image from "next/image";
import { useLogoVersion } from "@/hooks/useLogoVersion";
import { useCarousel } from "@/hooks/useCarousel";

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

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(d => setTestimonials(Array.isArray(d) ? d : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const { setCurrentIndex, itemsToShow, translateX, transition, totalSlots,
          extendSlides, dotCount, activeDot, rangeStart, rangeEnd,
          goToPrevious, goToNext, handleTouchStart, handleTouchEnd } = useCarousel(testimonials.length);

  if (loading || testimonials.length === 0) return null;

  return (
    // Light section: lets the engineering-drawing watermark show through and
    // breaks up the run of dark sections on the homepage.
    <section className="py-14 sm:py-20 lg:py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 lg:text-5xl"
          />
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Real feedback from satisfied customers across the UK
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-10 border-t border-gray-200 pt-8 sm:pt-12">
          <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div
              className="flex"
              style={{
                width: `${(totalSlots / itemsToShow) * 100}%`,
                transform: `translateX(${translateX}%)`,
                transition,
              }}
            >
              {extendSlides(testimonials).map((testimonial, idx) => (
                <div key={`${testimonial.id}-${idx}`} style={{ width: `${100 / totalSlots}%`, padding: "0 12px" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (idx % itemsToShow) * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 25px -5px rgba(76, 175, 80, 0.2)", transition: { duration: 0.2 } }}
                    className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md h-full"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div className="p-4 sm:p-6 flex flex-col grow">
                      <div className="flex gap-1 mb-4 sm:mb-6 flex-shrink-0">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <FaStar key={i} size={16} style={{ color: "#4caf50" }} />
                        ))}
                      </div>

                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-4 mb-4 sm:mb-6 flex-grow">
                        "{testimonial.text}"
                      </p>

                      <div className="border-t border-gray-100 pt-4 sm:pt-6 flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{testimonial.company}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={goToPrevious}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(76,175,80,0.15)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.3)" }}
              aria-label="Previous testimonials"
            >
              <FaChevronLeft size={16} />
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: dotCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: index === activeDot ? "32px" : "8px",
                    height: "8px",
                    backgroundColor: index === activeDot ? "#4caf50" : "rgba(26,47,110,0.15)",
                  }}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(76,175,80,0.15)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.3)" }}
              aria-label="Next testimonials"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            {rangeStart}–{rangeEnd} of {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
}
