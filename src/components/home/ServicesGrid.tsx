"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes, FaFaucet, FaWind, FaHome, FaBuilding, FaSnowflake, FaCheckCircle, FaTint } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";

const iconMap: { [key: string]: React.ReactNode } = {
  FaFaucet: <FaFaucet size={36} />,
  FaWind: <FaWind size={36} />,
  FaHome: <FaHome size={36} />,
  FaBuilding: <FaBuilding size={36} />,
  FaSnowflake: <FaSnowflake size={36} />,
  FaCheckCircle: <FaCheckCircle size={36} />,
  FaTint: <FaTint size={36} />,
};

// Variants for staggered container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Variants for individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Variants for inline card expansion
const overlayCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

// Variants for backdrop fade
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ServicesGrid() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCardClick = (serviceId: string) => {
    setSelectedId(serviceId);
  };

  const handleGoToPage = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  const handleCloseExpanded = () => {
    setSelectedId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCloseExpanded();
    }
  };

  const selectedService = selectedId ? SERVICES.find((s) => s.id === selectedId) : null;

  return (
    <section
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
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

        {/* Trust Message Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 p-6 rounded-lg text-center border border-brand-green-500/30"
          style={{ backgroundColor: "rgba(76, 175, 80, 0.08)" }}
        >
          <p className="text-lg font-semibold text-white flex items-center justify-center gap-2">
            <span style={{ color: "#4caf50" }}>✓</span>
            We respond within 24 hours
            <span style={{ color: "#4caf50" }}>•</span>
            Expert engineers
            <span style={{ color: "#4caf50" }}>•</span>
            Fast, reliable service
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="relative grid md:grid-cols-3 gap-8 z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ pointerEvents: "auto" }}
        >
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => handleCardClick(service.id)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-2xl shadow-md p-8 transition-all duration-300 border border-gray-700 hover:border-brand-green-500 cursor-pointer flex flex-col h-full w-full text-left bg-transparent"
              style={{ backgroundColor: "#1f2937", pointerEvents: "auto" }}
            >
              <div
                className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 group-hover:bg-brand-green-500/20"
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
        </motion.div>
      </div>

      {/* Inline Card Expansion with AnimatePresence */}
      <AnimatePresence mode="wait">
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleCloseExpanded}
              onKeyDown={handleKeyDown}
              className="fixed inset-0 bg-black/40 z-40"
              tabIndex={-1}
            />

            {/* Inline Expanded Card */}
            <motion.div
              key="card"
              variants={overlayCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full mx-4 sm:mx-0 sm:w-auto max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8"
              style={{ backgroundColor: "#1f2937", maxWidth: "650px" }}
            >
              {/* Close Button */}
              <motion.button
                onClick={handleCloseExpanded}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes size={24} />
              </motion.button>

              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-lg"
                style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
              >
                <div style={{ color: "#4caf50" }}>
                  {iconMap[selectedService.icon] || <FaCheckCircle size={40} />}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {selectedService.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 mb-8 leading-relaxed"
              >
                {selectedService.description}
              </motion.p>

              {/* What's Included */}
              {selectedService.details && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-4">What's Included:</h4>
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05, delayChildren: 0.3 }}
                  >
                    {selectedService.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3"
                      >
                        <span style={{ color: "#4caf50" }} className="text-lg flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-300">{detail}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Full Page Button */}
              <motion.button
                onClick={() => handleGoToPage(selectedService.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(76, 175, 80, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-8 px-6 py-3 rounded-lg font-semibold text-white text-center transition-all"
                style={{ backgroundColor: "#4caf50" }}
              >
                View Full Details
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
