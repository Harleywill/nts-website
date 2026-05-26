"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ApplicationFormProps {
  jobSlug: string;
  jobTitle: string;
}

export default function ApplicationForm({
  jobSlug,
  jobTitle,
}: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    coverLetter: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        cv: "Please upload a PDF, DOC, or DOCX file",
      }));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        cv: "File is too large. Maximum size is 10MB.",
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.cv;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    }

    if (!file) {
      newErrors.cv = "Please upload your CV";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to our privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("postcode", formData.postcode);
      if (formData.coverLetter) {
        data.append("coverLetter", formData.coverLetter);
      }
      if (file) {
        data.append("cv", file);
      }

      const response = await fetch(`/api/careers/${jobSlug}/apply`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Redirect to success page
      router.push(
        `/careers/${jobSlug}/apply/success?ref=${result.reference}`
      );
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
      console.error("Application error:", err);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="John Smith"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-colors ${
            errors.fullName
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john@example.com"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-colors ${
            errors.email
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="07700 900000"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-colors ${
            errors.phone
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Postcode */}
      <div>
        <label
          htmlFor="postcode"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Postcode
        </label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          value={formData.postcode}
          onChange={handleInputChange}
          placeholder="HU2 0AX"
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-colors ${
            errors.postcode
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.postcode && (
          <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
        )}
      </div>

      {/* CV Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Upload Your CV
        </label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-[#4caf50] bg-[#4caf50]/5"
              : errors.cv
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="cv"
            name="cv"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {file ? (
            <div>
              <p className="text-sm font-semibold text-gray-900">
                ✓ {file.name}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm text-[#4caf50] hover:text-[#45a049] font-medium"
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CV here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, or DOCX (max 10MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-block rounded-lg px-4 py-2 bg-white border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
        {errors.cv && (
          <p className="mt-1 text-sm text-red-600">{errors.cv}</p>
        )}
      </div>

      {/* Cover Letter */}
      <div>
        <label
          htmlFor="coverLetter"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Cover Letter (Optional)
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          placeholder="Tell us why you're interested in this role..."
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4caf50] transition-colors"
        />
      </div>

      {/* Privacy Agreement */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleInputChange}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-[#4caf50] focus:ring-[#4caf50]"
        />
        <label htmlFor="agreeTerms" className="text-sm text-gray-600">
          I agree to NTS Ltd's{" "}
          <a href="/privacy" className="text-[#4caf50] hover:text-[#45a049] font-medium">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="text-[#4caf50] hover:text-[#45a049] font-medium">
            terms & conditions
          </a>
        </label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-red-600">{errors.agreeTerms}</p>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg px-6 py-3 font-semibold text-white bg-[#4caf50] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </motion.form>
  );
}
