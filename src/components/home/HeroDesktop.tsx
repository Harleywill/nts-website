"use client";

import Link from "next/link";
import HeroCarousel from "./HeroCarousel";

export default function HeroDesktop() {
  return (
    <div className="relative isolate overflow-hidden min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a2f6e" }}>
      {/* Background Image Carousel */}
      <HeroCarousel className="absolute inset-0 -z-10 object-cover object-center" />

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

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Professional HVAC Solutions
          </h2>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-200 sm:text-xl/8">
            Over 45 years of expertise in heating, cooling, and ventilation. Gas Safe registered engineers delivering reliable, professional solutions for domestic and commercial clients across Hull and beyond.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
            <Link href="/contact" className="hover:text-green-400 transition-colors">
              Get a Free Quote <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/services" className="hover:text-green-400 transition-colors">
              View Our Services <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/projects" className="hover:text-green-400 transition-colors">
              Recent Projects <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/about" className="hover:text-green-400 transition-colors">
              About Us <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Stats */}
          <dl className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Years in Business</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">45+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Projects Completed</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">3000+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">Qualified Engineers</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">25+</dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-base/7 text-gray-300">24/7 Support</dt>
              <dd className="text-4xl font-semibold tracking-tight text-white">Always</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
