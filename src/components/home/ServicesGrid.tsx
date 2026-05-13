"use client";

import { useRouter } from "next/navigation";
import { FaArrowRight, FaFaucet, FaWind, FaHome, FaBuilding, FaSnowflake, FaCheckCircle } from "react-icons/fa";
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

  const handleCardClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <section
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828", pointerEvents: "auto", position: "relative", zIndex: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ pointerEvents: "auto", position: "relative", zIndex: 1 }}>
        <div className="text-center mb-16" style={{ pointerEvents: "auto", position: "relative" }}>
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

        <div className="grid md:grid-cols-3 gap-8 [&>:nth-child(4)]:md:col-start-2 [&>:nth-child(n+4)]:md:place-self-center" style={{ pointerEvents: "auto", position: "relative", zIndex: 1 }}>
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service, idx) => (
            <button
              key={service.id}
              onClick={() => handleCardClick(service.id)}
              className="group rounded-2xl shadow-md p-8 transition-all duration-300 border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col h-full hover:scale-105 hover:-translate-y-1 hover:shadow-lg w-full text-left bg-transparent"
              style={{ backgroundColor: "#1f2937", pointerEvents: "auto", position: "relative", zIndex: 1 }}
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
