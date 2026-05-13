"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const handleCardClick = (serviceId: string) => {
    if (expandedId === serviceId) {
      router.push(`/services/${serviceId}`);
    } else {
      setExpandedId(serviceId);
    }
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#ffffff" }}
          >
            Our Services
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Comprehensive mechanical and electrical services tailored to your needs
          </p>
        </div>

        {expandedId && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setExpandedId(null)}
            style={{ pointerEvents: "auto" }}
          />
        )}

        <div className="grid md:grid-cols-3 gap-8" style={{ position: "relative", zIndex: 1 }}>
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => {
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                animate={{
                  width: isExpanded ? "900px" : "100%",
                  height: isExpanded ? "600px" : "auto",
                  position: isExpanded ? "fixed" : "relative",
                  top: isExpanded ? "50%" : "auto",
                  left: isExpanded ? "50%" : "auto",
                  x: isExpanded ? "-50%" : "0%",
                  y: isExpanded ? "-50%" : "0%",
                  zIndex: isExpanded ? 50 : 10,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <motion.button
                  onClick={() => handleCardClick(service.id)}
                  className={`group rounded-2xl shadow-md border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col w-full text-left bg-transparent relative p-8 transition-all duration-300 h-full`}
                  style={{
                    backgroundColor: "#1f2937",
                  }}
                >
                  <div
                    className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg transition-all duration-300 group-hover:bg-green-500/20"
                    style={{ backgroundColor: "rgba(76, 175, 80, 0.1)" }}
                  >
                    <div style={{ color: "#4caf50" }}>
                      {iconMap[service.icon] || <FaCheckCircle size={36} />}
                    </div>
                  </div>

                  <h3 className="font-semibold mb-3 text-white" style={{ fontSize: isExpanded ? "28px" : "20px" }}>
                    {service.title}
                  </h3>

                  <p className="text-gray-300 mb-6 leading-relaxed flex-grow" style={{ fontSize: isExpanded ? "16px" : "14px" }}>
                    {service.description}
                  </p>

                  {isExpanded && (
                    <div className="space-y-4 mb-8">
                      <h4 className="text-lg font-semibold text-white">What's Included:</h4>
                      <div className="space-y-2">
                        {service.details && service.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span style={{ color: "#4caf50" }} className="text-lg mt-1 flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-gray-300 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
                      >
                        <FaTimes size={28} />
                      </button>
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
