"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickEnquiryModal({ isOpen, onClose }: QuickEnquiryModalProps) {
  const [formData, setFormData] = useState({ name: "", service: "", contact: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", service: "", contact: "", message: "" });
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-lg z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold text-[#1a2f6e]">Get Your Free Quote</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Form Content */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                    Which service do you need?
                  </label>
                  <select
                    id="service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
                  >
                    <option value="">Select a service</option>
                    <option value="plumbing">Plumbing & Heating</option>
                    <option value="air-conditioning">Air Conditioning</option>
                    <option value="ventilation">Ventilation</option>
                    <option value="domestic">Domestic Servicing</option>
                    <option value="commercial">Commercial Servicing</option>
                    <option value="commissioning">Commissioning</option>
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    id="contact"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-14 bg-[#4caf50] text-white font-bold rounded-lg hover:bg-green-600 transition-colors mt-6"
                >
                  Send Quote Request
                </button>
              </form>
            ) : (
              /* Success Message */
              <div className="p-6 text-center py-12">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-[#1a2f6e] mb-2">Thanks!</h3>
                <p className="text-gray-600">We'll call you within 2 hours.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
