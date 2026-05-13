"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AccreditationsStrip() {
  const imageStyle = {
    filter: "grayscale(1) brightness(1.3) invert(1)",
    mixBlendMode: "screen" as const,
    backgroundColor: "transparent",
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
    <div className="py-24 sm:py-32" style={{ backgroundColor: "#101828" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2
          className="text-center text-lg/8 font-semibold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          Trusted by industry leaders
        </motion.h2>
        <motion.div
          className="mx-auto mt-10 grid max-w-lg gap-x-8 gap-y-10 sm:max-w-xl lg:mx-0 lg:max-w-none"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {accreditations.map((accreditation, index) => (
            <motion.div
              key={accreditation.name}
              className="flex justify-center items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.02 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Image
                src={accreditation.path}
                alt={accreditation.name}
                width={120}
                height={80}
                className="max-h-16 w-auto object-contain"
                style={imageStyle}
                priority={index < 6}
                loading={index < 6 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
