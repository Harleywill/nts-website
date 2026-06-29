"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTrash, FaPlus } from "react-icons/fa";
import FocalPointPicker from "@/components/admin/FocalPointPicker";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Residential",
    date: new Date().toISOString().split("T")[0],
    featured: false,
    clientName: "",
    duration: "",
    highlights: "",
    metrics: "",
    imageUrl: "",
    cropX: 0.5,
    cropY: 0.5,
    cropWidth: 1,
    cropHeight: 1,
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        setError("Failed to upload image");
        setUploading(false);
        return;
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
        cropX: 0.5,
        cropY: 0.5,
      }));
      setUploading(false);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };


  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    let errorOccurred = false;

    try {
      // Upload all files in sequence
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formDataToSend,
          });

          if (!res.ok) {
            errorOccurred = true;
            continue;
          }

          const data = await res.json();
          uploadedUrls.push(data.url);
        } catch (err) {
          errorOccurred = true;
          continue;
        }
      }

      if (uploadedUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      }

      if (errorOccurred) {
        setError(`Failed to upload some images. ${uploadedUrls.length} uploaded successfully.`);
      }

      setUploading(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gallery: galleryImages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create project");
        setLoading(false);
        return;
      }

      router.push("/admin/projects");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">New Project</h1>
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
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Project title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Project description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Client Name (Optional)
              </label>
              <input
                id="clientName"
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g., Boots Store"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Duration (Optional)
              </label>
              <input
                id="duration"
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 2 weeks"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="highlights"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Key Highlights (Optional)
            </label>
            <textarea
              id="highlights"
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              rows={3}
              placeholder="One per line"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="metrics"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Key Metrics (Optional)
            </label>
            <textarea
              id="metrics"
              name="metrics"
              value={formData.metrics}
              onChange={handleChange}
              rows={3}
              placeholder="One per line"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Main Project Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Main Project Image
            </label>
            <div className="space-y-4">
              {formData.imageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={formData.imageUrl}
                    alt="Project"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-green-500 text-gray-700 font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Main Image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {formData.imageUrl && (
            <FocalPointPicker
              imageUrl={formData.imageUrl}
              cropX={formData.cropX}
              cropY={formData.cropY}
              onChange={(x, y) => setFormData((prev) => ({ ...prev, cropX: x, cropY: y }))}
            />
          )}

          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-brand-green-500 rounded focus:ring-2 focus:ring-green-500"
            />
            <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-900">
              Featured on homepage
            </label>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
          <p className="text-gray-600 mb-6">Add multiple images to showcase different aspects of your project</p>

          <div className="space-y-6">
            {/* Gallery Images Grid */}
            {galleryImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Images ({galleryImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Gallery Image Button */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-3 px-4 border-2 border-dashed border-green-300 rounded-lg hover:border-brand-green-500 hover:bg-brand-green-50 text-green-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaPlus size={18} />
              {uploading ? "Uploading..." : "Add Image to Gallery"}
            </button>
            <input
              ref={galleryInputRef}
              multiple
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-brand-green-500 text-white font-semibold rounded-lg hover:bg-brand-green-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <Link
            href="/admin/projects"
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
