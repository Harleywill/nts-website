// Brand Colors
export const COLORS = {
  navy: "#1a2f6e",
  green: "#4caf50",
  white: "#ffffff",
  lightGrey: "#f5f5f5",
  darkGrey: "#333333",
};

// Company Information
export const COMPANY = {
  name: "NTS Ltd",
  phone: "01482 838080",
  email: "info@ntsltd.com",
  address: "Hull, UK",
  tagline: "Reliable Heating & Air Conditioning Services You Can Trust",
};

// Services
export const SERVICES = [
  {
    id: "plumbing-heating",
    title: "Plumbing & Heating",
    description: "Professional plumbing and heating solutions for domestic and commercial properties.",
    icon: "FaFaucet",
  },
  {
    id: "ventilation",
    title: "Ventilation",
    description: "Expert ventilation systems to ensure optimal air quality and circulation.",
    icon: "FaWind",
  },
  {
    id: "domestic-servicing",
    title: "Domestic Servicing",
    description: "Regular maintenance and servicing for residential heating systems.",
    icon: "FaHome",
  },
  {
    id: "commercial-servicing",
    title: "Commercial Servicing",
    description: "Large-scale HVAC solutions tailored for commercial facilities.",
    icon: "FaBuilding",
  },
  {
    id: "air-conditioning",
    title: "Air Conditioning",
    description: "Installation and maintenance of efficient air conditioning systems.",
    icon: "FaSnowflake",
  },
  {
    id: "commissioning",
    title: "Commissioning",
    description: "Professional system commissioning and optimization services.",
    icon: "FaCheckCircle",
  },
];

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// Stats
export const STATS = [
  { label: "Years in Business", value: "15+" },
  { label: "Projects Completed", value: "500+" },
  { label: "Qualified Engineers", value: "25+" },
  { label: "Accreditations", value: "Gas Safe" },
];

// Sample Projects (for Phase 1, these will come from DB in Phase 2)
export const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: "Commercial HVAC Installation",
    description: "Complete heating and cooling system for a 50,000 sq ft commercial facility.",
    image: "/images/project-1.jpg",
  },
  {
    id: 2,
    title: "Residential Heating Upgrade",
    description: "Modern boiler installation and heating system optimization for family home.",
    image: "/images/project-2.jpg",
  },
  {
    id: 3,
    title: "Ventilation System Retrofit",
    description: "Energy-efficient ventilation system installed in heritage building.",
    image: "/images/project-3.jpg",
  },
];

// Sample Testimonials (for Phase 1, these will come from DB in Phase 2)
export const SAMPLE_TESTIMONIALS = [
  {
    id: 1,
    name: "John Smith",
    company: "Smith & Co Ltd",
    rating: 5,
    text: "Exceptional service from start to finish. The team was professional, efficient, and the quality of work is outstanding.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "Premier Facilities",
    rating: 5,
    text: "We've been using NTS Ltd for over 5 years. Their expertise and reliability are unmatched in the industry.",
  },
  {
    id: 3,
    name: "Michael Brown",
    company: "Brown Manufacturing",
    rating: 5,
    text: "Outstanding HVAC solutions. The team went above and beyond to ensure our systems were optimized for efficiency.",
  },
];
