"use client";

import { motion } from "framer-motion";
import AnimatedHeading from "@/components/common/AnimatedHeading";

export default function AboutSection() {
  const features = [
    {
      name: "Expert Engineering",
      description: "Our Gas Safe registered engineers bring 15+ years of experience to every project, ensuring reliable installations and repairs.",
    },
    {
      name: "Rapid Response",
      description: "We understand that heating emergencies can't wait. Our team responds quickly to get your system back up and running.",
    },
    {
      name: "End-to-End Solutions",
      description: "From domestic plumbing to commercial HVAC systems, we provide complete mechanical and electrical solutions.",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0"
      style={{
        backgroundImage: `
          conic-gradient(from 90deg at 0.5px 0.5px, #0000 25%, #f0f0f0 0),
          linear-gradient(45deg, #0000 calc(50% - 0.25px), #f0f0f0 0 calc(50% + 0.25px), #0000 0),
          linear-gradient(-45deg, #0000 calc(50% - 0.25px), #f0f0f0 0 calc(50% + 0.25px), #0000 0)
        `,
        backgroundSize: '1em 1em, 2em 2em, 2em 2em',
        backgroundPosition: 'calc(-1 * 0.25px) calc(-1 * 0.25px), 0 0, 0 0'
      }}
    >

      {/* Simple Linear Layout - Mobile First */}
      <motion.div
        className="mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Text Content */}
        <div className="mb-8">
          <p className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>
            About NTS Ltd
          </p>
          <AnimatedHeading
            text="Your Trusted HVAC Partner"
            level="h2"
            className="mt-2 text-4xl font-semibold tracking-tight text-pretty"
            delay={0.2}
          />
          <p className="mt-6 text-xl/8 text-gray-700">
            For over 15 years, NTS Ltd has been delivering exceptional heating, cooling, and ventilation services to homes and businesses across Hull. We're committed to keeping your systems running smoothly, efficiently, and safely.
          </p>
        </div>

        {/* Image - NO PARALLAX */}
        <div className="mb-8 -mx-6">
          <img
            src="/images/hvac-installation.jpg"
            alt="HVAC Services"
            className="w-full rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10"
          />
        </div>

        {/* Rest of Content */}
        <div className="text-base/7 text-gray-700">
          <p className="mb-8">
            Whether you need a new boiler installation, routine maintenance, emergency repairs, or a complete commercial HVAC system, NTS Ltd has the expertise and experience to handle it. We work with both domestic and commercial clients, from small residential properties to large industrial facilities.
          </p>

          {/* Features List */}
          <ul role="list" className="space-y-8 text-gray-700 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex gap-x-3">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="mt-1 size-5 flex-none"
                  style={{ color: "#4caf50" }}
                >
                  <path d="M10.894 2.553a.75.75 0 00-1.788 0l-7 140a.75.75 0 001.721.813l6.157-7.348h5.25l6.157 7.348a.75.75 0 001.722-.812l-7-140z" />
                </svg>
                <span>
                  <strong className="font-semibold" style={{ color: "#1a2f6e" }}>{feature.name}.</strong> {feature.description}
                </span>
              </li>
            ))}
          </ul>

          <p className="mb-8">
            We take pride in our professionalism, reliability, and attention to detail. Every member of our team is trained to the highest standards, and we're committed to providing outstanding customer service at every stage of your project.
          </p>

          <h3 className="text-2xl font-bold tracking-tight mb-6" style={{ color: "#1a2f6e" }}>
            Let's improve your comfort today
          </h3>

          <p>
            Get in touch with our team to discuss your heating, cooling, and ventilation needs. We'll provide expert advice and a competitive quote for your project.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
