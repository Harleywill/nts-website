"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { COMPANY, SERVICES } from "@/lib/constants";
import { slideUpVariants, staggerContainerVariants, staggerItemVariants, staggerContainerFastVariants, staggerItemFastVariants } from "@/lib/animations";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative isolate overflow-hidden text-white"
      style={{ backgroundColor: "#101828" }}
    >
      {/* Gradient Blob Background - Bottom Only */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#64b5f6] to-[#4caf50] opacity-15 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-16">
        {/* Top Section: Logo, Mission, Social */}
        <motion.div
          className="mb-12 pb-12 border-b border-white/10"
          variants={slideUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">{COMPANY.name}</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Professional heating, cooling, and ventilation solutions for residential and commercial clients.
              </p>
            </div>
            <motion.div
              className="flex gap-4"
              variants={staggerContainerFastVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-gray-900 transition-all duration-200"
                aria-label="Facebook"
                variants={staggerItemFastVariants}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                <FaFacebook size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-gray-900 transition-all duration-200"
                aria-label="Instagram"
                variants={staggerItemFastVariants}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 text-white hover:bg-green-400 hover:text-gray-900 transition-all duration-200"
                aria-label="LinkedIn"
                variants={staggerItemFastVariants}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                <FaLinkedin size={20} />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Middle Section: 3 Columns */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Column 1: Navigation Links */}
          <motion.div variants={staggerItemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 8, color: "#4caf50" }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={link.href} className="text-gray-300 transition-colors text-sm">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 2: All Services */}
          <motion.div variants={staggerItemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <motion.li
                  key={service.id}
                  whileHover={{ x: 8, color: "#4caf50" }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/services/${service.id}`} className="text-gray-300 transition-colors text-sm">
                    {service.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact Information */}
          <motion.div variants={staggerItemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Contact Information</h4>
            <div className="space-y-5">
              {/* Phone */}
              <motion.div className="flex items-start gap-3" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                <FaPhone size={18} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                  <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    {COMPANY.phone}
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div className="flex items-start gap-3" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                <FaEnvelope size={18} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                  <a href={`mailto:${COMPANY.email}`} className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                    {COMPANY.email}
                  </a>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div className="flex items-start gap-3" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                <FaMapMarkerAlt size={18} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{COMPANY.address}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className="text-sm text-gray-400">
            © {currentYear} {COMPANY.name}, Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
