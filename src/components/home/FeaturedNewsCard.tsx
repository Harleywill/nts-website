'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function FeaturedNewsCard() {
  const [featured, setFeatured] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        // Fetch all news and find the one marked as featured
        // For now, we'll use the most recent article
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setFeatured(data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  if (loading || !featured) {
    return null;
  }

  // Extract excerpt from content (first 160 chars)
  const excerpt = featured.content.substring(0, 160) + (featured.content.length > 160 ? '...' : '');
  const publishDate = new Date(featured.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-nts-green hover:shadow-xl transition-shadow duration-300"
        >
          {/* Image */}
          {featured.imageUrl && (
            <div className="relative h-64 lg:h-80 w-full overflow-hidden bg-gray-200">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            {/* Featured label */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs font-bold text-nts-green uppercase tracking-wider mb-3 w-fit"
            >
              Featured News
            </motion.span>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {featured.title}
            </motion.h3>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-700 leading-relaxed mb-6 text-base"
            >
              {excerpt}
            </motion.p>

            {/* Meta + CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <time className="text-sm text-gray-500">{publishDate}</time>
              <Link
                href={`/news/${featured.id}`}
                className="inline-flex items-center gap-2 text-nts-green hover:text-green-700 font-semibold transition-all duration-200 group"
              >
                Read More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
