"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

interface GoogleReview {
  id?: number;
  reviewerName: string;
  reviewerTitle: string | null;
  reviewText: string;
  rating: number;
  googleUrl: string;
  featured: boolean;
  order: number;
}

interface ReviewFormProps {
  initialData?: GoogleReview;
}

export default function ReviewForm({ initialData }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GoogleReview>(
    initialData || {
      reviewerName: "",
      reviewerTitle: "",
      reviewText: "",
      rating: 5,
      googleUrl: "",
      featured: false,
      order: 0,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.currentTarget;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.currentTarget as HTMLInputElement).checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData
        ? `/api/admin/reviews/${initialData.id}`
        : "/api/admin/reviews";

      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save review");
      }

      router.push("/admin/reviews");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Reviewer Name */}
      <div>
        <label htmlFor="reviewerName" className="block text-sm font-semibold text-gray-900 mb-2">
          Reviewer Name *
        </label>
        <input
          type="text"
          id="reviewerName"
          name="reviewerName"
          value={formData.reviewerName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., John Smith"
        />
      </div>

      {/* Reviewer Title */}
      <div>
        <label htmlFor="reviewerTitle" className="block text-sm font-semibold text-gray-900 mb-2">
          Reviewer Title / Position
        </label>
        <input
          type="text"
          id="reviewerTitle"
          name="reviewerTitle"
          value={formData.reviewerTitle || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Google Local Guide, 5 reviews"
        />
      </div>

      {/* Review Text */}
      <div>
        <label htmlFor="reviewText" className="block text-sm font-semibold text-gray-900 mb-2">
          Review Text *
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          value={formData.reviewText}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter the review text..."
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className={`p-2 rounded transition-colors ${
                formData.rating >= star
                  ? "text-yellow-400 hover:text-yellow-500"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              <FaStar size={24} />
            </button>
          ))}
        </div>
      </div>

      {/* Google URL */}
      <div>
        <label htmlFor="googleUrl" className="block text-sm font-semibold text-gray-900 mb-2">
          Google Review URL *
        </label>
        <input
          type="url"
          id="googleUrl"
          name="googleUrl"
          value={formData.googleUrl}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://google.com/maps/review/..."
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-900">
          Display on homepage
        </label>
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="block text-sm font-semibold text-gray-900 mb-2">
          Display Order
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="0"
        />
        <p className="text-xs text-gray-600 mt-1">Lower numbers appear first</p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : initialData ? "Update Review" : "Add Review"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
