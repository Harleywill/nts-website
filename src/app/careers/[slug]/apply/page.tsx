"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DuctWaves from "@/components/common/DuctWaves";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    coverLetter: "",
    agreed: false,
  });

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
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setError(`CV file is ${sizeMB}MB. Maximum size is 10MB. Please choose a smaller file or compress your document.`);
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        const fileType = file.name.split('.').pop()?.toUpperCase() || 'unknown';
        setError(`File type .${fileType} is not supported. Please upload a PDF or Word document (.pdf, .doc, .docx).`);
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setError(`CV file is ${sizeMB}MB. Maximum size is 10MB. Please choose a smaller file or compress your document.`);
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        const fileType = file.name.split('.').pop()?.toUpperCase() || 'unknown';
        setError(`File type .${fileType} is not supported. Please upload a PDF or Word document (.pdf, .doc, .docx).`);
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.postcode ||
      !cvFile ||
      !formData.agreed
    ) {
      setError(
        "Please fill in all required fields, upload a CV, and agree to the privacy policy"
      );
      return;
    }

    setLoading(true);

    try {
      const cvUrl = `/uploads/cvs/${cvFile.name}`;
      const cvFilename = cvFile.name;

      // Validate email format
      if (!formData.email.includes('@')) {
        setError('Email address must contain an @ symbol');
        setLoading(false);
        return;
      }

      // Validate phone format (basic check)
      if (formData.phone.length < 10) {
        setError('Phone number must be at least 10 digits');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/careers/${slug}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cvUrl,
          cvFilename,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit application");
        setLoading(false);
        return;
      }

      router.push(`/careers/${slug}/apply/success?ref=${data.reference}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-6 pt-24 pb-10 sm:py-20 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves bands={4} />
          </div>
          <div className="absolute inset-0 -z-10 h-24 bg-gradient-to-b from-gray-900/70 to-transparent pointer-events-none" />

          <motion.div
            className="mx-auto max-w-7xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/careers" className="hover:text-gray-200 transition-colors">
                Careers
              </Link>
              <span>/</span>
              <span className="text-gray-300">{slug}</span>
              <span>/</span>
              <span className="text-white font-medium">Apply</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Apply for this role
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl">
              Tell us about yourself and we'll review your application within 5 business days.
            </p>
          </motion.div>
        </section>

        {/* Form Section */}
        <motion.section
          className="relative px-6 py-16 sm:py-24 lg:px-8 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
              {/* Left - Form Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                <div className="mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-green-600 mb-2">
                    Application Form
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tell us about yourself
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3"
                      >
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name and Email Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-brand-green-500"
                        placeholder="John Smith"
                        required
                        animate={{
                          boxShadow: focusedField === 'fullName' ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none'
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-brand-green-500"
                        placeholder="john@example.com"
                        required
                        animate={{
                          boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none'
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-brand-green-500"
                        placeholder="01482 123456"
                        required
                        animate={{
                          boxShadow: focusedField === 'phone' ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none'
                        }}
                      />
                    </div>

                    {/* Postcode */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Postcode <span className="text-red-500">*</span></label>
                      <p className="text-xs text-gray-500 mt-1">So we can understand your commute</p>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-900 mb-2"><br/><span className="text-xs text-gray-500">(helps us assess your commute)</span>
                      </label>
                      <motion.input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('postcode')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-brand-green-500"
                        placeholder="HU1 1AA"
                        required
                        animate={{
                          boxShadow: focusedField === 'postcode' ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      CV / Resume <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">PDF or Word document, max 10MB. Keep to 1-2 pages</p>
                    <motion.div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-8 rounded-lg border-2 border-dashed text-center transition-all cursor-pointer ${
                        dragOver || cvFile
                          ? "border-brand-green-500 bg-brand-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      }`}
                      animate={{
                        borderColor: dragOver || cvFile ? '#4caf50' : '#d1d5db',
                        backgroundColor: dragOver || cvFile ? '#f9fdf7' : '#f9fafb'
                      }}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="cv-input"
                        required
                      />
                      <label htmlFor="cv-input" className="cursor-pointer block">
                        {cvFile ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-lg bg-brand-green-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-900">
                                {cvFile.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {(cvFile.size / 1024).toFixed(0)} KB · Click to replace
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-12 h-12 rounded-lg bg-brand-green-50 flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-brand-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              Drop your CV here, or{" "}
                              <span className="text-brand-green-600 underline">
                                browse files
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              PDF, DOC, DOCX · max 10 MB
                            </p>
                          </motion.div>
                        )}
                      </label>
                    </motion.div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Cover Letter
                    </label>
                    <motion.textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('coverLetter')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Hi NTS team, I'm applying because…"
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-brand-green-500"
                      animate={{
                        boxShadow: focusedField === 'coverLetter' ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none'
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional — tell us why you want to work at NTS Ltd.
                    </p>
                  </div>

                  {/* Privacy Agreement */}
                  <div className="flex items-start gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, agreed: !p.agreed }))
                      }
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-all relative flex items-center justify-center ${
                        formData.agreed
                          ? "bg-brand-green-500 border-brand-green-500"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {formData.agreed && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-gray-700 leading-relaxed pt-1">
                      I agree to NTS Ltd processing my data for this
                      application according to the{" "}
                      <Link
                        href="/privacy"
                        className="text-brand-green-600 font-semibold hover:underline"
                      >
                        privacy policy
                      </Link>
                      .
                    </span>
                  </div>

                  {/* Info Banner */}
                  <motion.div
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3"
                    whileHover={{ backgroundColor: '#eff6ff' }}
                  >
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-blue-800">
                      Your application is secure and encrypted. Data is stored according to GDPR.
                    </p>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-brand-green-500 text-white rounded-lg hover:bg-brand-green-600 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    whileHover={{ backgroundColor: '#3d9142' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit application</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Right - Sidebars */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Applying For Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg p-6 border border-gray-700 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                    Position
                  </p>
                  <p className="text-lg font-bold mb-6">{slug}</p>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Department
                      </p>
                      <p className="font-semibold text-gray-100">HVAC Services</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="font-semibold text-gray-100">Hull, UK</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Type
                      </p>
                      <p className="font-semibold text-gray-100">Full Time</p>
                    </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-5">
                    What happens next
                  </p>
                  <div className="space-y-4">
                    {[
                      ["1", "Submit", "Your application"],
                      ["2", "Review", "Within 5 days"],
                      ["3", "Chat", "Quick phone call"],
                      ["4", "Visit", "Site meeting"],
                      ["5", "Offer", "If it's right"],
                    ].map(([num, title, desc], idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-600 font-bold text-sm">
                            {num}
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {title}
                          </p>
                          <p className="text-xs text-gray-600">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-4">
                    Have questions?
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Call us</p>
                      <a
                        href="tel:01482838080"
                        className="font-semibold text-gray-900 hover:text-brand-green-600 transition-colors"
                      >
                        01482 838080
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Email</p>
                      <a
                        href="mailto:careers@ntsltd.com"
                        className="font-semibold text-gray-900 hover:text-brand-green-600 transition-colors break-all"
                      >
                        careers@ntsltd.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
