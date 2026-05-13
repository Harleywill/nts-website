"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheck } from "react-icons/fa";
import { staggerContainerVariants, staggerItemVariants, slideUpVariants } from "@/lib/animations";

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
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4"
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* Name */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                      Full Name
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all"
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    />
                  </motion.div>

                  {/* Service */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="service" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                      Which service do you need?
                    </label>
                    <motion.select
                      id="service"
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all"
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    >
                      <option value="">Select a service</option>
                      <option value="plumbing">Plumbing & Heating</option>
                      <option value="air-conditioning">Air Conditioning</option>
                      <option value="ventilation">Ventilation</option>
                      <option value="domestic">Domestic Servicing</option>
                      <option value="commercial">Commercial Servicing</option>
                      <option value="commissioning">Commissioning</option>
                    </motion.select>
                  </motion.div>

                  {/* Contact */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="contact" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                      Phone or Email
                    </label>
                    <motion.input
                      type="text"
                      id="contact"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-all"
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#1a2f6e] mb-2">
                      Tell us about your project
                    </label>
                    <motion.textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#4caf50] resize-none transition-all"
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="w-full h-14 bg-[#4caf50] text-white font-bold rounded-lg transition-all mt-6"
                    whileHover={{ scale: 1.05, backgroundColor: "#45a049" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    Send Quote Request
                  </motion.button>
                </motion.form>
              ) : (
                /* Success Message */
                <motion.div
                  key="success"
                  className="p-6 text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="w-16 h-16 bg-[#4caf50] rounded-full flex items-center justify-center">
                      <FaCheck size={32} className="text-white" />
                    </div>
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-bold text-[#1a2f6e] mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Thanks!
                  </motion.h3>
                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    We'll call you within 2 hours.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
