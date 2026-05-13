"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      setExpandedId(null);
    } else {
      setExpandedId(serviceId);
    }
  };

  const handleGoToPage = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
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

        {/* Services Grid */}
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => {
            const isExpanded = expandedId === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                className="group rounded-2xl shadow-md border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col p-8 transition-all duration-300 text-left"
                style={{
                  backgroundColor: "#1f2937",
                  gridColumn: isExpanded ? "span 2" : "span 1",
                  minHeight: isExpanded ? "500px" : "auto",
                  pointerEvents: "auto",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                  <div style={{ color: "#4caf50" }}>
                    {iconMap[service.icon] || <FaCheckCircle size={36} />}
                  </div>
                </div>

                <h3 className="font-semibold text-xl mb-3 text-white" style={{ fontSize: isExpanded ? "24px" : "20px" }}>
                  {service.title}
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed flex-grow" style={{ fontSize: isExpanded ? "15px" : "14px" }}>
                  {service.description}
                </p>

                {isExpanded && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">What's Included:</h4>
                    <div className="space-y-2">
                      {service.details &&
                        service.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span style={{ color: "#4caf50" }} className="text-lg flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-gray-300 text-sm">{detail}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div
                    className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                    style={{ color: "#4caf50" }}
                  >
                    {isExpanded ? "View Full" : "Learn More"} <FaArrowRight size={14} />
                  </div>

                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToPage(service.id);
                      }}
                      className="px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200"
                      style={{ backgroundColor: "#4caf50" }}
                    >
                      Full Page
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
