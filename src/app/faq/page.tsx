"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: "General",
    question: "How long have you been in business?",
    answer:
      "NTS Ltd has been serving Hull and the East Midlands for over 20 years. We've built our reputation on reliability, professionalism, and quality workmanship across residential, commercial, and industrial projects.",
  },
  {
    category: "General",
    question: "Are your engineers qualified and certified?",
    answer:
      "Yes, all our engineers are fully qualified and certified. They hold Gas Safe registration for heating work, F-Gas certification for air conditioning, and are compliant with all building regulations and safety standards.",
  },
  {
    category: "Services",
    question: "What areas do you cover?",
    answer:
      "We serve Hull, East Riding of Yorkshire, North Lincolnshire, and surrounding areas in the East Midlands. We offer both local service calls and larger project work throughout the region.",
  },
  {
    category: "Services",
    question: "Do you offer emergency repairs?",
    answer:
      "Yes! We offer 24/7 emergency HVAC services. Whether your heating fails in winter or air conditioning breaks in summer, call 01482 838080 and our team will respond quickly to get you back up and running.",
  },
  {
    category: "Pricing",
    question: "How much does a service call cost?",
    answer:
      "Service call pricing depends on your specific needs. We offer free consultations to assess your system and provide transparent quotes. Call us at 01482 838080 or fill out our contact form for a free estimate.",
  },
  {
    category: "Pricing",
    question: "What's included in your maintenance packages?",
    answer:
      "Our maintenance packages include system inspections, cleaning, performance testing, and emergency support. Prices vary based on property size and system complexity. Contact us for customized pricing.",
  },
  {
    category: "Heating",
    question: "How often should I service my boiler?",
    answer:
      "We recommend annual boiler servicing to maintain efficiency, ensure safety, and extend the life of your system. This typically costs £100-£200 and can save you money on energy bills long-term.",
  },
  {
    category: "Heating",
    question: "What's the average lifespan of a heating system?",
    answer:
      "Most boilers and heating systems last 10-15 years with proper maintenance. Factors like system type, usage, and maintenance affect longevity. Regular servicing can extend the life significantly.",
  },
  {
    category: "Air Conditioning",
    question: "When should I replace my air conditioning system?",
    answer:
      "Most AC systems last 10-20 years. Consider replacement if your system is over 15 years old, requires frequent repairs, or uses R-22 refrigerant (being phased out). We can help assess if repair or replacement makes sense.",
  },
  {
    category: "Air Conditioning",
    question: "How much does air conditioning installation cost?",
    answer:
      "AC installation costs depend on system size, property type, and complexity. Residential units typically range £3,000-£8,000. We provide free quotes to assess your specific needs.",
  },
  {
    category: "Ventilation",
    question: "Why is ventilation important?",
    answer:
      "Proper ventilation removes moisture, odors, and pollutants from your indoor air. It improves health, prevents mold growth, and maintains system efficiency. Modern ventilation systems also recover heat for energy efficiency.",
  },
  {
    category: "Ventilation",
    question: "What's the difference between exhaust and supply ventilation?",
    answer:
      "Exhaust ventilation removes stale air from your property (bathrooms, kitchens). Supply ventilation brings fresh outside air in. Modern systems combine both for balanced air quality and energy efficiency.",
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...new Set(faqItems.map((item) => item.category))];
  const filteredItems =
    activeCategory === "All"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[400px] flex items-center">
          <div className="mx-auto max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg leading-8 text-gray-300">
                Find answers to common questions about our HVAC services
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    activeCategory === category
                      ? "bg-brand-green-500 text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${activeCategory}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <motion.button
                      onClick={() =>
                        setExpandedIndex(
                          expandedIndex === index ? null : index
                        )
                      }
                      className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-semibold text-brand-green-600 mb-1">
                          {item.category}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedIndex === index ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 ml-4"
                      >
                        <FaChevronDown
                          size={20}
                          style={{ color: "#4caf50" }}
                        />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 bg-gray-50"
                        >
                          <div className="p-6">
                            <p className="text-gray-700 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Didn't find your answer?
              </h3>
              <p className="text-gray-700 mb-6">
                Have a specific question? Contact our team and we'll be happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  Get in Touch
                </a>
                <a
                  href="tel:01482838080"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-all border-2"
                  style={{ borderColor: "#4caf50", color: "#4caf50" }}
                >
                  Call: 01482 838080
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
