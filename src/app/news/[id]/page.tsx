"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/common/Gallery";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  gallery?: string[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news`);
        const data = await res.json();
        const item = data.find((n: NewsItem) => n.id === parseInt(id as string));
        setNews(item);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  return (
    <>
      <Navbar />

      {loading ? (
        <div className="bg-white min-h-screen py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : !news ? (
        <div className="bg-white min-h-screen py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-gray-600">News article not found.</p>
            <Link href="/" className="text-green-600 hover:text-green-700 mt-4 inline-block font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section with Dark Background */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-16 sm:py-24 px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Back Button */}
                <Link
                  href="/"
                  className="text-green-500 hover:text-green-400 font-semibold mb-8 inline-block transition-colors"
                >
                  ← Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-x-4 text-sm mb-6">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: "#4caf50" }}
                    >
                      News
                    </span>
                    <time dateTime={news.createdAt} className="text-gray-400 font-medium">
                      {new Date(news.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
                    {news.title}
                  </h1>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white py-16 sm:py-24 px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Featured Image - Floated Right */}
                {news.imageUrl && (
                  <div className="float-right w-full sm:w-80 ml-6 mb-6 rounded-xl overflow-hidden shadow-md border-4 border-gray-200">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-base sm:text-lg">
                    {news.content}
                  </p>
                </div>

                {/* CTA */}
                <div className="border-t border-gray-200 pt-12">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: "#4caf50" }}
                  >
                    ← Back to Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Gallery Section */}
          {news.gallery && news.gallery.length > 0 && (
            <Gallery images={news.gallery} title={`${news.title} Gallery`} />
          )}
        </>
      )}

      <Footer />
    </>
  );
}
