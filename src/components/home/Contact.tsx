"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants, slideUpVariants } from "@/lib/animations";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    agreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreed) {
      setError("Please agree to the privacy policy");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          service: formData.company || "General Inquiry",
          contact: formData.email || formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send message. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        agreed: false,
      });

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

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
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
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#1a2f6e] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      {/* Gradient Blob Background - Bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#1a2f6e] to-[#4caf50] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Get In Touch
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600">
          Have a question about our services? Contact our team and we'll respond as soon as possible.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              initial={{ opacity: 0 }}
              animate={{ x: [0, -10, 10, -10, 0], opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
            >
              ✓ Thank you! We'll be in touch soon.
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2" variants={staggerContainerVariants}>
          <motion.div variants={staggerItemVariants}>
            <label htmlFor="firstName" className="block text-sm/6 font-semibold text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <motion.input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <label htmlFor="lastName" className="block text-sm/6 font-semibold text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <motion.input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div className="sm:col-span-2" variants={staggerItemVariants}>
            <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
              Company
            </label>
            <div className="mt-2.5">
              <motion.input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div className="sm:col-span-2" variants={staggerItemVariants}>
            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <motion.input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div className="sm:col-span-2" variants={staggerItemVariants}>
            <label htmlFor="phone" className="block text-sm/6 font-semibold text-gray-900">
              Phone number
            </label>
            <div className="mt-2.5">
              <motion.input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div className="sm:col-span-2" variants={staggerItemVariants}>
            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
              Message
            </label>
            <div className="mt-2.5">
              <motion.textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us about your project or inquiry..."
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 border border-gray-300 transition-all"
                whileFocus={{ scale: 1.02, backgroundColor: "#f0fdf4" }}
              />
            </div>
          </motion.div>

          <motion.div className="flex gap-x-4 sm:col-span-2" variants={staggerItemVariants}>
            <div className="flex h-6 items-center">
              <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-gray-200 p-px ring ring-gray-300 outline-offset-2 outline-green-500 transition-colors duration-200 ease-in-out has-checked:bg-green-500 has-focus-visible:outline-2">
                <motion.span
                  className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5"
                  animate={formData.agreed ? { x: 16 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <input
                  id="agreed"
                  name="agreed"
                  type="checkbox"
                  aria-label="Agree to privacy policy"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="absolute inset-0 size-full appearance-none cursor-pointer focus:outline-hidden"
                />
              </div>
            </div>
            <label htmlFor="agreed" className="text-sm/6 text-gray-600 cursor-pointer">
              By selecting this, you agree to our{" "}
              <a href="/privacy" className="font-semibold text-green-600 hover:text-green-700">
                privacy policy
              </a>
              .
            </label>
          </motion.div>
        </motion.div>

        <motion.div className="mt-10" variants={staggerItemVariants}>
          <motion.button
            type="submit"
            disabled={loading || submitted}
            className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            style={{ backgroundColor: submitted ? "#10b981" : "#4caf50", opacity: loading ? 0.7 : 1 }}
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
                >
                  ✓ Message Sent!
                </motion.span>
              ) : loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sending...
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.form>
    </section>
  );
}
