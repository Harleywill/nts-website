"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedHeading from "@/components/common/AnimatedHeading";
import { getCropStyles, getCropContainerStyles } from "@/lib/image-crop";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  featured: boolean;
  createdAt: string;
}

export default function FeaturedNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data.filter((item: NewsItem) => item.featured));
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const maxIndex = Math.max(0, news.length - itemsToShow);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));

  const goToNext = () =>
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrevious();
  };

  if (loading || news.length === 0) return null;

  const translateX = -(currentIndex * (100 / news.length));

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-6 lg:px-8" style={{ backgroundColor: "#101828" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <AnimatedHeading
            text="Latest News"
            level="h2"
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white lg:text-5xl"
          />
          <p className="mt-2 text-base sm:text-lg text-gray-300">
            Stay updated with our latest news and announcements.
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-10 border-t border-gray-700 pt-8 sm:pt-12">
          {/* Sliding track */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              className="flex"
              animate={{ x: `${translateX}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: `${(news.length / itemsToShow) * 100}%` }}
            >
              {news.map((newsItem, idx) => (
                <div
                  key={newsItem.id}
                  style={{ width: `${100 / news.length}%`, padding: "0 12px" }}
                >
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (idx % itemsToShow) * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 25px -5px rgba(76, 175, 80, 0.2)", transition: { duration: 0.2 } }}
                    className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md h-full bg-white"
                  >
                    {newsItem.imageUrl && (
                      <div
                        className="relative w-full h-40 sm:h-56 overflow-hidden bg-gray-600 flex-shrink-0"
                        style={getCropContainerStyles(newsItem.cropWidth, newsItem.cropHeight)}
                      >
                        <motion.img
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          className="w-full h-full object-cover"
                          style={getCropStyles(newsItem.cropX, newsItem.cropY, newsItem.cropWidth, newsItem.cropHeight)}
                          whileHover={{ scale: 1.08, transition: { duration: 0.4 } }}
                        />
                      </div>
                    )}

                    <div className="p-4 sm:p-6 flex flex-col grow">
                      <div className="flex items-center gap-x-3 text-xs sm:text-sm flex-shrink-0">
                        <time dateTime={newsItem.createdAt} className="text-gray-600 font-medium">
                          {new Date(newsItem.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </time>
                        <span
                          className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                          style={{ backgroundColor: "#4caf50" }}
                        >
                          News
                        </span>
                      </div>

                      <h3 className="mt-3 sm:mt-4 text-lg font-semibold text-gray-900">
                        {newsItem.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {newsItem.content}
                      </p>

                      <Link
                        href={`/news/${newsItem.id}`}
                        className="mt-4 sm:mt-6 inline-flex items-center gap-2 font-semibold transition-all duration-200 w-fit text-sm"
                        style={{ color: "#4caf50" }}
                      >
                        Read More →
                      </Link>
                    </div>
                  </motion.article>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={goToPrevious}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(76,175,80,0.15)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.3)" }}
              aria-label="Previous news"
            >
              <FaChevronLeft size={16} />
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: index === currentIndex ? "32px" : "8px",
                    height: "8px",
                    backgroundColor: index === currentIndex ? "#4caf50" : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to news set ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(76,175,80,0.15)", color: "#4caf50", border: "1px solid rgba(76,175,80,0.3)" }}
              aria-label="Next news"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-400">
            {currentIndex + 1}–{Math.min(currentIndex + itemsToShow, news.length)} of {news.length}
          </div>
        </div>
      </div>
    </section>
  );
}
