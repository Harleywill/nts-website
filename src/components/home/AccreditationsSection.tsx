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
    <section className="relative isolate py-16 overflow-hidden bg-gray-900">

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Industry Certifications & Partnerships
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Fully qualified, certified, and trusted by leading industry bodies and manufacturers
          </p>
        </div>

        {/* Two-column carousel grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Safety Qualifications Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <AccreditationsCarousel
              title="Safety Qualifications"
              accreditations={safetyQualifications}
            />
          </div>

          {/* Company Accreditations Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <AccreditationsCarousel
              title="Company Accreditations"
              accreditations={companyAccreditations}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
