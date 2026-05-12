"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden min-h-screen flex items-center justify-center pt-20 lg:pt-0" style={{ backgroundColor: "#1a2f6e" }}>
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=2830&h=1500&q=80"
        alt="HVAC Services"
        className="absolute inset-0 -z-10 size-full object-cover object-center"
      />

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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
            Professional HVAC Services You Can Trust
          </h1>

          {/* CTA Buttons - Stacked on Mobile, Side-by-side on Tablet+ */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="h-14 sm:h-16 flex items-center justify-center px-6 bg-[#4caf50] text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              Get Free Quote
            </Link>
            <Link
              href="/projects"
              className="h-14 sm:h-16 flex items-center justify-center px-6 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Our Work
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-12 text-white/60 text-sm">
            ↓ Scroll to explore
          </div>
        </div>
      </div>
    </div>
  );
}
