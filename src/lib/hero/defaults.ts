// The original hard-coded hero slides. Used to seed the HeroImage table and
// as the carousel's fallback if the table is empty or the API is unreachable,
// so the home page hero is never blank.
export const DEFAULT_HERO_IMAGES = [
  { imageUrl: "/images/hero-electrical.webp", alt: "Electrical panel installation" },
  { imageUrl: "/images/hero-rooftop-hvac.webp", alt: "HVAC rooftop units" },
  { imageUrl: "/images/work-in-progress.webp", alt: "NTS engineer welding on site" },
  { imageUrl: "/images/hero-electrical-testing.webp", alt: "Electrical testing with a multimeter" },
  { imageUrl: "/images/hero-circuit-board.avif", alt: "Circuit board and electronics" },
];
