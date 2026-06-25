"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Lightbox from "@/components/common/Lightbox";
import DuctWaves from "@/components/common/DuctWaves";

interface GalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  category: string;
  source: "gallery" | "project";
}

const ALL_LABEL = "All";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL_LABEL);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [ALL_LABEL, ...Array.from(new Set(items.map((i) => i.category))).sort()];
  const filtered = activeCategory === ALL_LABEL ? items : items.filter((i) => i.category === activeCategory);
  const galleryUrls = filtered.map((i) => i.imageUrl);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-16 sm:py-24 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <DuctWaves bands={4} opacity={0.5} />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "#4caf50" }}>
              Our Work
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Project Gallery
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Browse photos from our completed projects across Hull and the wider region.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      <div className="py-16 sm:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Category filter */}
          {!loading && categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? "#4caf50" : "#f1f5f9",
                    color: activeCategory === cat ? "#fff" : "#374151",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse" style={{ aspectRatio: "4/3" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 text-lg">No images in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
                  onClick={() => openLightbox(index)}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  style={{ aspectRatio: "4/3", display: "block", border: "none", padding: 0 }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.alt || item.caption || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    {item.caption && (
                      <div className="w-full px-3 py-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white text-xs font-semibold truncate">{item.caption}</p>
                        <p className="text-white/70 text-xs">{item.category}</p>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="mt-8 text-center text-sm text-gray-400">
              {filtered.length} image{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== ALL_LABEL ? ` in ${activeCategory}` : ""}
            </p>
          )}
        </div>
      </div>

      <Footer />

      {lightboxOpen && (
        <Lightbox
          images={galleryUrls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
