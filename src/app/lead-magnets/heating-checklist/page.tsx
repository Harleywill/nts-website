"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaCheckCircle } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HeatingChecklistLeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Store email for newsletter (Phase 3)
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "heating-checklist" }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
        // In production, trigger download here
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 min-h-screen flex items-center">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Left: Content */}
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                  Winter Heating Maintenance Checklist
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  A professional guide to preparing your heating system for winter and avoiding costly breakdowns.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex gap-3">
                    <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">5 essential maintenance steps</span>
                  </div>
                  <div className="flex gap-3">
                    <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">Professional engineer recommendations</span>
                  </div>
                  <div className="flex gap-3">
                    <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">Tips to save 15%+ on energy bills</span>
                  </div>
                  <div className="flex gap-3">
                    <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-200">Printable checklist included</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  Free PDF download. No credit card required.
                </p>
              </div>

              {/* Right: Form */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get Your Free Checklist
                </h3>
                <p className="text-gray-300 mb-6">
                  Enter your email to download the complete heating maintenance guide.
                </p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-8"
                    >
                      <FaDownload className="text-green-400 text-4xl mx-auto mb-4" />
                      <h4 className="text-white font-semibold mb-2">
                        Download Started!
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Check your email for the guide. We'll also send you exclusive tips.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />

                      {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ backgroundColor: loading ? "#999" : "#4caf50" }}
                      >
                        {loading ? (
                          <>
                            <span>Preparing...</span>
                          </>
                        ) : (
                          <>
                            <FaDownload size={16} />
                            <span>Get Free Checklist</span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-400 text-center">
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What's Inside the Checklist
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">1. Visual Inspection</h3>
                <p className="text-gray-700">
                  Check for visible damage, leaks, rust, or corrosion on your boiler and pipes.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">2. Professional Servicing</h3>
                <p className="text-gray-700">
                  Annual boiler service checklist to keep your system running efficiently.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">3. Bleeding Radiators</h3>
                <p className="text-gray-700">
                  Step-by-step guide to remove air from radiators and restore heating.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">4. Thermostat Settings</h3>
                <p className="text-gray-700">
                  Optimize your thermostat for comfort and energy savings.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">5. Emergency Contacts</h3>
                <p className="text-gray-700">
                  Who to call if something goes wrong and how to get emergency support.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Bonus: Money-Saving Tips</h3>
                <p className="text-gray-700">
                  10 ways to reduce heating costs and improve efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
