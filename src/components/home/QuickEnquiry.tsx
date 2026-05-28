"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";
import { useInView } from "react-intersection-observer";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

export default function QuickEnquiry() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    contact: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.name || !formData.service || !formData.contact || !formData.message) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send enquiry. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      setSubmitted(true);
      setFormData({ name: "", service: "", contact: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-28 text-gray-900"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Gradient Blob Background - Top */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get In Touch Today
            </h2>
            <p className="text-gray-600 text-lg">
              Have a question? Request a free quote or tell us about your project
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg text-red-700"
                  initial={{ opacity: 0 }}
                  animate={{ x: [0, -10, 10, -10, 0], opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainerVariants}>
              {/* Name */}
              <motion.div variants={staggerItemVariants}>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                >
                  Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  style={{ color: "#333333" }}
                  whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                />
              </motion.div>

              {/* Service */}
              <motion.div variants={staggerItemVariants}>
                <label
                  htmlFor="service"
                  className="block text-sm font-semibold mb-2"
                >
                  Service Required
                </label>
                <motion.select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  style={{ color: "#333333" }}
                  whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                >
                  <option value="">Select a service...</option>
                  {SERVICES.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </motion.select>
              </motion.div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={staggerItemVariants}>
              <label htmlFor="contact" className="block text-sm font-semibold mb-2">
                Phone / Email
              </label>
              <motion.input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Your phone number or email"
                className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                style={{ color: "#333333" }}
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </motion.div>

            {/* Message */}
            <motion.div variants={staggerItemVariants}>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none"
                style={{ color: "#333333" }}
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitted || loading}
              variants={staggerItemVariants}
              whileHover={{ scale: submitted || loading ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{ backgroundColor: submitted ? "#10b981" : "#4caf50", opacity: loading ? 0.7 : 1 }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✓ Thank you! We'll be in touch soon
                  </motion.span>
                ) : loading ? (
                  <motion.div
                    key="loading"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Sending...</span>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      ⏳
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>Send Enquiry</span>
                    <FaPaperPlane size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
