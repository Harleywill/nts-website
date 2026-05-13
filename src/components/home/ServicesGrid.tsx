"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes, FaFaucet, FaWind, FaHome, FaBuilding, FaSnowflake, FaCheckCircle } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";

const iconMap: { [key: string]: React.ReactNode } = {
  FaFaucet: <FaFaucet size={36} />,
  FaWind: <FaWind size={36} />,
  FaHome: <FaHome size={36} />,
  FaBuilding: <FaBuilding size={36} />,
  FaSnowflake: <FaSnowflake size={36} />,
  FaCheckCircle: <FaCheckCircle size={36} />,
};

export default function ServicesGrid() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCardClick = (serviceId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedId(serviceId);
  };

  const handleNavigate = (serviceId: string) => {
    setExpandedId(null);
    router.push(`/services/${serviceId}`);
  };

  const expandedService = expandedId ? SERVICES.find(s => s.id === expandedId) : null;

  return (
    <section
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828", pointerEvents: "auto", position: "relative", zIndex: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ pointerEvents: "auto", position: "relative", zIndex: 1 }}>
        <motion.div
          className="text-center mb-16"
          style={{ pointerEvents: "auto", position: "relative" }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#ffffff" }}
          >
            Our Services
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Comprehensive mechanical and electrical services tailored to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 [&>:nth-child(4)]:md:col-start-2 [&>:nth-child(n+4)]:md:place-self-center" style={{ pointerEvents: "auto", position: "relative", zIndex: 1 }}>
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service, idx) => (
            <motion.button
              key={service.id}
              onClick={(e) => handleCardClick(service.id, e)}
              className="group rounded-2xl shadow-md p-8 transition-all duration-300 border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col h-full w-full text-left bg-transparent"
              style={{ backgroundColor: "#1f2937", pointerEvents: "auto", position: "relative", zIndex: 1 }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div
                className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 group-hover:bg-green-500/20"
                style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
              >
                <div style={{ color: "#4caf50" }}>
                  {iconMap[service.icon] || <FaCheckCircle size={36} />}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">
                {service.title}
              </h3>

              <p className="text-gray-300 mb-6 text-sm leading-relaxed flex-grow">
                {service.description}
              </p>

              <div
                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                style={{ color: "#4caf50" }}
              >
                Learn More
                <FaArrowRight
                  size={14}
                  className="transition-transform"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {expandedService && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedId(null)}
              className="fixed inset-0 bg-black/50 z-40"
              style={{ pointerEvents: "auto" }}
            />

            {/* Expanded Card */}
            <motion.div
              key="expanded-card"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-2xl rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]"
              style={{ backgroundColor: "#1f2937", pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 sm:p-12">
                {/* Close Button */}
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <FaTimes size={24} />
                </button>

                {/* Icon */}
                <div
                  className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg"
                  style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
                >
                  <div style={{ color: "#4caf50" }}>
                    {iconMap[expandedService.icon] || <FaCheckCircle size={40} />}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  {expandedService.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-base leading-relaxed mb-8">
                  {expandedService.description}
                </p>

                {/* Details List */}
                <div className="mb-8 space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Features:</h3>
                  {/* Placeholder details - could be expanded with service.details if available */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span style={{ color: "#4caf50" }} className="text-lg mt-1">✓</span>
                      <span className="text-gray-300">Professional expertise and certified engineers</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span style={{ color: "#4caf50" }} className="text-lg mt-1">✓</span>
                      <span className="text-gray-300">24/7 emergency support available</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span style={{ color: "#4caf50" }} className="text-lg mt-1">✓</span>
                      <span className="text-gray-300">Comprehensive solutions tailored to your needs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span style={{ color: "#4caf50" }} className="text-lg mt-1">✓</span>
                      <span className="text-gray-300">Competitive pricing with no hidden costs</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleNavigate(expandedService.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:gap-3"
                  style={{ backgroundColor: "#4caf50" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More <FaArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
