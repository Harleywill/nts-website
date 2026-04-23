import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

const serviceData: Record<string, { title: string; description: string; content: string }> = {
  "plumbing-heating": {
    title: "Plumbing & Heating Services",
    description: "Professional plumbing and heating solutions for residential and commercial properties",
    content: `
    Our plumbing and heating services are designed to keep your systems running efficiently. Whether you need a new boiler installation, emergency plumbing repair, or regular maintenance, our Gas Safe registered engineers are here to help.

    **What We Offer:**
    - Boiler installations and replacements
    - Central heating system design and installation
    - Pipe repairs and replacements
    - Bathroom and kitchen plumbing
    - Emergency call-out services
    - Annual maintenance and servicing
    - System upgrades and modernization

    **Why Choose Us:**
    We understand that plumbing and heating issues can't wait. Our team responds quickly, diagnoses problems accurately, and provides lasting solutions. All our engineers are fully qualified and Gas Safe registered.
    `,
  },
  "air-conditioning": {
    title: "Air Conditioning Services",
    description: "Reliable cooling solutions for comfort and energy efficiency",
    content: `
    Our air conditioning services provide year-round cooling solutions for residential and commercial spaces. From installation to maintenance and emergency repairs, we ensure your systems operate at peak efficiency.

    **What We Offer:**
    - Air conditioning system installation
    - System design and consultation
    - Regular maintenance and servicing
    - Refrigerant top-ups and repairs
    - Energy efficiency audits
    - Emergency breakdown support
    - Commercial multi-unit systems

    **Why Choose Us:**
    We partner with leading manufacturers to provide reliable, efficient cooling systems. Our technicians are fully trained in the latest technologies and committed to delivering superior customer service.
    `,
  },
  "ventilation": {
    title: "Ventilation Services",
    description: "Improve indoor air quality with professional ventilation solutions",
    content: `
    Good ventilation is essential for healthy indoor environments. Our ventilation services ensure proper airflow, reduce humidity, and eliminate stale air in residential and commercial spaces.

    **What We Offer:**
    - Ventilation system design and installation
    - Extractor fan installation and repair
    - Heat recovery ventilation (HRV) systems
    - Ductwork installation and cleaning
    - Air quality assessments
    - Maintenance and servicing
    - Energy-efficient ventilation solutions

    **Why Choose Us:**
    We understand the importance of proper ventilation for health and comfort. Our engineers design systems tailored to your space's unique needs, ensuring optimal air quality and efficiency.
    `,
  },
  "domestic-servicing": {
    title: "Domestic Servicing",
    description: "Regular maintenance to keep your home systems running smoothly",
    content: `
    Regular servicing keeps your home's mechanical systems in top condition. Our domestic servicing packages are designed to prevent breakdowns and extend the lifespan of your equipment.

    **What We Offer:**
    - Annual boiler servicing
    - Air conditioning checks and cleaning
    - Ventilation system maintenance
    - System inspections and diagnostics
    - Preventative maintenance plans
    - Emergency repairs
    - Parts replacement and upgrades

    **Why Choose Us:**
    Preventative maintenance saves you money in the long run. Our technicians identify potential issues before they become expensive problems, keeping your home comfortable year-round.
    `,
  },
  "commercial": {
    title: "Commercial HVAC Services",
    description: "Large-scale mechanical and electrical solutions for businesses",
    content: `
    Our commercial HVAC services support businesses of all sizes. From office buildings to industrial facilities, we provide comprehensive solutions tailored to your operational needs.

    **What We Offer:**
    - Commercial HVAC system design and installation
    - Large-scale heating and cooling systems
    - Building automation and controls
    - Ductwork and ductless solutions
    - Preventative maintenance contracts
    - 24/7 emergency support
    - Energy efficiency upgrades
    - Commissioning and testing

    **Why Choose Us:**
    We understand that business continuity is critical. Our team works efficiently to minimize downtime and ensure your facilities maintain optimal climate control.
    `,
  },
  "commissioning": {
    title: "System Commissioning Services",
    description: "Professional system setup, testing, and verification",
    content: `
    Commissioning is the final critical step in any system installation. We ensure your heating, cooling, and ventilation systems are properly configured, tested, and optimized for peak performance.

    **What We Offer:**
    - System commissioning and start-up
    - Performance testing and verification
    - Controls calibration and programming
    - Documentation and handover
    - Staff training
    - Seasonal adjustments
    - Remedial work and fine-tuning

    **Why Choose Us:**
    Proper commissioning prevents future problems and ensures your systems operate exactly as designed. Our engineers conduct thorough testing to guarantee reliability and efficiency.
    `,
  },
};

export const metadata = {
  title: "Service Details - NTS Ltd",
};

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = serviceData[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {service.description}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg prose-gray max-w-none">
              {service.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.trim().startsWith("**")) {
                  const [title, ...rest] = paragraph.split("\n");
                  return (
                    <div key={index} className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {title.replace(/\*\*/g, "")}
                      </h2>
                      <ul className="space-y-2 text-gray-600">
                        {rest
                          .filter((line) => line.trim())
                          .map((line, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span style={{ color: "#4caf50" }} className="font-bold mt-1">
                                •
                              </span>
                              <span>{line.replace(/^- /, "")}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  );
                }
                return (
                  <p key={index} className="text-gray-600 leading-8 mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-12 flex items-center gap-4">
              <a
                href="/"
                className="rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#4caf50" }}
              >
                Get a Free Quote
              </a>
              <Link
                href="/services"
                className="font-semibold transition-colors hover:text-green-600"
                style={{ color: "#4caf50" }}
              >
                Back to Services <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
