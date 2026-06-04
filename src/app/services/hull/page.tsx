"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaCheckCircle, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Link from "next/link";

export default function HullServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 min-h-[400px] flex items-center">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-green-400 font-semibold mb-2 flex items-center justify-center gap-2">
                <FaMapMarkerAlt /> Serving Hull & East Yorkshire
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                Professional HVAC Services in Hull
              </h1>
              <p className="text-lg leading-8 text-gray-300 mb-8">
                Gas Safe registered engineers delivering heating, cooling, and ventilation solutions for residential and commercial properties across Hull and the surrounding region.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  <FaPhone size={18} />
                  Get a Free Quote
                </Link>
                <a
                  href="tel:01482838080"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  <FaPhone size={18} />
                  Call: 01482 838080
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services in Hull */}
        <section className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What We Offer in Hull
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive HVAC and mechanical services for every type of property
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Heating Systems",
                  description: "Installation, maintenance, and repairs of boilers, radiators, and underfloor heating",
                },
                {
                  title: "Air Conditioning",
                  description: "Commercial and domestic cooling systems with expert installation and servicing",
                },
                {
                  title: "Ventilation",
                  description: "Mechanical ventilation systems for offices, commercial kitchens, and residential",
                },
                {
                  title: "Plumbing Services",
                  description: "Gas Safe registered engineers for all plumbing and heating work",
                },
                {
                  title: "Emergency Repairs",
                  description: "24/7 emergency breakdown service with typical response under 2 hours",
                },
                {
                  title: "System Commissioning",
                  description: "Professional commissioning and handover of all mechanical systems",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1 text-xl" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-700">{service.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                We Serve All of Hull & Beyond
              </h2>
              <p className="text-lg text-gray-600">
                Based in Hull with coverage across East Yorkshire and beyond
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-lg border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 mb-4">Primary Service Areas</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    Hull City Centre
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    Cottingham & Hessle
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    Willerby & Kirkella
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    East Hull & Bilton
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    West Hull & Anlaby
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-lg border border-gray-200"
              >
                <h3 className="font-bold text-gray-900 mb-4">Extended Coverage</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    East Yorkshire
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    North Lincolnshire
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    South Yorkshire
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    Humber Region
                  </li>
                  <li className="flex gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0 mt-1" />
                    By Appointment Nationwide
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose NTS in Hull */}
        <section className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose NTS for Your Hull Property?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: "🏆",
                  title: "15+ Years Experience",
                  description: "Established HVAC specialists serving Hull and the region since 2009",
                },
                {
                  icon: "✅",
                  title: "Gas Safe Registered",
                  description: "All engineers fully accredited and certified to work safely on your systems",
                },
                {
                  icon: "⚡",
                  title: "Emergency Response",
                  description: "24/7 emergency service with response times typically under 2 hours",
                },
                {
                  icon: "💷",
                  title: "Transparent Pricing",
                  description: "Clear, upfront quotes with no hidden charges or surprise costs",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center bg-gray-50 p-8 rounded-lg"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-28 px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Ready to Upgrade Your HVAC System?
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Get a free consultation from our Hull-based engineers. We'll assess your property and provide a transparent quote.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#4caf50" }}
              >
                Get Your Free Consultation
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
