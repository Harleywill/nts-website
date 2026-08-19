import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import DuctWaves from "@/components/common/DuctWaves";
import styles from "./services.module.css";

export const metadata = {
  title: "Services - NTS Ltd",
  description: "Explore our comprehensive HVAC and mechanical services for residential and commercial clients.",
};

const bentoCards = [
  {
    area: styles.areaA,
    idx: "01 / SPEC",
    title: "Plumbing & Heating",
    description:
      "Complete plumbing and heating solutions for residential and commercial properties — from new boiler installations and radiator systems to emergency repairs and ongoing maintenance.",
    badge: "Gas Safe Registered",
    image: "/images/services/plumbing-heating.jpg",
    slug: "plumbing-heating",
  },
  {
    area: styles.areaB,
    idx: "02 / SPEC",
    title: "Ventilation",
    description:
      "System design, installation, and maintenance ensuring optimal airflow and air quality while maximizing energy efficiency.",
    image: "/images/services/ventilation.jpg",
    slug: "ventilation",
  },
  {
    area: styles.areaC,
    idx: "03 / SPEC",
    title: "Domestic & Commercial Servicing",
    description:
      "Regular maintenance and preventative care across boilers, heating, and air conditioning to avoid costly breakdowns.",
    tags: ["Boilers", "Heating", "A/C", "Electrical"],
    image: "/images/services/domestic-commercial-servicing.jpg",
    slug: "domestic-commercial-servicing",
  },
  {
    area: styles.areaD,
    idx: "04 / SPEC",
    title: "Air Conditioning",
    description:
      "System design, professional installation, and routine maintenance for safe, efficient cooling.",
    badge: "F-Gas Registered",
    image: "/images/services/airconditioning.jpg",
    slug: "air-conditioning",
  },
  {
    area: styles.areaE,
    idx: "05 / SPEC",
    title: "Commissioning",
    description:
      "Testing, verification, and optimization so systems perform at peak efficiency before handover.",
    tags: ["Test", "Verify", "Optimize", "Handover"],
    image: "/images/services/commissioning.jpg",
    slug: "commissioning",
  },
  {
    area: styles.areaF,
    idx: "06 / SPEC",
    title: "RPZ Testing",
    description:
      "Testing and certification of backflow prevention devices to protect water quality and stay compliant.",
    image: "/images/services/rpz-testing.jpg",
    slug: "rpz-testing",
  },
];

const processSteps = [
  {
    title: "Enquiry",
    description: "Call, message, or request a quote online. We scope the job the same day.",
  },
  {
    title: "Site Survey",
    description: "An engineer assesses the property and specifies the right system for it.",
  },
  {
    title: "Install",
    description: "Certified engineers carry out the work to Gas Safe / F-Gas standard.",
  },
  {
    title: "Commission",
    description: "Full system testing, verification, and handover documentation.",
  },
  {
    title: "Aftercare",
    description: "Ongoing servicing, warranty support, and emergency call-out.",
  },
];

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves bands={5} speed={0.7} />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <span className={styles.heroTag}>HVAC · Mechanical · Hull &amp; Yorkshire</span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Complete HVAC &amp; mechanical solutions for every need.
            </p>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-24 sm:py-32 px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className={styles.eyebrow}>Our Process</span>
              <h2
                className="mt-4 font-extrabold tracking-tight text-navy"
                style={{ fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
              >
                From first call to full handover
              </h2>
              <p className="mt-4 text-gray-500" style={{ fontSize: "16.5px", lineHeight: 1.65 }}>
                Every job follows the same five stages, whatever the specialism, so you always know what happens next.
              </p>
            </div>

            <div className={styles.timeline}>
              {processSteps.map((step, i) => (
                <div key={step.title} className={styles.step}>
                  <div className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer — bento grid */}
        <section className="py-24 sm:py-32 pb-28 px-6 lg:px-8" style={{ background: "#f6f7fa" }}>
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className={styles.eyebrow}>What We Offer</span>
              <h2
                className="mt-4 font-extrabold tracking-tight text-navy"
                style={{ fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
              >
                Six specialisms, one accountable team
              </h2>
              <p className="mt-4 text-gray-500" style={{ fontSize: "16.5px", lineHeight: 1.65 }}>
                From first fix to final commissioning, our engineers cover the full mechanical scope under one roof.
              </p>
            </div>

            <div className={styles.bento}>
              {bentoCards.map((card) => (
                <Link
                  key={card.slug}
                  href={`/services/${card.slug}`}
                  className={`${styles.card} ${styles.cardPhoto} ${card.area}`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                    className={styles.image}
                  />
                  <div className={styles.scrim} />
                  <div className={styles.cardIdx}>{card.idx}</div>
                  <div className={styles.cardBody}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    {card.badge && <span className={styles.badge}>{card.badge}</span>}
                    {card.tags && (
                      <div className={styles.tags}>
                        {card.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
