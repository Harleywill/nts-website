"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/common/Gallery";
import DuctWaves from "@/components/common/DuctWaves";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  date: string;
  images?: Array<{ imageUrl: string }>;
  gallery?: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        // Convert images array to gallery array for compatibility
        const projectWithGallery = {
          ...data,
          gallery: data.images?.map((img: { imageUrl: string }) => img.imageUrl) || [],
        };
        setProject(projectWithGallery);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  return (
    <>
      <Navbar />

      {loading ? (
        <div className="bg-gray-900 min-h-screen py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      ) : !project ? (
        <div className="bg-gray-900 min-h-screen py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-gray-300">Project not found.</p>
            <Link href="/" className="text-green-600 hover:text-green-400 mt-4 inline-block font-semibold transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section with Dark Background */}
          <div className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-16 sm:py-24 px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <DuctWaves bands={5} speed={0.7} />
            </div>
            <div className="mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >

                {/* Header */}
                <div className="mb-12">
                  <div className="flex items-center gap-x-4 text-sm mb-6">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: "#4caf50" }}
                    >
                      {project.category}
                    </span>
                    <time dateTime={project.date} className="text-gray-400 font-medium">
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
                    {project.title}
                  </h1>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white py-16 sm:py-24 px-6 lg:px-8"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage: `
                conic-gradient(from 90deg at 1px 1px, #0000 25%, #e0e0e0 0),
                linear-gradient(45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0),
                linear-gradient(-45deg, #0000 calc(50% - 0.5px), #e0e0e0 0 calc(50% + 0.5px), #0000 0)
              `,
              backgroundSize: '1em 1em, 2em 2em, 2em 2em',
              backgroundPosition: '-0.5px -0.5px, 0 0, 0 0'
            }}
          >
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Featured Image - Floated Right */}
                {project.imageUrl && (
                  <div className="float-right w-full sm:w-80 ml-6 mb-6 rounded-xl overflow-hidden shadow-md border-4 border-gray-200">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-base sm:text-lg">
                    {project.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="border-t border-gray-200 pt-12">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg"
                    style={{ backgroundColor: "#4caf50" }}
                  >
                    ← Back to Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <Gallery images={project.gallery} title={`${project.title} Gallery`} />
          )}
        </>
      )}

      <Footer />
    </>
  );
}
