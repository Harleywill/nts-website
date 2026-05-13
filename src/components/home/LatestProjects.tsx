"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedHeading from "@/components/common/AnimatedHeading";

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  date: string;
}

export default function LatestProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
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

  if (projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-6 lg:px-8" style={{ backgroundColor: "#101828" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <AnimatedHeading
            text="Latest Projects"
            level="h2"
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white lg:text-5xl"
          />
          <p className="mt-2 text-base sm:text-lg text-gray-300">
            View our recent work and see what we can do for you.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-8 sm:pt-12">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="cursor-grab active:cursor-grabbing h-80 sm:h-[480px] lg:h-[600px]"
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={currentProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white h-full"
                whileHover={{ scale: 1.03, y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <motion.div className="relative w-full h-40 sm:h-56 lg:h-80 overflow-hidden bg-gray-200 flex-shrink-0">
                  <motion.img
                    src={currentProject.imageUrl || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>

                <div className="p-4 sm:p-6 lg:p-8 flex flex-col grow overflow-y-auto">
                  <div className="flex items-center gap-x-3 text-xs sm:text-sm flex-shrink-0">
                    <time dateTime={currentProject.date} className="text-gray-500 font-medium">
                      {new Date(currentProject.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </time>
                    <span
                      className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                      style={{ backgroundColor: "#4caf50" }}
                    >
                      {currentProject.category}
                    </span>
                  </div>

                  <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                    {currentProject.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {currentProject.description}
                  </p>

                  <Link
                    href={`/projects/${currentProject.id}`}
                    className="mt-4 sm:mt-6 inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 hover:gap-3 w-fit text-sm sm:text-base flex-shrink-0"
                    style={{ color: "#4caf50" }}
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center justify-between sm:justify-center gap-4 sm:gap-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
              style={{ color: "#4caf50" }}
              aria-label="Previous project"
            >
              <FaChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {projects.map((_, index) => (
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
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
              style={{ color: "#4caf50" }}
              aria-label="Next project"
            >
              <FaChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-400">
            {currentIndex + 1} of {projects.length}
          </div>
        </div>

        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            style={{ backgroundColor: "#4caf50" }}
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
