"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutSection() {
  const features = [
    {
      name: "Expert Engineering",
      description: "Our Gas Safe registered engineers bring 45+ years of experience to every project, ensuring reliable installations and repairs.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5 flex-none">
          <path d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z" clipRule="evenodd" fillRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Rapid Response",
      description: "We understand that heating emergencies can't wait. Our team responds quickly to get your system back up and running.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5 flex-none">
          <path d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" fillRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "End-to-End Solutions",
      description: "From domestic plumbing to commercial HVAC systems, we provide complete mechanical and electrical solutions.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5 flex-none">
          <path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z" />
          <path d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V15Zm-2.25-.75a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-.01Z" clipRule="evenodd" fillRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg aria-hidden="true" className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-800">
          <defs>
            <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-gray-800/50">
            <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
          </svg>
          <rect width="100%" height="100%" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" strokeWidth="0" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>About NTS Ltd</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Your Trusted HVAC Partner</h2>
              <p className="mt-6 text-xl/8 text-gray-300">For over 45 years, NTS Ltd has been delivering exceptional heating, cooling, and ventilation services to homes and businesses across Hull. We're committed to keeping your systems running smoothly, efficiently, and safely.</p>
            </div>
          </div>
        </div>
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img src="/images/hvac-installation.jpg" alt="HVAC Services" className="w-[26rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-white/10" />
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
