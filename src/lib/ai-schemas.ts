// AI Optimization Schemas
// These help AI crawlers (Claude, ChatGPT, Perplexity) understand your business

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nevilletuckerservices.co.uk";

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does NTS Ltd provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "NTS Ltd provides comprehensive HVAC and mechanical services including heating systems, air conditioning installation and maintenance, ventilation solutions, plumbing services, domestic and commercial servicing, and system commissioning. All work is carried out by Gas Safe registered engineers."
      }
    },
    {
      "@type": "Question",
      "name": "Are your engineers Gas Safe registered?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all our engineers are Gas Safe registered, ensuring compliance with the highest safety and professional standards. We also hold additional certifications in HVAC, ventilation, and mechanical services."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer 24/7 emergency services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we provide 24/7 emergency breakdown and repair services across Hull and the surrounding regions. Our response time is typically under 2 hours for emergency callouts."
      }
    },
    {
      "@type": "Question",
      "name": "What areas do you service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide services to domestic and commercial clients across Hull, East Yorkshire, Yorkshire, and the Humber region. We're happy to discuss projects outside our normal service area."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide maintenance plans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer comprehensive planned maintenance programs for both domestic and commercial clients. Regular maintenance helps prevent breakdowns, improves efficiency, and extends system lifespan."
      }
    }
  ]
};

export const servicesSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Plumbing & Heating Services",
    "description": "Professional boiler installation, heating system design, maintenance, and emergency repairs. All work carried out by Gas Safe registered engineers.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "NTS Ltd",
      "url": siteUrl,
      "telephone": "01482 838080"
    },
    "areaServed": ["Hull", "East Yorkshire", "Yorkshire", "Humber"],
    "serviceType": ["Boiler Installation", "Heating Maintenance", "Emergency Repair"]
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Air Conditioning Services",
    "description": "Energy-efficient cooling systems, installation, maintenance, and repairs for residential and commercial properties.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "NTS Ltd",
      "url": siteUrl,
      "telephone": "01482 838080"
    },
    "areaServed": ["Hull", "East Yorkshire", "Yorkshire", "Humber"],
    "serviceType": ["Installation", "Maintenance", "Repair"]
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Ventilation Systems",
    "description": "Professional ventilation system design, installation, and maintenance for improved indoor air quality and health.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "NTS Ltd",
      "url": siteUrl,
      "telephone": "01482 838080"
    },
    "areaServed": ["Hull", "East Yorkshire", "Yorkshire", "Humber"],
    "serviceType": ["Design", "Installation", "Maintenance"]
  }
];

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
