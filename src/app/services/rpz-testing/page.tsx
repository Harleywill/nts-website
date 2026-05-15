"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RPZTestingPage() {
  const service = {
    title: "RPZ Testing",
    description: "Professional testing and certification of Reduced Pressure Zone devices for water safety compliance",
    imageUrl: "/images/services/rpz-testing.jpg",
    content: "Reduced Pressure Zone (RPZ) devices are critical components in protecting water quality and preventing contamination through backflow. Our certified engineers provide professional testing and certification of RPZ devices to ensure they are functioning correctly and meeting all regulatory requirements. We conduct thorough inspections, functional tests, and documentation to keep your water supply safe and compliant with Water Regulations.",
    features: [
      "Professional RPZ device testing and inspection",
      "Annual certification and re-certification",
      "Functional performance testing",
      "Compliance with Water Regulations",
      "Detailed testing documentation and reports",
      "Backflow prevention verification",
      "Device maintenance recommendations",
      "Installation of new RPZ devices",
      "Emergency testing services available",
      "Scheduled maintenance programs",
      "Expert regulatory guidance",
      "Full traceability and record keeping",
    ],
    whyChoose: "Our certified engineers specialise in water safety and regulatory compliance. We ensure your RPZ devices protect your water supply effectively while meeting all legal requirements. With comprehensive testing, clear documentation, and expert guidance, we provide complete peace of mind for your water safety.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                {service.title}
              </h1>
              <p className="text-lg leading-8 text-gray-300">
                {service.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section - Image Left, Text Right */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
          style={{
            backgroundImage: `
              conic-gradient(from 90deg at 0.5px 0.5px, #0000 25%, #f0f0f0 0),
              linear-gradient(45deg, #0000 calc(50% - 0.25px), #f0f0f0 0 calc(50% + 0.25px), #0000 0),
              linear-gradient(-45deg, #0000 calc(50% - 0.25px), #f0f0f0 0 calc(50% + 0.25px), #0000 0)
            `,
            backgroundSize: '1em 1em, 2em 2em, 2em 2em',
            backgroundPosition: 'calc(-1 * 0.25px) calc(-1 * 0.25px), 0 0, 0 0'
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority={false}
                  />
                </div>
              </motion.div>

              {/* Right - Text */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.content}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What We Offer:
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <span
                          style={{ color: "#4caf50" }}
                          className="font-bold text-lg flex-shrink-0"
                        >
                          ✓
                        </span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Why Choose NTS Ltd
                  </h3>
                  <p className="text-gray-700">{service.whyChoose}</p>
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-4">
                  <a
                    href="/contact"
                    className="rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#4caf50" }}
                  >
                    Get a Free Quote
                  </a>
                  <Link
                    href="/services"
                    className="rounded-md px-6 py-3 font-semibold transition-colors border-2"
                    style={{ borderColor: "#4caf50", color: "#4caf50" }}
                  >
                    Back to Services
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
