import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { FaFire, FaWind, FaSnowflake, FaTools, FaCheckCircle } from "react-icons/fa";

export const metadata = {
  title: "Services - NTS Ltd",
  description: "Explore our comprehensive HVAC and mechanical services for residential and commercial clients.",
};

const services = [
  {
    id: "plumbing-heating",
    title: "Plumbing & Heating",
    icon: FaFire,
    description: "Complete plumbing and heating solutions for residential and commercial properties. From new boiler installations and radiator systems to emergency repairs and ongoing maintenance. All work carried out by Gas Safe registered engineers.",
  },
  {
    id: "ventilation",
    title: "Ventilation",
    icon: FaWind,
    description: "Professional ventilation system design, installation, and maintenance. We ensure optimal airflow and air quality while maximizing energy efficiency. Suitable for homes, offices, and industrial facilities.",
  },
  {
    id: "domestic-commercial-servicing",
    title: "Domestic & Commercial Servicing",
    icon: FaTools,
    description: "Regular maintenance and servicing for all mechanical and electrical building systems. Preventative care to avoid costly breakdowns, covering boilers, heating systems, air conditioning, and more across residential and commercial properties.",
  },
  {
    id: "air-conditioning",
    title: "Air Conditioning",
    icon: FaSnowflake,
    description: "Complete air conditioning solutions from system design and professional installation to routine maintenance and emergency repairs. F-Gas registered engineers ensure safe, efficient cooling for homes and businesses.",
  },
  {
    id: "commissioning",
    title: "Commissioning",
    icon: FaCheckCircle,
    description: "Thorough system testing, verification, and optimization of HVAC and mechanical systems. We ensure your systems operate at peak performance and energy efficiency before handover and throughout their lifespan.",
  },
];

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Complete HVAC & Mechanical Solutions for Every Need
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-50 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="group h-full rounded-2xl bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-500"
                  >
                    <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                      <Icon size={32} style={{ color: "#4caf50" }} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-600" style={{ color: "#4caf50" }}>
                      Learn More <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
