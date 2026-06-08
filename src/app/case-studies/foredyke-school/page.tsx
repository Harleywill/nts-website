"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FaCheckCircle, FaChartLine, FaClock } from "react-icons/fa";

export default function ForedykeSchoolCaseStudy() {
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
              <p className="text-brand-green-400 font-semibold mb-2">Case Study</p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                Foredyke School HVAC Overhaul
              </h1>
              <p className="text-lg leading-8 text-gray-300 mb-8">
                How NTS installed a complete heating and control system for a major school expansion
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-brand-green-400 font-bold text-2xl">£180K</p>
                  <p className="text-gray-300 text-sm">Project Value</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-brand-green-400 font-bold text-2xl">3 months</p>
                  <p className="text-gray-300 text-sm">Duration</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <p className="text-brand-green-400 font-bold text-2xl">25%</p>
                  <p className="text-gray-300 text-sm">Energy Savings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Case Study Content */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Foredyke School in Hull was undergoing a major expansion, adding new classrooms and facilities. The existing heating system was inadequate for the expanded building, and the school needed a modern, efficient solution that could be monitored remotely.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Key requirements included:
              </p>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <FaCheckCircle className="text-brand-green-600 flex-shrink-0 mt-1" />
                  <span>Reliable heating for 15,000+ sq ft of new space</span>
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-brand-green-600 flex-shrink-0 mt-1" />
                  <span>Energy-efficient operation to reduce running costs</span>
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-brand-green-600 flex-shrink-0 mt-1" />
                  <span>Remote monitoring and control via internet</span>
                </li>
                <li className="flex gap-3">
                  <FaCheckCircle className="text-brand-green-600 flex-shrink-0 mt-1" />
                  <span>Compliance with building regulations</span>
                </li>
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16 bg-gray-50 p-8 rounded-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                NTS designed and installed a complete HVAC system tailored to the school's requirements:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">System Components:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• High-efficiency condensing boiler (150 kW)</li>
                    <li>• Air handling units (AHUs) for all zones</li>
                    <li>• Underfloor heating in new classrooms</li>
                    <li>• Zone-based thermostatic controls</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Control System:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• BMS (Building Management System)</li>
                    <li>• Remote internet monitoring</li>
                    <li>• Automated scheduling for school hours</li>
                    <li>• Energy usage analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Results & Impact</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border-l-4 border-green-600 pl-6 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FaChartLine className="text-brand-green-600" />
                    <p className="font-bold text-gray-900">25% Energy Savings</p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Reduced annual heating costs by £4,500 through efficient system design
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-6 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="text-brand-green-600" />
                    <p className="font-bold text-gray-900">100% Uptime</p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    System running reliably 24/7 with remote monitoring
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-6 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="text-brand-green-600" />
                    <p className="font-bold text-gray-900">Full Compliance</p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Exceeds building regulations and environmental standards
                  </p>
                </div>
              </div>

              <blockquote className="border-l-4 border-green-600 pl-6 italic text-gray-700 text-lg">
                "NTS delivered an excellent solution on time and within budget. The system works perfectly, and the remote monitoring gives us peace of mind. We couldn't be happier with the result."
              </blockquote>
              <p className="text-gray-600 mt-2">— Facilities Manager, Foredyke School</p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 border border-green-200 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Need a Similar Solution?
              </h3>
              <p className="text-gray-700 mb-6">
                Whether you're expanding your facility or upgrading your HVAC system, NTS can deliver a tailored solution.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#4caf50" }}
              >
                Get Your Free Consultation
              </Link>
            </motion.div>

            {/* Related Case Studies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 pt-16 border-t border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Projects</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/case-studies/commercial-office-complex"
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h4 className="font-bold text-gray-900 mb-2">
                    Commercial Office Complex Ventilation
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Modern ventilation system for 50,000 sq ft office building
                  </p>
                </Link>

                <Link
                  href="/case-studies/industrial-commissioning"
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h4 className="font-bold text-gray-900 mb-2">
                    Industrial Facility Commissioning
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Complete system commissioning for manufacturing plant
                  </p>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
