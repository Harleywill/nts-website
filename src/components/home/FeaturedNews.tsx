"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const featured = data.filter((item: NewsItem) => item.featured).slice(0, 3);
        setNews(featured);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return null;
  }

  if (news.length === 0) {
    return null;
  }

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

        <motion.div
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {news.map((item) => (
            <article
              key={item.id}
              className="flex max-w-xl flex-col items-start justify-between hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
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
      </div>
    </section>
  );
}
