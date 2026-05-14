"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
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
    title: "Plumbing & Heating",
    description:
      "Complete plumbing and heating solutions from domestic tap replacements to large commercial systems",
    imageUrl: "/images/services/plumbing-heating.jpg",
    content:
      "Our highly experienced engineers deliver comprehensive plumbing and heating solutions for both domestic and commercial properties. We handle everything from small domestic repairs to large-scale commercial installations. All our engineers are Gas Safe registered and qualified to all relevant regulations concerning building, water, and gas work, ensuring your systems are installed and maintained to the highest standards.",
    features: [
      "Complete system installation and design",
      "Above-ground drainage systems",
      "Underground water supply installation",
      "Electric convertor equipment installation",
      "Oil and gas-fired heating systems",
      "Underfloor heating systems",
      "Heat pump unit installation and maintenance",
      "Emergency call-out services available",
      "Annual maintenance and servicing",
      "System upgrades and modernization",
    ],
    whyChoose:
      "With engineers qualified in all relevant building, water, and gas regulations, we deliver compliant, reliable solutions. Our team handles projects of all sizes with precision and professionalism, backed by continuous training to keep up with industry standards.",
  },
  ventilation: {
    title: "Ventilation",
    description:
      "Professional ventilation systems designed for optimal airflow and indoor air quality",
    imageUrl: "/images/services/ventilation.jpg",
    content:
      "Good ventilation is essential for healthy indoor environments. Our team works with you to identify the most efficient and cost-effective ventilation solutions tailored to your building's unique requirements. We design and install systems that maximize airflow, reduce humidity, and improve overall air quality in residential, commercial, and industrial spaces.",
    features: [
      "Fan coil units installation and maintenance",
      "Heat recovery ventilation (HRV) systems",
      "Extract systems design and installation",
      "Input air systems (heated and cooled variants)",
      "Point of use extract systems for service bays",
      "Exhaust extraction for workshops and facilities",
      "Complete system design and consultation",
      "Airflow optimization and balancing",
      "Regular maintenance and servicing",
      "Energy-efficient ventilation solutions",
    ],
    whyChoose:
      "Our engineers work closely with you to understand your building's specific airflow needs and develop efficient solutions. We combine technical expertise with a commitment to finding the most cost-effective option for your space.",
  },
  "domestic-commercial-servicing": {
    title: "Domestic & Commercial Servicing",
    description:
      "Comprehensive maintenance for all mechanical and electrical building systems",
    imageUrl: "/images/services/domestic and comercial servicing.jpg",
    content:
      "We provide comprehensive servicing for all mechanical and electrical systems in domestic, commercial, and industrial buildings. Our highly trained and accredited engineers maintain expertise across a wide range of equipment and systems. Whether it's routine maintenance or emergency repairs, we keep your systems running efficiently and reliably.",
    features: [
      "Plumbing and heating system servicing",
      "Ventilation system maintenance",
      "Air conditioning checks and cleaning",
      "Oil-fired equipment servicing",
      "Compressed air system maintenance",
      "Gas lifting and control systems",
      "Electrical installations and maintenance",
      "Approved Aga-Rayburn service",
      "Approved Benoni, Powrmatic, and Ambirad service",
      "24/7 emergency breakdown support",
      "Preventative maintenance contracts",
      "System inspections and diagnostics",
    ],
    whyChoose:
      "Our team of highly trained and accredited engineers brings precision craftsmanship to every service call. As approved service agents for major manufacturers, we deliver reliable maintenance that extends equipment life and prevents costly breakdowns.",
  },
  "air-conditioning": {
    title: "Air Conditioning",
    description:
      "Professional cooling solutions from design through installation and ongoing maintenance",
    imageUrl: "/images/services/airconditioning.jpg",
    content:
      "We deliver complete air conditioning solutions for residential and commercial spaces. From initial feasibility studies and system design through installation and ongoing maintenance, our F-Gas registered engineers ensure your systems operate efficiently year-round. We're approved contractors for leading manufacturers including Mitsubishi Electric, Toshiba, Daikin, and Panasonic.",
    features: [
      "Air conditioning system design and consultation",
      "Installation of domestic and commercial units",
      "Approved contractor for Mitsubishi Electric",
      "Approved contractor for Toshiba",
      "Approved contractor for Daikin",
      "Approved contractor for Panasonic",
      "F-Gas registered engineers",
      "System feasibility and assessment",
      "Regular maintenance and servicing",
      "Emergency repair and breakdown support",
      "Energy efficiency optimization",
      "Customized service packages",
    ],
    whyChoose:
      "As F-Gas registered engineers and approved contractors for major manufacturers, we deliver expert installation and maintenance. We combine technical expertise with partnerships with leading brands to provide reliable, efficient cooling solutions tailored to your needs.",
  },
  commissioning: {
    title: "Commissioning",
    description:
      "Professional system testing, verification, and optimization for peak performance",
    imageUrl: "/images/services/comissioning.jpg",
    content:
      "Commissioning is the critical final step that ensures your mechanical and electrical systems operate at optimal performance. Our engineers conduct comprehensive testing and verification of all systems, addressing any performance concerns and optimizing energy consumption. For existing equipment, we diagnose efficiency issues and deliver solutions. For new installations, we design and commission bespoke control systems tailored to your exact requirements.",
    features: [
      "New system commissioning and start-up",
      "Comprehensive performance testing",
      "Control system design and programming",
      "Bespoke control system design",
      "Existing equipment assessment and optimization",
      "Energy consumption analysis",
      "Operating condition optimization",
      "Compliance verification with energy regulations",
      "Preventative recommendations",
      "No-obligation consultations available",
      "Competitive budget solutions",
      "Expert control and mechanical integration",
    ],
    whyChoose:
      "Our engineers provide unique expertise spanning both the control systems and the mechanical systems themselves. This integrated approach ensures your systems are perfectly optimized for performance and efficiency, delivering ongoing energy savings and reliable operation.",
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
