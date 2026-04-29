"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 h-20 bg-transparent z-50">
        <Navbar />
      </div>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-900 pt-24 pb-24 sm:py-32 lg:pt-24 px-6 lg:px-8 min-h-[550px] flex items-center">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                News & Updates
              </h1>
              <p className="mt-4 text-lg/8 text-gray-300">
                Stay informed about the latest developments and announcements from NTS Ltd.
              </p>
            </motion.div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-24 sm:py-32 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading news...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No news items available yet.</p>
              </div>
            ) : (
              <motion.div
                className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {news.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col items-start justify-between bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-green-500 transition-all duration-300 h-full"
                  >
                    {item.imageUrl && (
                      <div className="relative w-full overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="w-full p-6 flex flex-col grow">
                      <div className="flex items-center gap-x-3 text-xs mb-4">
                        <time dateTime={item.createdAt} className="text-gray-500 font-medium">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </time>
                        {item.featured && (
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: "#4caf50" }}
                          >
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="group relative grow w-full">
                        <h3 className="text-lg/7 font-bold text-gray-900 group-hover:text-green-600 transition-colors">
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
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
