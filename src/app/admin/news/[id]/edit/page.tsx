"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTrash, FaPlus } from "react-icons/fa";
import FocalPointPicker from "@/components/admin/FocalPointPicker";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  featured: boolean;
  published: boolean;
  images: { id: number; imageUrl: string }[];
}

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newsId, setNewsId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<NewsItem, "images"> | null>(null);
  const [coverImage, setCoverImage] = useState<string>("");
  const [cropX, setCropX] = useState(0.5);
  const [cropY, setCropY] = useState(0.5);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params.then(({ id }) => setNewsId(id));
  }, [params]);

  useEffect(() => {
    if (!newsId) return;
    fetch(`/api/news/${newsId}`)
      .then((r) => r.json())
      .then((data: NewsItem) => {
        setFormData({
          id: data.id, title: data.title, content: data.content,
          imageUrl: data.imageUrl, featured: data.featured, published: data.published,
          cropX: data.cropX, cropY: data.cropY, cropWidth: data.cropWidth, cropHeight: data.cropHeight,
        });
        setCoverImage(data.imageUrl ?? "");
        setCropX(data.cropX ?? 0.5);
        setCropY(data.cropY ?? 0.5);
        setGalleryImages(data.images?.map((img) => img.imageUrl) ?? []);
      })
      .catch(() => setError("Failed to load news item"))
      .finally(() => setLoading(false));
  }, [newsId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) return null;
      return (await res.json()).url as string;
    } catch {
      return null;
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setCoverImage(url);
      setCropX(0.5);
      setCropY(0.5);
    } else {
      setError("Failed to upload cover image");
    }
    setUploading(false);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) urls.push(url);
      else failed++;
    }
    if (urls.length > 0) setGalleryImages((prev) => [...prev, ...urls]);
    if (failed > 0) setError(`${failed} image(s) failed to upload`);
    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl: coverImage,
          featured: formData.featured,
          published: formData.published,
          cropX,
          cropY,
          cropWidth: 1,
          cropHeight: 1,
          gallery: galleryImages,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update news item");
        setSubmitting(false);
        return;
      }
      router.push("/admin/news");
    } catch {
      setError("An error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-gray-500">Loading…</div>;
  if (!formData) return <div className="py-8 text-red-600">{error || "News item not found"}</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit News Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">Title</label>
            <input
              id="title" type="text" name="title" value={formData.title}
              onChange={handleChange} required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="News title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">Content</label>
            <textarea
              id="content" name="content" value={formData.content}
              onChange={handleChange} required rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="News content"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Cover Image</label>
            {coverImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 mb-3">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
            <button
              type="button" onClick={() => coverInputRef.current?.click()} disabled={uploading}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 text-gray-700 font-semibold disabled:opacity-50"
            >
              {uploading ? "Uploading…" : coverImage ? "Change Cover Image" : "Upload Cover Image"}
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </div>

          {/* Focal Point Picker — only shown when a cover image is set */}
          {coverImage && (
            <FocalPointPicker
              imageUrl={coverImage}
              cropX={cropX}
              cropY={cropY}
              onChange={(x, y) => { setCropX(x); setCropY(y); }}
            />
          )}

          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2">
              <input
                id="featured" type="checkbox" name="featured" checked={formData.featured}
                onChange={handleChange} className="w-4 h-4 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-900">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="published" type="checkbox" name="published" checked={formData.published}
                onChange={handleChange} className="w-4 h-4 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-900">Published</span>
            </label>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
          <p className="text-sm text-gray-500 mb-6">
            Add multiple images — they'll display as a scrollable gallery on the article page.
          </p>

          {galleryImages.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Images ({galleryImages.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-300" style={{ aspectRatio: "16/9" }}>
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button" onClick={() => galleryInputRef.current?.click()} disabled={uploading}
            className="w-full py-3 px-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-green-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaPlus size={16} />
            {uploading ? "Uploading…" : "Add Images to Gallery"}
          </button>
          <input ref={galleryInputRef} multiple type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit" disabled={submitting || uploading}
            className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save News Item"}
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
