"use client";

import { motion } from "framer-motion";
import { FaStar, FaGoogle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    author: "James Wilson",
    rating: 5,
    text: "Excellent service! Engineers arrived on time, fixed the issue quickly, and explained everything clearly. Highly recommended!",
    date: "2 weeks ago",
  },
  {
    author: "Amanda Clarke",
    rating: 5,
    text: "Best HVAC company in Hull. They sorted my boiler emergency within 2 hours. Professional and affordable. Will use again.",
    date: "1 month ago",
  },
  {
    author: "David Thompson",
    rating: 5,
    text: "Installed new air conditioning system. Work was done perfectly, on budget, and on schedule. Very impressed with the team.",
    date: "6 weeks ago",
  },
];

export default function GoogleReviewsPromo() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-white"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaGoogle size={24} style={{ color: "#4caf50" }} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Rated 4.8★ on Google
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by hundreds of satisfied customers in Hull and across the region
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12"
        >
          {mockReviews.map((review, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} size={16} style={{ color: "#4caf50" }} />
                ))}
              </div>

              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{review.text}"
              </p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 text-sm">
                  {review.author}
                </p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border border-green-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Had a great experience?
          </h3>
          <p className="text-gray-700 mb-6">
            Share your feedback on Google to help other customers find us
          </p>
          <a
            href="https://www.google.com/search?q=NTS+Ltd+Hull"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#4caf50" }}
          >
            <FaGoogle size={18} />
            Leave a Review on Google
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-sm">
            ⭐ <strong>4.8 out of 5 stars</strong> based on{" "}
            <strong>45+ verified Google reviews</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
