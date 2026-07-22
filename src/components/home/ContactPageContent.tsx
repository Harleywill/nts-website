"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactPageContent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    services: [] as string[],
    message: "",
    agreed: false,
    website: "", // honeypot — real users never see this field
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services = [
    "Ventilation",
    "Plumbing & Heating",
    "Air Conditioning",
    "Commercial Servicing",
    "RPZ Testing",
    "Other / Not sure",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    setError(null);
  };

  const handleServiceChange = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter((s) => s !== service)
        : [...formData.services, service],
    });
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
          email: formData.email,
          phone: formData.phone,
          service: formData.services.join(", ") || "General Inquiry",
          company: formData.company,
          message: formData.message,
          website: formData.website,
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
        services: [],
        message: "",
        agreed: false,
        website: "",
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

  const infoCards = [
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: "Unit F2 Rotterdam Park",
      subvalue: "Hull, HU7 0AN",
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: "01482 838080",
      subvalue: "Mon-Fri, 8am-5pm",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "info@nt.services",
      subvalue: "We'll respond within 24 hours",
    },
  ];

  return (
    <div className="relative">
      {/* Info Cards Below Hero */}
      <section className="relative px-6 py-12 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-green-100">
                        <Icon className="text-brand-green-600" size={24} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {card.label}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {card.value}
                      </p>
                      <p className="text-sm text-gray-600">{card.subvalue}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              className="lg:col-span-3 bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <span className="text-brand-green-600 text-sm font-semibold uppercase tracking-wider">
                  Contact Form
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
                  Send us the details,<br />we'll handle the rest.
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Whether you need a one-off ventilation survey or a full commercial HVAC programme, our engineers are ready to scope it out with you. No obligation, no hard sell.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="mb-6 p-4 bg-brand-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    ✓ Message sent successfully! We'll be in touch soon.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field — hidden from real users, bots tend to fill every input */}
                <div style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, overflow: "hidden" }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your company"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="01482 838080"
                    />
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    When service?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-green-600 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How can we help?
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about your project, site, or maintenance needs..."
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-brand-green-600 focus:ring-green-500 mt-1"
                  />
                  <label className="ml-3 text-sm text-gray-600">
                    I agree to NTS Ltd's{" "}
                    <a href="/privacy" className="text-brand-green-600 hover:underline">
                      privacy policy
                    </a>
                    .
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Sending..." : "Send message →"}
                </button>
              </form>
            </motion.div>

            {/* Trust Stats Box */}
            <motion.div
              className="lg:col-span-2 bg-gradient-to-br from-navy via-navy to-gray-900 rounded-2xl p-8 text-white h-fit"
              style={{ background: "linear-gradient(135deg, #1a2f6e 0%, #0f1f4d 100%)" }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-8">
                Trusted by businesses across Yorkshire
              </h3>

              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-bold text-brand-green-400">15+</div>
                  <p className="text-gray-300 mt-2">Years in business</p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-brand-green-400">500+</div>
                  <p className="text-gray-300 mt-2">Projects delivered</p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-brand-green-400">25+</div>
                  <p className="text-gray-300 mt-2">Qualified engineers</p>
                </div>

                <div>
                  <div className="text-4xl font-bold text-brand-green-400">24h</div>
                  <p className="text-gray-300 mt-2">Avg response time</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-sm text-gray-300">
                  Gas Safe registered • F-Gas certified • 24/7 Emergency support
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
