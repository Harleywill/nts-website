"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaCog, FaBolt, FaClipboardCheck } from "react-icons/fa";

export default function AboutSection() {
  const features = [
    {
      name: "Expert Engineering",
      description: "Our Gas Safe registered engineers bring 45+ years of experience to every project, ensuring reliable installations and repairs.",
      icon: <FaCog aria-hidden="true" className="size-5 flex-none" />,
    },
    {
      name: "Rapid Response",
      description: "We understand that heating emergencies can't wait. Our team responds quickly to get your system back up and running.",
      icon: <FaBolt aria-hidden="true" className="size-5 flex-none" />,
    },
    {
      name: "End-to-End Solutions",
      description: "From domestic plumbing to commercial HVAC systems, we provide complete mechanical and electrical solutions.",
      icon: <FaClipboardCheck aria-hidden="true" className="size-5 flex-none" />,
    },
  ];

  return (
    <section
      className="relative isolate overflow-hidden px-6 py-20 sm:py-24 lg:overflow-visible lg:px-0"
      style={{ background: "linear-gradient(135deg, #1a2f6e 0%, #0f1f4d 100%)" }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg aria-hidden="true" className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-700">
          <defs>
            <pattern id="about-pattern" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-gray-800/20">
            <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
          </svg>
          <rect width="100%" height="100%" fill="url(#about-pattern)" strokeWidth="0" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>About NTS Ltd</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Your Trusted HVAC Partner</h2>
              <p className="mt-6 text-xl/8 text-gray-300">For over 45 years, NTS Ltd has been delivering exceptional heating, cooling, and ventilation services to homes and businesses across Hull. We're committed to keeping your systems running smoothly, efficiently, and safely.</p>
              {/* Trust Indicator */}
              <div className="mt-6 flex items-start gap-3">
                <span className="text-nts-green text-2xl font-bold" style={{ color: "#4caf50" }}>✓</span>
                <div>
                  <p className="font-semibold text-white">Fast Response Time</p>
                  <p className="text-gray-400 text-sm">We respond to all enquiries within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img src="/images/hvac-installation.jpg" alt="HVAC Services" className="w-[36rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-white/10" />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-400 lg:max-w-lg">
              <p>Whether you need a new boiler installation, routine maintenance, emergency repairs, or a complete commercial HVAC system, NTS Ltd has the expertise and experience to handle it. We work with both domestic and commercial clients, from small residential properties to large industrial facilities.</p>
              <ul role="list" className="mt-8 space-y-8 text-gray-400">
                {features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3">
                    <div style={{ color: "#4caf50" }} className="mt-1">
                      {feature.icon}
                    </div>
                    <span><strong className="font-semibold text-white">{feature.name}.</strong> {feature.description}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8">We take pride in our professionalism, reliability, and attention to detail. Every member of our team is trained to the highest standards, and we're committed to providing outstanding customer service at every stage of your project.</p>
              <h3 className="mt-16 text-2xl font-bold tracking-tight text-white">Let's improve your comfort today</h3>
              <p className="mt-6">Get in touch with our team to discuss your heating, cooling, and ventilation needs. We'll provide expert advice and a competitive quote for your project.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
