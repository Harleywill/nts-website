"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const SLUG_TO_EXT: Record<string, string> = {
  honeywell: "jpg", toshiba: "png", fgr: "jpg", oftec: "jpg",
  mitsubishi: "jpg", "magic-box": "jpg", fgas: "jpg", cylon: "jpg",
  chas: "jpg", "gas-safe": "jpg", aphc: "jpg", alcumus: "jpg",
};

interface AccreditationItem {
  name: string;
  slug: string;
  enabled: boolean;
  imageUrl?: string | null;
}

const FALLBACK: AccreditationItem[] = [
  { name: "Honeywell", slug: "honeywell", enabled: true },
  { name: "Toshiba", slug: "toshiba", enabled: true },
  { name: "FGR", slug: "fgr", enabled: true },
  { name: "OFTEC", slug: "oftec", enabled: true },
  { name: "Mitsubishi", slug: "mitsubishi", enabled: true },
  { name: "Magic Box", slug: "magic-box", enabled: true },
  { name: "F-Gas", slug: "fgas", enabled: true },
  { name: "Cylon", slug: "cylon", enabled: true },
  { name: "CHAS", slug: "chas", enabled: true },
  { name: "Gas Safe", slug: "gas-safe", enabled: true },
  { name: "APHC", slug: "aphc", enabled: true },
  { name: "Alcumus", slug: "alcumus", enabled: true },
];

export default function AccreditationsStrip() {
  const [accreditations, setAccreditations] = useState<AccreditationItem[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/accreditations")
      .then(r => r.json())
      .then((data: AccreditationItem[]) => {
        if (Array.isArray(data)) {
          setAccreditations(data.filter(a => a.enabled));
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const imageStyle = {
    filter: "grayscale(1) brightness(1.3) invert(1)",
    mixBlendMode: "screen" as const,
    backgroundColor: "transparent",
  };

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
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {accreditations.map((a, index) => {
            const src = a.imageUrl ?? `/images/accreditations/${a.slug}.${SLUG_TO_EXT[a.slug] ?? "jpg"}`;
            return (
              <motion.div
                key={a.slug}
                className="flex justify-center items-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.02 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Image
                  src={src}
                  alt={a.name}
                  width={120}
                  height={80}
                  className="max-h-16 w-auto object-contain"
                  style={imageStyle}
                  priority={index < 6}
                  loading={index < 6 ? "eager" : "lazy"}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
