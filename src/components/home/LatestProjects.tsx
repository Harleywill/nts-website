"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function LatestProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sync currentIndex with scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || projects.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const itemWidth = containerWidth / 3; // Each card is 1/3 width
      const index = Math.round(scrollLeft / itemWidth);
      const clampedIndex = Math.min(index, projects.length - 3);
      setCurrentIndex(clampedIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [projects.length]);

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
    const maxIndex = Math.max(0, projects.length - 3);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX.current - touchEndX;

    // Swipe left (next)
    if (difference > 50) {
      goToNext();
    }
    // Swipe right (previous)
    else if (difference < -50) {
      goToPrevious();
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-gray-300">No projects yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  const maxScrollIndex = Math.max(0, projects.length - 3);

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
            Latest Projects
          </h2>
          <p className="mt-2 text-lg/8 text-gray-300">
            View our recent work and see what we can do for you.
          </p>
        </motion.div>

        {/* Projects Carousel */}
        <div className="mt-10 border-t border-gray-700 pt-32 sm:pt-40 pb-32">
          <style>{`
            .projects-carousel::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="projects-carousel w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory gap-6 -mx-6 lg:-mx-8 px-6 lg:px-8 cursor-grab active:cursor-grabbing user-select-none"
            style={{ display: "flex", scrollbarWidth: "none", msOverflowStyle: "none", minHeight: "auto", touchAction: "pan-y" }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 snap-center snap-always px-4 sm:px-6 lg:px-8"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex flex-col items-start justify-between bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-md hover:shadow-xl hover:border-green-500 transition-all duration-300 h-[500px]"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={project.imageUrl || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 w-full flex flex-col grow">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={project.date} className="text-gray-400">
                        {new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </time>
                      <span
                        className="rounded-full px-3 py-1.5 font-medium text-white"
                        style={{ backgroundColor: "#4caf50" }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <div className="group relative grow w-full">
                      <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-green-400 transition-colors">
                        <Link href={`/projects/${project.id}`}>
                          <span className="absolute inset-0"></span>
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm/6 text-gray-300">
                        {project.description}
                      </p>
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="mt-6 inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 hover:gap-3"
                      style={{ color: "#4caf50" }}
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ color: "#4caf50" }}
              aria-label="Previous projects"
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
                      index === currentIndex ? "#4caf50" : "rgba(255, 255, 255, 0.2)",
                  }}
                  aria-label={`Go to projects item ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ color: "#4caf50" }}
              aria-label="Next projects"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            style={{ backgroundColor: "#4caf50" }}
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
