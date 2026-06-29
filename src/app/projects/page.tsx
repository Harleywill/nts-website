"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DuctWaves from "@/components/common/DuctWaves";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  cropX?: number;
  cropY?: number;
  category: string;
  date: string;
  featured: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24 min-h-[550px] flex items-center">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <DuctWaves bands={5} speed={0.7} />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Projects
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Showcasing Our Expertise and Quality Workmanship
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="relative isolate overflow-hidden  px-6 py-24 sm:py-32 lg:px-8"
          >
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  No Projects Yet
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Check back soon as we add our completed projects and case studies.
                </p>
                <Link
                  href="/"
                  className="rounded-md px-6 py-3 font-semibold text-white transition-colors hover:opacity-90 inline-block"
                  style={{ backgroundColor: "#4caf50" }}
                >
                  Return Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <Link href={`/projects/${project.id}`}>
                      <div className="group h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-brand-green-500 cursor-pointer bg-white">
                        {/* Image Container */}
                        {project.imageUrl ? (
                          <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ objectPosition: `${(project.cropX ?? 0.5) * 100}% ${(project.cropY ?? 0.5) * 100}%` }}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                            <p className="text-gray-500 font-semibold text-sm">
                              [No Image]
                            </p>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          {/* Category Badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: "#4caf50" }}
                            >
                              {project.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(project.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-green-600 transition-colors">
                            {project.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Learn More Link */}
                          <div className="inline-flex items-center gap-2 font-semibold transition-colors" style={{ color: "#4caf50" }}>
                            View Project
                            <span aria-hidden="true">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
