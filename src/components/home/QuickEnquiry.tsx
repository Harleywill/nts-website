"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaPhone, FaClock } from "react-icons/fa";
import { SERVICES } from "@/lib/constants";
import { useInView } from "react-intersection-observer";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

type FormStep = 1 | 2 | 3;

export default function QuickEnquiry() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [step, setStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState({
    service: "",
    propertyType: "", // new field
    name: "",
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

  const handleNextStep = () => {
    // Validate current step
    if (step === 1 && (!formData.service || !formData.propertyType)) {
      setError("Please select both service and property type");
      return;
    }
    if (step === 2 && (!formData.name || !formData.contact)) {
      setError("Please fill in your name and contact details");
      return;
    }
    setError(null);
    setStep((step + 1) as FormStep);
  };

  const handlePrevStep = () => {
    setStep((step - 1) as FormStep);
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
      setFormData({ service: "", propertyType: "", name: "", contact: "", message: "" });
      setStep(1);
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
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

  const progressPercentage = (step / 3) * 100;

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
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Your Free Quote
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Quick, easy form. We'll respond within 2 hours during business hours.
            </p>

            {/* Urgency & Trust Signals */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-brand-green-600 font-semibold">
                <FaClock size={18} />
                <span>Response in 2 hours</span>
              </div>
              <div className="flex items-center gap-2 text-brand-green-600 font-semibold">
                <FaPhone size={18} />
                <span>Or call: 01482 838080</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Step {step} of 3</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4caf50] to-[#64b5f6]"
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
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

            {/* STEP 1: Service & Property Type */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Service */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="service" className="block text-sm font-semibold mb-2">
                      What service do you need?
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

                  {/* Property Type */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="propertyType" className="block text-sm font-semibold mb-2">
                      Property type?
                    </label>
                    <motion.select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                      style={{ color: "#333333" }}
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    >
                      <option value="">Select property type...</option>
                      <option value="residential">Residential (Home/Apartment)</option>
                      <option value="commercial">Commercial (Office/Retail)</option>
                      <option value="industrial">Industrial (Factory/Warehouse)</option>
                    </motion.select>
                  </motion.div>
                </motion.div>
              )}

              {/* STEP 2: Contact Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Name */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Your name
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                      style={{ color: "#333333" }}
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    />
                  </motion.div>

                  {/* Contact */}
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="contact" className="block text-sm font-semibold mb-2">
                      Phone or email
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
                </motion.div>
              )}

              {/* STEP 3: Message */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div variants={staggerItemVariants}>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2">
                      Tell us about your project
                    </label>
                    <motion.textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What's your main concern? What issue are you trying to solve?"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none"
                      style={{ color: "#333333" }}
                      whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between pt-6">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gray-200 hover:bg-gray-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
              )}

              <div className="flex-1" />

              {step < 3 ? (
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-brand-green-500 hover:bg-brand-green-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={submitted || loading}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: submitted ? "#10b981" : "#4caf50",
                    opacity: loading ? 0.7 : 1,
                  }}
                  whileHover={{ scale: submitted || loading ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                        ✓ Thanks! We'll call soon
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
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
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
              )}
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
