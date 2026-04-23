"use client";

import Image from "next/image";

export default function AccreditationsStrip() {
  const gridItemStyle = {
    display: "flex",
    justifyContent: "center",
  } as const;
  const accreditations = [
    { name: "Honeywell", path: "/images/accreditations/honeywell.jpg" },
    { name: "Toshiba", path: "/images/accreditations/toshiba.png" },
    { name: "FGR", path: "/images/accreditations/fgr.jpg" },
    { name: "OFTEC", path: "/images/accreditations/oftec.jpg" },
    { name: "Mitsubishi Air Conditioning", path: "/images/accreditations/mitsubishi.jpg" },
    { name: "Magic Box International", path: "/images/accreditations/magic-box.jpg" },
    { name: "FGAS Certification", path: "/images/accreditations/fgas.jpg" },
    { name: "Cylon", path: "/images/accreditations/cylon.jpg" },
    { name: "CHAS", path: "/images/accreditations/chas.jpg" },
    { name: "Gas Safe Register", path: "/images/accreditations/gas-safe.jpg" },
    { name: "APHC", path: "/images/accreditations/aphc.jpg" },
    { name: "Alcumus SafeContractor", path: "/images/accreditations/alcumus.jpg" },
  ];

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg/8 font-semibold text-white">
          Trusted by industry leaders
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5 lg:justify-items-center">
          {accreditations.map((accreditation, index) => (
            <div
              key={accreditation.name}
              className="col-span-1 flex justify-center"
              style={index === 10 ? { gridColumn: "2" } : index === 11 ? { gridColumn: "4" } : {}}
            >
              <Image
                src={accreditation.path}
                alt={accreditation.name}
                width={120}
                height={80}
                className="max-h-16 w-full object-contain"
                style={{
                  filter: "grayscale(1) brightness(1.3) invert(1)",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
