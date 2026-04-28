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
        <section className="bg-gray-900 pt-20 pb-16 sm:pt-32 sm:pb-24 px-6 lg:px-8">
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
                  <article
                    key={item.id}
                    className="flex flex-col items-start justify-between hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                  >
                    {item.imageUrl && (
                      <div className="relative w-full">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="aspect-video w-full rounded-lg bg-gray-100 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-x-4 text-xs mt-6">
                      <time dateTime={item.createdAt} className="text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </time>
                      {item.featured && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: "#4caf50" }}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="group relative grow">
                      <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-blue-900">
                        <Link href={`/news/${item.id}`}>
                          <span className="absolute inset-0"></span>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                        {item.content}
                      </p>
                    </div>

                    <Link
                      href={`/news/${item.id}`}
                      className="mt-6 inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200"
                      style={{ color: "#4caf50" }}
                    >
                      Read More →
                    </Link>
                  </article>
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
