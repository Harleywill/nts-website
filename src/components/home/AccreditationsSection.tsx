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
      {/* SVG Animated Pattern Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg aria-hidden="true" className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-700">
          <defs>
            <pattern id="accred-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-gray-800/20">
            <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
          </svg>
          <rect width="100%" height="100%" fill="url(#accred-pattern)" strokeWidth="0" />
        </svg>
      </div>

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
