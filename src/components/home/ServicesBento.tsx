"use client";

import { FaFire, FaWind, FaSnowflake, FaTools, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function ServicesBento() {
  return (
    <div className="relative py-24 sm:py-32 overflow-hidden bg-gray-900">
      {/* Gradient Blob Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#64b5f6] to-[#4caf50] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>
            Our Services
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Complete HVAC & Mechanical Solutions
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Plumbing & Heating */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaFire size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Plumbing & Heating</h3>
                <p className="text-gray-300 leading-relaxed">
                  From residential boiler installations to commercial heating systems, our Gas Safe registered engineers deliver reliable solutions.
                </p>
              </div>
              <Link
                href="/services/plumbing-heating"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Air Conditioning */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaSnowflake size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Air Conditioning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Cooling systems designed for maximum comfort and energy efficiency year-round.
                </p>
              </div>
              <Link
                href="/services/air-conditioning"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Ventilation */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaWind size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ventilation</h3>
                <p className="text-gray-300 leading-relaxed">
                  Professional ventilation systems for improved air quality and healthier indoor environments.
                </p>
              </div>
              <Link
                href="/services/ventilation"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Domestic Servicing */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaCheckCircle size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Domestic Servicing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Regular maintenance and repairs to keep your residential systems running smoothly.
                </p>
              </div>
              <Link
                href="/services/domestic-servicing"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Commercial HVAC */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaTools size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Commercial HVAC</h3>
                <p className="text-gray-300 leading-relaxed">
                  Large-scale mechanical and electrical solutions for industrial and commercial properties.
                </p>
              </div>
              <Link
                href="/services/commercial"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Commissioning */}
          <div>
            <div className="h-full rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-colors">
                  <FaCheckCircle size={32} style={{ color: "#4caf50" }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Commissioning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Professional system setup, testing, and verification to ensure optimal performance.
                </p>
              </div>
              <Link
                href="/services/commissioning"
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-colors hover:text-green-400"
                style={{ color: "#4caf50" }}
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
