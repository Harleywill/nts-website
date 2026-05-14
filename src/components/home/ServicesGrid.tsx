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

// Variants for side panel slide
const panelVariants = {
  hidden: { x: 400, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
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

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => (
            <motion.button
              key={service.id}
              variants={cardVariants}
              onClick={() => handleCardClick(service.id)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-2xl shadow-md p-8 transition-all duration-300 border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col h-full w-full text-left bg-transparent"
              style={{ backgroundColor: "#1f2937" }}
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
        </motion.div>
      </div>

      {/* Side Panel with AnimatePresence */}
      <AnimatePresence mode="sync">
        {selectedService && (
          <>
            {/* Backdrop - only covers left side (grid area) */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelectedId(null)}
              className="fixed left-0 top-0 bottom-0 bg-black/50 z-40"
              style={{ width: "calc(100% - 384px)" }}
            />

            {/* Side Panel */}
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, type: "tween" }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl overflow-y-auto z-50"
              style={{ backgroundColor: "#1a1f2e" }}
            >
              <div className="p-8">
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
