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
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  const handleCardClick = (serviceId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedId === serviceId) {
      // If clicking the expanded card's button, navigate
      router.push(`/services/${serviceId}`);
    } else {
      // Get the card's position before expanding
      const target = e?.currentTarget as HTMLElement;
      if (target) {
        setCardRect(target.getBoundingClientRect());
      }
      // If clicking a collapsed card, expand it
      setExpandedId(serviceId);
    }
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828", pointerEvents: "auto", position: "relative", zIndex: 1 }}
    >
      {/* Backdrop overlay */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpandedId(null)}
            className="fixed inset-0 bg-black/40 z-40"
            style={{ pointerEvents: "auto" }}
          />
        )}
      </AnimatePresence>

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

        <div className="grid md:grid-cols-3 gap-8" style={{ pointerEvents: "auto", position: "relative", zIndex: 1 }}>
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service, idx) => {
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                className={isExpanded ? "md:col-span-1" : ""}
                style={{
                  position: isExpanded ? "fixed" : "relative",
                  ...(isExpanded && cardRect ? {
                    top: "50%",
                    left: "50%",
                    marginLeft: "-500px",
                    width: "1000px",
                    zIndex: 50,
                  } : {}),
                }}
                animate={isExpanded ? {
                  x: cardRect ? window.innerWidth / 2 - cardRect.left - cardRect.width / 2 : 0,
                  y: cardRect ? window.innerHeight / 2 - cardRect.top - cardRect.height / 2 : 0,
                } : {
                  x: 0,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <motion.button
                  onClick={(e) => handleCardClick(service.id, e)}
                  className={`group rounded-2xl shadow-md border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col w-full text-left bg-transparent relative p-8`}
                  style={{
                    backgroundColor: "#1f2937",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10,
                  }}
                  animate={{
                    minHeight: isExpanded ? "600px" : "auto",
                    paddingTop: isExpanded ? "48px" : "32px",
                    paddingBottom: isExpanded ? "48px" : "32px",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  initial={false}
                  whileHover={!isExpanded ? { scale: 1.05, y: -4 } : {}}
                >
                  <div
                    className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 group-hover:bg-green-500/20"
                    style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
                  >
                    <div style={{ color: "#4caf50" }}>
                      {iconMap[service.icon] || <FaCheckCircle size={isExpanded ? 48 : 36} />}
                    </div>
                  </div>

                  <motion.h3
                    className="font-semibold mb-3 text-white"
                    animate={{
                      fontSize: isExpanded ? "28px" : "20px",
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-300 mb-6 leading-relaxed flex-grow"
                    animate={{
                      fontSize: isExpanded ? "16px" : "14px",
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {service.description}
                  </motion.p>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4 mb-8"
                    >
                      <h4 className="text-lg font-semibold text-white">What's Included:</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {service.details && service.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span style={{ color: "#4caf50" }} className="text-lg mt-1 flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-gray-300 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                      style={{ color: "#4caf50" }}
                    >
                      {isExpanded ? "Go to Full Page" : "Learn More"}
                      <FaArrowRight size={isExpanded ? 18 : 14} className="transition-transform" />
                    </div>

                    {isExpanded && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
                      >
                        <FaTimes size={28} />
                      </motion.button>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
