"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface GoogleReview {
  id: number;
  reviewerName: string;
  reviewerTitle: string | null;
  reviewText: string;
  rating: number;
  googleUrl: string;
}

export default function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={20} style={{ color: "#f59e0b" }} />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
            Verified Reviews from Google
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by customers across the UK
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, index) => (
            <motion.a
              key={review.id}
              href={review.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group block"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full transition-all hover:shadow-lg hover:border-green-400">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} size={16} style={{ color: "#f59e0b" }} />
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-900">
                    {review.reviewerName}
                  </p>
                  {review.reviewerTitle && (
                    <p className="text-sm text-gray-600">{review.reviewerTitle}</p>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {review.reviewText}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-brand-green-600 group-hover:text-green-700 font-semibold text-sm">
                  <span>Read on Google</span>
                  <span>→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.google.com/maps/search/NTS+Ltd+Hull"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border-2 border-brand-green-500 text-brand-green-600 font-semibold rounded-lg hover:bg-brand-green-50 transition-colors"
          >
            View All Reviews on Google →
          </a>
        </div>
      </div>
    </section>
  );
}
