"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  text: string;
  projectId: number | null;
  featured: boolean;
}

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [testimonialId, setTestimonialId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Testimonial | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      setTestimonialId(id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!testimonialId) return;
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(`/api/testimonials/${testimonialId}`);
        if (!res.ok) throw new Error("Failed to fetch testimonial");
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        setError("Failed to load testimonial");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonial();
  }, [testimonialId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "projectId"
            ? value ? parseInt(value) : null
            : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update testimonial");
        setSubmitting(false);
        return;
      }

      router.push("/admin/testimonials");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!formData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || "Testimonial not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Testimonial</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-8"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Client Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Client name"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Company (Optional)
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Company name"
            />
          </div>

          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Testimonial Text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What did the client say?"
            />
          </div>

          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Related Project (Optional)
            </label>
            <input
              id="projectId"
              type="number"
              name="projectId"
              value={formData.projectId || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Project ID"
            />
          </div>

          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-green-500 rounded focus:ring-2 focus:ring-green-500"
            />
            <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-900">
              Featured on homepage
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Testimonial"}
          </button>
          <Link
            href="/admin/testimonials"
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
