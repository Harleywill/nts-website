'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DuctWaves from '@/components/common/DuctWaves';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeneralApplicationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    desiredRole: '',
    skills: '',
    experience: '',
    message: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setError(`CV file is ${sizeMB}MB. Maximum size is 10MB.`);
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        const fileType = file.name.split('.').pop()?.toUpperCase() || 'unknown';
        setError(`File type .${fileType} is not supported. Upload PDF or Word format.`);
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.fullName || !formData.email || !formData.phone || !cvFile) {
        setError('All fields are required: Full Name, Email, Phone, and CV.');
        setLoading(false);
        return;
      }

      if (!formData.email.includes('@')) {
        setError('Invalid email address');
        setLoading(false);
        return;
      }

      if (formData.phone.length < 10) {
        setError('Phone must be at least 10 digits');
        setLoading(false);
        return;
      }

      const cvFormData = new FormData();
      cvFormData.append('file', cvFile);

      const uploadResponse = await fetch('/api/upload/cv', {
        method: 'POST',
        body: cvFormData,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(uploadError.error || 'Failed to upload CV');
      }

      const uploadData = await uploadResponse.json();
      const cvUrl = uploadData.url;

      const response = await fetch('/api/careers/apply-general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cvUrl,
          cvFilename: cvFile.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        desiredRole: '',
        skills: '',
        experience: '',
        message: '',
      });
      setCvFile(null);

      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-6 pt-24 pb-10 sm:py-20 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves bands={4} />
          </div>
          <div className="absolute inset-0 -z-10 h-24 bg-gradient-to-b from-gray-900/70 to-transparent pointer-events-none" />

          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Join Our Team
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto" style={{ lineHeight: '1.6' }}>
              Submit your CV and skills anytime. We'll keep your application on file for future opportunities.
            </p>
          </motion.div>
        </section>

        <motion.section
          className="relative px-6 py-16 sm:py-24 lg:px-8 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-2xl">
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3"
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Application submitted!</p>
                    <p className="text-sm mt-1 text-green-600">We'll review your CV and contact you if there's a fit.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3"
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm mt-1 text-red-600">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    placeholder="01482 123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Desired Role
                  </label>
                  <input
                    type="text"
                    name="desiredRole"
                    value={formData.desiredRole}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    placeholder="e.g., HVAC Technician"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  CV <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="cv"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    required
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    {cvFile ? (
                      <div className="text-sm"><strong>{cvFile.name}</strong></div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Click to upload CV</p>
                        <p className="text-xs text-gray-600">PDF or Word, max 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About You
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            </form>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
