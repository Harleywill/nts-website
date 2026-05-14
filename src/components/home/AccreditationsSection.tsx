import AccreditationsCarousel from "./AccreditationsCarousel";

const safetyQualifications = [
  { name: "Gas Safe", path: "/images/accreditations/gas-safe.jpg" },
  { name: "F-Gas Certification", path: "/images/accreditations/fgas.jpg" },
  { name: "FGR Qualified", path: "/images/accreditations/fgr.jpg" },
  { name: "CHAS Certified", path: "/images/accreditations/chas.jpg" },
  { name: "Alcumus SafeContractor", path: "/images/accreditations/alcumus.jpg" },
  { name: "OFTEC Registered", path: "/images/accreditations/oftec.jpg" },
];

const companyAccreditations = [
  { name: "APHC Member", path: "/images/accreditations/aphc.jpg" },
  { name: "Cylon Partner", path: "/images/accreditations/cylon.jpg" },
  { name: "Honeywell Certified", path: "/images/accreditations/honeywell.jpg" },
  { name: "Mitsubishi Partner", path: "/images/accreditations/mitsubishi.jpg" },
  { name: "Toshiba Partner", path: "/images/accreditations/toshiba.png" },
  { name: "Magic Box Installer", path: "/images/accreditations/magic-box.jpg" },
];

export default function AccreditationsSection() {
  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
            Industry Certifications & Partnerships
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fully qualified, certified, and trusted by leading industry bodies and manufacturers
          </p>
        </div>

        {/* Two-column carousel grid */}
        <div className="grid md:grid-cols-2 gap-12">
          <AccreditationsCarousel
            title="Safety Qualifications"
            accreditations={safetyQualifications}
          />
          <AccreditationsCarousel
            title="Company Accreditations"
            accreditations={companyAccreditations}
          />
        </div>
      </div>
    </section>
  );
}
