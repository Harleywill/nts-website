"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
}

export default function FeaturedNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const featured = data.filter((item: NewsItem) => item.featured);
        setNews(featured);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Sync currentIndex with scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || news.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const itemWidth = containerWidth / 3; // Each card is 1/3 width
      const index = Math.round(scrollLeft / itemWidth);
      const clampedIndex = Math.min(index, news.length - 3);
      setCurrentIndex(clampedIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [news.length]);

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
    const maxIndex = Math.max(0, news.length - 3);
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
    return null;
  }

  if (news.length === 0) {
    return null;
  }

  const maxScrollIndex = Math.max(0, news.length - 3);

  return (
    <section className="bg-white py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Latest News
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Stay updated with our latest news and announcements.
          </p>
        </motion.div>

        {/* News Carousel */}
        <div className="mt-10 border-t border-gray-200 pt-32 sm:pt-40 pb-32">
          <style>{`
            .news-carousel::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="news-carousel w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory gap-6 -mx-6 lg:-mx-8 px-6 lg:px-8 cursor-grab active:cursor-grabbing user-select-none"
            style={{ display: "flex", scrollbarWidth: "none", msOverflowStyle: "none", minHeight: "auto", touchAction: "pan-y" }}
          >
            {news.map((item) => (
              <div
                key={item.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 snap-center snap-always px-4 sm:px-6 lg:px-8"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex flex-col items-start justify-between bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl hover:border-green-500 transition-all duration-300 h-[500px]"
                >
                  {item.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 w-full flex flex-col grow">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={item.createdAt} className="text-gray-500 font-medium">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </time>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: "#4caf50" }}
                      >
                        News
                      </span>
                    </div>

                    <div className="group relative grow w-full">
                      <h3 className="mt-4 text-lg/6 font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        <Link href={`/news/${item.id}`}>
                          <span className="absolute inset-0"></span>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm/6 text-gray-600">
                        {item.content}
                      </p>
                    </div>

                    <Link
                      href={`/news/${item.id}`}
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
              aria-label="Previous news"
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
                  aria-label={`Go to news item ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ color: "#4caf50" }}
              aria-label="Next news"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
