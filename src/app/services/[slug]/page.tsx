"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const serviceData: Record<
  string,
  {
    title: string;
    description: string;
    imageUrl: string;
    content: string;
    features: string[];
    whyChoose: string;
  }
> = {
  "plumbing-heating": {
    title: "Plumbing & Heating Services",
    description:
      "Professional plumbing and heating solutions for residential and commercial properties",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Our plumbing and heating services are designed to keep your systems running efficiently. Whether you need a new boiler installation, emergency plumbing repair, or regular maintenance, our Gas Safe registered engineers are here to help.",
    features: [
      "Boiler installations and replacements",
      "Central heating system design and installation",
      "Pipe repairs and replacements",
      "Bathroom and kitchen plumbing",
      "Emergency call-out services",
      "Annual maintenance and servicing",
      "System upgrades and modernization",
    ],
    whyChoose:
      "We understand that plumbing and heating issues can't wait. Our team responds quickly, diagnoses problems accurately, and provides lasting solutions. All our engineers are fully qualified and Gas Safe registered.",
  },
  "air-conditioning": {
    title: "Air Conditioning Services",
    description: "Reliable cooling solutions for comfort and energy efficiency",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Our air conditioning services provide year-round cooling solutions for residential and commercial spaces. From installation to maintenance and emergency repairs, we ensure your systems operate at peak efficiency.",
    features: [
      "Air conditioning system installation",
      "System design and consultation",
      "Regular maintenance and servicing",
      "Refrigerant top-ups and repairs",
      "Energy efficiency audits",
      "Emergency breakdown support",
      "Commercial multi-unit systems",
    ],
    whyChoose:
      "We partner with leading manufacturers to provide reliable, efficient cooling systems. Our technicians are fully trained in the latest technologies and committed to delivering superior customer service.",
  },
  ventilation: {
    title: "Ventilation Services",
    description: "Improve indoor air quality with professional ventilation solutions",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Good ventilation is essential for healthy indoor environments. Our ventilation services ensure proper airflow, reduce humidity, and eliminate stale air in residential and commercial spaces.",
    features: [
      "Ventilation system design and installation",
      "Extractor fan installation and repair",
      "Heat recovery ventilation (HRV) systems",
      "Ductwork installation and cleaning",
      "Air quality assessments",
      "Maintenance and servicing",
      "Energy-efficient ventilation solutions",
    ],
    whyChoose:
      "We understand the importance of proper ventilation for health and comfort. Our engineers design systems tailored to your space's unique needs, ensuring optimal air quality and efficiency.",
  },
  "domestic-servicing": {
    title: "Domestic Servicing",
    description: "Regular maintenance to keep your home systems running smoothly",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Regular servicing keeps your home's mechanical systems in top condition. Our domestic servicing packages are designed to prevent breakdowns and extend the lifespan of your equipment.",
    features: [
      "Annual boiler servicing",
      "Air conditioning checks and cleaning",
      "Ventilation system maintenance",
      "System inspections and diagnostics",
      "Preventative maintenance plans",
      "Emergency repairs",
      "Parts replacement and upgrades",
    ],
    whyChoose:
      "Preventative maintenance saves you money in the long run. Our technicians identify potential issues before they become expensive problems, keeping your home comfortable year-round.",
  },
  "commercial-servicing": {
    title: "Commercial HVAC Services",
    description: "Large-scale mechanical and electrical solutions for businesses",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Our commercial HVAC services support businesses of all sizes. From office buildings to industrial facilities, we provide comprehensive solutions tailored to your operational needs.",
    features: [
      "Commercial HVAC system design and installation",
      "Large-scale heating and cooling systems",
      "Building automation and controls",
      "Ductwork and ductless solutions",
      "Preventative maintenance contracts",
      "24/7 emergency support",
      "Energy efficiency upgrades",
      "Commissioning and testing",
    ],
    whyChoose:
      "We understand that business continuity is critical. Our team works efficiently to minimize downtime and ensure your facilities maintain optimal climate control.",
  },
  commissioning: {
    title: "System Commissioning Services",
    description: "Professional system setup, testing, and verification",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    content:
      "Commissioning is the final critical step in any system installation. We ensure your heating, cooling, and ventilation systems are properly configured, tested, and optimized for peak performance.",
    features: [
      "System commissioning and start-up",
      "Performance testing and verification",
      "Controls calibration and programming",
      "Documentation and handover",
      "Staff training",
      "Seasonal adjustments",
      "Remedial work and fine-tuning",
    ],
    whyChoose:
      "Proper commissioning prevents future problems and ensures your systems operate exactly as designed. Our engineers conduct thorough testing to guarantee reliability and efficiency.",
  },
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = serviceData[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24">
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
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="rounded-lg w-full h-96 object-cover shadow-lg"
                />
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
                    Our {service.title}
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
                    Why Choose Us
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
