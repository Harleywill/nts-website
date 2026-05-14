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
    <section className="relative isolate py-16 overflow-hidden" style={{ backgroundColor: "#1a2f6e" }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/40" />

      {/* Top Gradient Blob */}
      <div aria-hidden="true" className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl">
        <div
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#4caf50] to-[#1a2f6e] opacity-20"
        />
      </div>

      {/* Bottom Gradient Blob */}
      <div aria-hidden="true" className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80 sm:ml-16 sm:translate-x-0">
        <div
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#4caf50] to-[#1a2f6e] opacity-20"
        />
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
