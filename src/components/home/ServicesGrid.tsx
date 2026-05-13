"use client";

import { motion } from "framer-motion";
import AnimatedHeading from "@/components/common/AnimatedHeading";
import Link from "next/link";
import { FaArrowRight, FaFaucet, FaWind, FaHome, FaBuilding, FaSnowflake, FaCheckCircle } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";
import { useInView } from "react-intersection-observer";

const iconMap: { [key: string]: React.ReactNode } = {
  FaFaucet: <FaFaucet size={40} />,
  FaWind: <FaWind size={40} />,
  FaHome: <FaHome size={40} />,
  FaBuilding: <FaBuilding size={40} />,
  FaSnowflake: <FaSnowflake size={40} />,
  FaCheckCircle: <FaCheckCircle size={40} />,
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
          <AnimatedHeading
            text="Our Services"
            level="h2"
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#ffffff" }}
          />
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
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4"
              style={{ borderColor: "#4caf50" }}
            >
              <div
                className="mb-4 inline-block p-3 rounded-lg"
                style={{ backgroundColor: "#101828", color: "#4caf50" }}
              >
                {iconMap[service.icon] || <FaCheckCircle size={40} />}
              </div>

              <h3
                className="text-xl font-bold mb-3"
                style={{ color: "#ffffff" }}
              >
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              <Link
                href={`/services/${service.id}`}
                className="inline-flex items-center gap-2 font-semibold transition-colors duration-200 group-hover:text-green-600"
                style={{ color: "#4caf50" }}
              >
                Learn More
                <FaArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
