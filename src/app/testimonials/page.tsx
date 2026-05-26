"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import DuctWaves from "@/components/common/DuctWaves";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                What Our Clients Say
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Real feedback from satisfied customers across the UK
              </p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="relative isolate overflow-hidden py-24 sm:py-32 px-6 lg:px-8 bg-white"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: `
              conic-gradient(from 90deg at 1px 1px, #0000 25%, #e0e0e0 0),
              linear-gradient(45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0),
              linear-gradient(-45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0)
            `,
            backgroundSize: '1em 1em, 2em 2em, 2em 2em',
            backgroundPosition: '-0.5px -0.5px, 0 0, 0 0'
          }}
        >
          <div className="mx-auto max-w-7xl relative z-10">
            {/* Title Section */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Testimonials
              </h2>
              <p className="mt-2 text-lg/8 text-gray-600">
                Hear from our satisfied customers about their experience with NTS Ltd.
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No testimonials items available yet.</p>
              </div>
            ) : (
              <motion.div
                className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-green-500 transition-all duration-300 h-full p-6"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <FaStar key={i} size={16} style={{ color: "#4caf50" }} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 leading-relaxed mb-6 flex-grow text-sm/6">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-semibold text-gray-900" style={{ color: "#1a2f6e" }}>
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Ready to Experience Our Service?
                </h2>
                <a
                  href="/contact"
                  className="rounded-lg px-8 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg inline-block"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  Get in Touch Today
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
