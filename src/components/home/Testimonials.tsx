"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Sync currentIndex with actual scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Calculate which card is in view based on scroll position
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);

      // Clamp index to valid range
      const clampedIndex = Math.min(index, testimonials.length - 1);
      setCurrentIndex(clampedIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [testimonials.length]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.offsetWidth; // Use actual container width

    container.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });

    // Update index (will also be synced by scroll listener)
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    scrollToIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    scrollToIndex((currentIndex + 1) % testimonials.length);
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* NTS Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/images/ntsLogo.png"
            alt="NTS Ltd Logo"
            width={140}
            height={70}
            className="h-12 w-auto"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-300">
            Real feedback from satisfied customers across the UK
          </p>
        </motion.div>

        {/* Testimonials Carousel - Each card takes full container width */}
        <div
          ref={scrollContainerRef}
          data-carousel
          className="w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory gap-6 px-0"
          style={{
            display: "flex",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            [data-carousel]::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-none w-full snap-center snap-always px-3 md:px-4"
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.5 }}
                className="flex flex-col rounded-2xl bg-gray-800 p-8 sm:p-12 border border-gray-700 min-h-96"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <FaStar key={i} size={18} style={{ color: "#4caf50" }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg leading-relaxed text-gray-100 mb-8 flex-grow overflow-hidden line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-gray-700 pt-6">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.company}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-6">
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
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 h-2" : "w-2 h-2"
                }`}
                style={{
                  backgroundColor:
                    index === currentIndex ? "#4caf50" : "rgba(255, 255, 255, 0.2)",
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
