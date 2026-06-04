"use client";

import { motion } from "framer-motion";
import { FaShieldAlt, FaCheckCircle, FaAward, FaClock } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

export default function WhyChooseNTS() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const reasons = [
    {
      icon: FaShieldAlt,
      title: "Gas Safe Registered",
      description:
        "All engineers fully accredited and certified to safely work on your heating and gas systems",
    },
    {
      icon: FaAward,
      title: "15+ Years Experience",
      description:
        "Established HVAC specialists serving Hull and East Yorkshire with proven expertise",
    },
    {
      icon: FaClock,
      title: "24/7 Emergency Service",
      description:
        "Rapid response times, typically within 2 hours for emergency breakdowns",
    },
    {
      icon: FaCheckCircle,
      title: "Quality Guarantee",
      description:
        "All work backed by comprehensive warranties and ongoing support",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Why Choose NTS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional HVAC services you can trust. Every project backed by expertise, certifications,
            and commitment to your comfort.
          </p>
        </motion.div>

        {/* Trust Signals Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16"
        >
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="h-full bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-4">
                    <IconComponent
                      size={32}
                      style={{ color: "#4caf50" }}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Industry Certifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { name: "Gas Safe", emoji: "🔒" },
              { name: "F-Gas", emoji: "❄️" },
              { name: "ISO Certified", emoji: "✅" },
              { name: "CHAS", emoji: "🛡️" },
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl mb-2">{cert.emoji}</div>
                <p className="text-gray-900 font-semibold text-sm">{cert.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
