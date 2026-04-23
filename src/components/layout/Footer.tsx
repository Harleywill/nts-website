"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { COMPANY, SERVICES } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative isolate overflow-visible text-white"
      style={{ backgroundColor: "#1a2f6e" }}
    >
      {/* Gradient Blob Background - Top */}
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

      {/* Gradient Blob Background - Bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#64b5f6] to-[#4caf50] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <h3 className="text-2xl font-bold mb-3">{COMPANY.name}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Professional heating, cooling, and ventilation solutions for
              residential and commercial clients.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {SERVICES.slice(0, 3).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-green-400 hover:text-green-300 transition-colors text-sm font-semibold"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaPhone size={16} className="text-green-400 mt-1 flex-shrink-0" />
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope size={16} className="text-green-400 mt-1 flex-shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt size={16} className="text-green-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{COMPANY.address}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-navy-900 transition-all duration-200"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-navy-900 transition-all duration-200"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-navy-900 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <p>
              © {currentYear} {COMPANY.name}. All rights reserved. Company Reg No: 12345678
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-green-400 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
