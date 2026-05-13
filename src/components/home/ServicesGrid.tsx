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
    setExpandedId(serviceId);
  };

  const handleGoToPage = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  const expandedService = expandedId ? SERVICES.find((s) => s.id === expandedId) : null;

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

        {/* Modal Backdrop */}
        {expandedId && (
          <div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            onClick={() => setExpandedId(null)}
          >
            {expandedService && (
              <div
                className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <FaTimes size={28} />
                </button>

                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-green-500/10">
                  <div style={{ color: "#4caf50" }}>
                    {iconMap[expandedService.icon] || <FaCheckCircle size={40} />}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-white mb-4">
                  {expandedService.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {expandedService.description}
                </p>

                {/* What's Included */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-4">What's Included:</h4>
                  <div className="space-y-3">
                    {expandedService.details &&
                      expandedService.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span style={{ color: "#4caf50" }} className="text-xl mt-0.5 flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-gray-300 text-base">{detail}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleGoToPage(expandedService.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:gap-3"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  View Full Service <FaArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => (
            <button
              key={service.id}
              onClick={() => handleCardClick(service.id)}
              className="group rounded-2xl shadow-md border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col p-8 transition-all duration-300 text-left"
              style={{
                backgroundColor: "#1f2937",
              }}
            >
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <div style={{ color: "#4caf50" }}>
                  {iconMap[service.icon] || <FaCheckCircle size={36} />}
                </div>
              </div>

              <h3 className="font-semibold text-xl mb-3 text-white">
                {service.title}
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>

              <div
                className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                style={{ color: "#4caf50" }}
              >
                Learn More <FaArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
