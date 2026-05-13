"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaFire, FaWind, FaSnowflake, FaCheckCircle, FaTimes } from "react-icons/fa";
import Link from "next/link";

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

export default function ServicesBento() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="relative py-24 sm:py-32 overflow-hidden bg-gray-900">
      {/* Gradient Blob Background */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>
            Our Services
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Complete HVAC & Mechanical Solutions
          </p>
        </div>

        {/* Desktop/Tablet: Traditional Grid */}
        <div className="hidden md:block">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              const isExpanded = expanded === service.id;

              return (
                <div key={service.id}>
                  <motion.div
                    className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 sm:p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer lg:cursor-auto"
                    onClick={() => setExpanded(isExpanded ? null : service.id)}
                    layoutId={`service-${service.id}`}
                  >
                    {!isExpanded ? (
                      <>
                        <div>
                          <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition-colors">
                            <Icon size={28} style={{ color: "#4caf50" }} />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{service.title}</h3>
                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{service.description}</p>
                        </div>
                        <button
                          className="mt-4 h-11 sm:h-auto sm:mt-6 inline-flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2 font-semibold transition-colors hover:text-green-400 sm:text-base text-sm py-2"
                          style={{ color: "#4caf50" }}
                          aria-expanded="false"
                        >
                          Learn More <span aria-hidden="true">→</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-white flex-1">{service.title}</h3>
                            <button onClick={(e) => { e.stopPropagation(); setExpanded(null); }} className="text-gray-400 hover:text-white ml-2">
                              <FaTimes size={20} />
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm sm:text-base mb-4">{service.description}</p>
                          <div className="space-y-2">
                            {service.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span style={{ color: "#4caf50" }}>✓</span>
                                <span className="text-gray-300 text-sm">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={service.link}
                          className="mt-4 sm:mt-6 inline-flex items-center gap-2 font-semibold text-sm sm:text-base transition-colors hover:text-green-400"
                          style={{ color: "#4caf50" }}
                        >
                          Full Details <span aria-hidden="true">→</span>
                        </Link>
                      </>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile: 2-Column Grid with Expand Animation */}
        <div className="md:hidden">
          <motion.div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(2, 1fr)"
            }}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isExpanded = expanded === service.id;
              const isLastOdd = idx === services.length - 1 && services.length % 2 === 1 && !expanded;

              return (
                <motion.div
                  key={service.id}
                  className={`rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 border border-gray-700/50 hover:border-green-500/50 cursor-pointer flex flex-col justify-between ${
                    isExpanded ? "col-span-2" : ""
                  } ${isLastOdd ? "col-span-2 mx-auto max-w-xs" : ""}`}
                  onClick={() => setExpanded(isExpanded ? null : service.id)}
                  layout
                  layoutId={`service-mobile-${service.id}`}
                  transition={{
                    layout: { duration: 0.4, ease: "easeInOut" },
                  }}
                  animate={{
                    height: isExpanded ? "auto" : "auto"
                  }}
                  style={{
                    minHeight: isExpanded ? "384px" : undefined
                  }}
                >
                  {!isExpanded ? (
                    <>
                      <div>
                        <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-3">
                          <Icon size={24} style={{ color: "#4caf50" }} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
                      </div>
                      <button
                        className="mt-3 inline-flex items-center gap-2 font-semibold text-sm transition-colors hover:text-green-400"
                        style={{ color: "#4caf50" }}
                      >
                        Learn More <span aria-hidden="true">→</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="inline-block p-3 rounded-lg bg-green-500/10">
                            <Icon size={24} style={{ color: "#4caf50" }} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpanded(null);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <FaTimes size={20} />
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                        <div className="space-y-2">
                          {service.details.map((detail, didx) => (
                            <div key={didx} className="flex items-start gap-2">
                              <span style={{ color: "#4caf50" }}>✓</span>
                              <span className="text-gray-300 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={service.link}
                        className="mt-4 inline-flex items-center gap-2 font-semibold text-sm transition-colors hover:text-green-400"
                        style={{ color: "#4caf50" }}
                      >
                        Full Details <span aria-hidden="true">→</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
