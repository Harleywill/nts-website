"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DuctWaves from "@/components/common/DuctWaves";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

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
      setCvFile(e.target.files[0]);
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
      setCvFile(e.dataTransfer.files[0]);
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Compact Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-6 pt-24 pb-10 sm:py-20 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves bands={4} />
          </div>
          <div className="absolute inset-0 -z-10 h-24 bg-gradient-to-b from-gray-900/70 to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/careers" className="hover:text-gray-300">
                Careers
              </Link>
              <span>/</span>
              <span className="hover:text-gray-300 cursor-pointer">{slug}</span>
              <span>/</span>
              <span className="text-white">Apply</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
              Apply for the role
            </h1>
          </div>
        </section>

        {/* Form Section */}
        <section className="relative px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
              {/* Left - Form Card */}
              <div className="bg-white rounded-2xl p-9 border border-gray-200 shadow-md">
                <div className="mb-1">
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">
                    Your application
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tell us about yourself
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/13 focus:bg-emerald-50/50 outline-none transition-all text-sm"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/13 focus:bg-emerald-50/50 outline-none transition-all text-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/13 focus:bg-emerald-50/50 outline-none transition-all text-sm"
                        placeholder="01482 123456"
                        required
                      />
                    </div>

                    {/* Postcode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/13 focus:bg-emerald-50/50 outline-none transition-all text-sm"
                        placeholder="HU1 1AA"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        So we know your commute
                      </p>
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      CV / Resume <span className="text-red-500">*</span>
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-7 rounded-xl border-2 dashed text-center transition-all cursor-pointer ${
                        dragOver
                          ? "border-emerald-500 bg-emerald-50"
                          : cvFile
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="cv-input"
                        required
                      />
                      <label htmlFor="cv-input" className="cursor-pointer">
                        {cvFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <polyline points="20 6 9 17 4 12" />
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
                          </div>
                        ) : (
                          <div>
                            <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                              <svg
                                className="w-5 h-5 text-emerald-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              Drop your CV here, or{" "}
                              <span className="text-emerald-500 underline">
                                browse files
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              PDF, DOC, DOCX · max 10 MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cover letter
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Hi NTS team, I'm applying because…"
                      rows={5}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/13 focus:bg-emerald-50/50 outline-none transition-all text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional — but it helps. Tell us why you want to work here.
                    </p>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-start gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, agreed: !p.agreed }))
                      }
                      className={`flex-shrink-0 w-9 h-5 rounded-full border-2 transition-all relative ${
                        formData.agreed
                          ? "bg-emerald-500 border-emerald-500"
                          : "bg-gray-200 border-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          formData.agreed ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                      I'm happy for NTS Ltd to process my data for this
                      application per the{" "}
                      <Link
                        href="/privacy"
                        className="text-emerald-500 font-semibold hover:underline"
                      >
                        privacy policy
                      </Link>
                      .
                    </span>
                  </div>

                  {/* Info Banner */}
                  <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-lg flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p className="text-xs text-sky-800">
                      Your application is sent encrypted and stored securely
                      according to GDPR.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit application"}
                  </button>
                </form>
              </div>

              {/* Right - Sidebars */}
              <div className="space-y-6">
                {/* Applying For Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 border border-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Applying for
                  </p>
                  <p className="text-xl font-bold mb-6">{slug}</p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Department
                      </p>
                      <p className="font-medium">HVAC Services</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="font-medium">Hull, UK</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                        Type
                      </p>
                      <p className="font-medium">Full Time</p>
                    </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
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
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
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
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-sm font-bold text-gray-900 mb-4">
                    Need help?
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Call us</p>
                      <a
                        href="tel:01482838080"
                        className="font-semibold text-gray-900 hover:text-emerald-500"
                      >
                        01482 838080
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Email</p>
                      <a
                        href="mailto:careers@ntsltd.com"
                        className="font-semibold text-gray-900 hover:text-emerald-500 break-all"
                      >
                        careers@ntsltd.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
