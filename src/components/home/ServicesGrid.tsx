"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaFaucet, FaWind, FaHome, FaBuilding, FaSnowflake, FaCheckCircle } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";
import { useInView } from "react-intersection-observer";

const iconMap: { [key: string]: React.ReactNode } = {
  FaFaucet: <FaFaucet size={36} />,
  FaWind: <FaWind size={36} />,
  FaHome: <FaHome size={36} />,
  FaBuilding: <FaBuilding size={36} />,
  FaSnowflake: <FaSnowflake size={36} />,
  FaCheckCircle: <FaCheckCircle size={36} />,
};

export default function ServicesGrid() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 lg:py-28"
      style={{ backgroundColor: "#101828" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
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

        <motion.div
          className="grid md:grid-cols-3 gap-8 [&>:nth-child(4)]:md:col-start-2 [&>:nth-child(n+4)]:md:place-self-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {SERVICES.filter((service) => service.id !== "commercial-servicing").map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <motion.div
                variants={cardVariants}
                className="group rounded-2xl shadow-md p-8 transition-all duration-300 border border-gray-700 hover:border-green-500 cursor-pointer flex flex-col h-full"
                style={{ backgroundColor: "#1f2937" }}
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
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
