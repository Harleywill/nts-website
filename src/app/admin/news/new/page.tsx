"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cropper from "react-easy-crop";

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: CropData) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropConfirm = () => {
    setShowCropper(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("featured", String(formData.featured));
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (croppedArea && imagePreview) {
        const img = new Image();
        img.src = imagePreview;
        img.onload = async () => {
          const cropX = croppedArea.x / img.width;
          const cropY = croppedArea.y / img.height;
          const cropWidth = croppedArea.width / img.width;
          const cropHeight = croppedArea.height / img.height;

          data.append("cropX", String(cropX));
          data.append("cropY", String(cropY));
          data.append("cropWidth", String(cropWidth));
          data.append("cropHeight", String(cropHeight));

          await submitForm(data);
        };
      } else {
        await submitForm(data);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const submitForm = async (data: FormData) => {
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const responseData = await res.json();
        setError(responseData.error || "Failed to create news item");
        setLoading(false);
        return;
      }

      router.push("/admin/news");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">New News Item</h1>
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
              placeholder="News title"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="News content"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Image (Optional)
            </label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {imagePreview && !showCropper && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Crop area selected</p>
                <div
                  className="max-w-xs h-48 rounded-lg overflow-hidden border-2 border-green-500"
                  style={{
                    backgroundImage: `url(${imagePreview})`,
                    backgroundPosition: croppedArea
                      ? `${-croppedArea.x}px ${-croppedArea.y}px`
                      : "0 0",
                    backgroundSize: `${imagePreview ? "100% 100%" : "cover"}`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCropper(true)}
                  className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Edit Crop
                </button>
              </div>
            )}
          </div>

          {showCropper && imagePreview && (
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Select the area of the image to display
              </p>
              <div className="relative bg-gray-100 rounded" style={{ height: "400px" }}>
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onCropComplete={handleCropComplete}
                  onZoomChange={setZoom}
                  restrictPosition={false}
                />
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-900">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  Confirm Crop
                </button>
              </div>
            </div>
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

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-brand-green-500 text-white font-semibold rounded-lg hover:bg-brand-green-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create News Item"}
          </button>
          <Link
            href="/admin/news"
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
