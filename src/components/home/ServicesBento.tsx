"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFire, FaWind, FaSnowflake, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const services = [
  {
    id: "plumbing",
    icon: FaFire,
    title: "Plumbing & Heating",
    description: "From residential boiler installations to commercial heating systems, our Gas Safe registered engineers deliver reliable solutions.",
    details: [
      "Gas Safe registered engineers",
      "Emergency repair service 24/7",
      "Boiler installations & maintenance",
      "Heating system design & optimization"
    ],
    link: "/services/plumbing-heating"
  },
  {
    id: "ac",
    icon: FaSnowflake,
    title: "Air Conditioning",
    description: "Cooling systems designed for maximum comfort and energy efficiency year-round.",
    details: [
      "Energy-efficient cooling systems",
      "Installation & maintenance",
      "Preventative maintenance programs",
      "Emergency repairs available"
    ],
    link: "/services/air-conditioning"
  },
  {
    id: "ventilation",
    icon: FaWind,
    title: "Ventilation",
    description: "Professional ventilation systems for improved air quality and healthier indoor environments.",
    details: [
      "Indoor air quality assessment",
      "System design & installation",
      "Regular maintenance & cleaning",
      "Commercial ventilation solutions"
    ],
    link: "/services/ventilation"
  },
  {
    id: "domestic",
    icon: FaCheckCircle,
    title: "Domestic Servicing",
    description: "Regular maintenance and repairs to keep your residential systems running smoothly.",
    details: [
      "Annual boiler servicing",
      "System checks & diagnostics",
      "Parts replacement & upgrades",
      "Warranty & aftercare support"
    ],
    link: "/services/domestic-servicing"
  },
  {
    id: "commercial",
    icon: FaCheckCircle,
    title: "Commercial Servicing",
    description: "Comprehensive solutions for commercial heating and cooling needs.",
    details: [
      "Multi-site support available",
      "Planned maintenance programs",
      "Emergency response teams",
      "Compliance & certification support"
    ],
    link: "/services/commercial-servicing"
  },
  {
    id: "commissioning",
    icon: FaCheckCircle,
    title: "Commissioning",
    description: "Professional system setup, testing, and verification to ensure optimal performance.",
    details: [
      "System startup & testing",
      "Performance verification",
      "Documentation & handover",
      "Staff training provided"
    ],
    link: "/services/commissioning"
  }
];

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

export default function ServicesBento() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = selectedId ? services.find((s) => s.id === selectedId) : null;

  const handleGoToPage = (link: string) => {
    router.push(link);
  };

  return (
    <div className="relative py-20 sm:py-24 overflow-hidden">
      {/* Gradient Blob Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>
            Our Services
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Complete HVAC & Mechanical Solutions
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ pointerEvents: "auto" }}
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                onClick={() => setSelectedId(service.id)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="h-full rounded-2xl bg-white shadow-md p-8 border border-gray-200 hover:border-brand-green-500 transition-all duration-300 flex flex-col justify-between group text-left"
                style={{ pointerEvents: "auto" }}
              >
                <div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-brand-green-500/10 mb-6 group-hover:bg-brand-green-500/20 transition-colors">
                    <Icon size={32} style={{ color: "#4caf50" }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div style={{ color: "#4caf50" }} className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-brand-green-400">
                  Learn More <span aria-hidden="true">→</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Side Panel with AnimatePresence */}
      <AnimatePresence mode="sync">
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelectedId(null)}
              className="fixed left-0 top-0 bottom-0 bg-black/50 z-40"
              style={{ width: "calc(100% - 100%)" }}
            />

            {/* Side Panel - Full screen on mobile */}
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, type: "tween" }}
              className="fixed right-0 top-0 h-full w-full shadow-2xl overflow-y-auto z-50"
              style={{ backgroundColor: "#ffffff", pointerEvents: "auto" }}
            >
              <div className="p-8">
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors"
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
                  <selectedService.icon size={40} style={{ color: "#4caf50" }} />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {selectedService.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mb-8 leading-relaxed"
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h4>
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
                          <span className="text-gray-700">{detail}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Full Page Button */}
                <motion.button
                  onClick={() => handleGoToPage(selectedService.link)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(76, 175, 80, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-8 px-6 py-3 rounded-lg font-semibold text-white text-center transition-all"
                  style={{ backgroundColor: "#4caf50", pointerEvents: "auto" }}
                >
                  View Full Details
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
