"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  users: number;
  projects: number;
  news: number;
  testimonials: number;
  contactSubmissions: number;
  applications: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    users: 0,
    projects: 0,
    news: 0,
    testimonials: 0,
    contactSubmissions: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, projectsRes, newsRes, testimonialsRes, contactRes, applicationsRes] = await Promise.all([
          fetch("/api/users", { credentials: "include" }),
          fetch("/api/projects", { credentials: "include" }),
          fetch("/api/news", { credentials: "include" }),
          fetch("/api/testimonials", { credentials: "include" }),
          fetch("/api/contact-submissions", { credentials: "include" }),
          fetch("/api/admin/applications", { credentials: "include" }),
        ]);

        if (!usersRes.ok || !projectsRes.ok || !newsRes.ok || !testimonialsRes.ok || !contactRes.ok || !applicationsRes.ok) {
          throw new Error("Failed to fetch stats");
        }

        const users = await usersRes.json();
        const projects = await projectsRes.json();
        const news = await newsRes.json();
        const testimonials = await testimonialsRes.json();
        const contact = await contactRes.json();
        const applications = await applicationsRes.json();

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          contactSubmissions: Array.isArray(contact) ? contact.length : 0,
          applications: Array.isArray(applications) ? applications.length : 0,
        });
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the NTS Ltd admin panel</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users Card */}
            <Link
              href="/admin/users"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292m0 0H7.465M12 9.646h4.535M9 20h6a9 9 0 110-18"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">Manage users →</p>
            </Link>

            {/* Projects Card */}
            <Link
              href="/admin/projects"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.projects}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">Manage projects →</p>
            </Link>

            {/* News Card */}
            <Link
              href="/admin/news"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">News Articles</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.news}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2m-6-11a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">Manage news →</p>
            </Link>

            {/* Testimonials Card */}
            <Link
              href="/admin/testimonials"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Testimonials</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.testimonials}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">Manage testimonials →</p>
            </Link>

            {/* Contact Submissions Card */}
            <Link
              href="/admin/contact-submissions"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Contact Submissions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.contactSubmissions}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">View submissions →</p>
            </Link>

            {/* Job Applications Card */}
            <Link
              href="/admin/careers/applications"
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Job Applications</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.applications}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">View applications →</p>
            </Link>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/users/new"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center font-medium border-2 border-green-700"
          >
            + Create New User
          </Link>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center font-medium border-2 border-blue-600"
          >
            + Add New Project
          </Link>
          <Link
            href="/admin/news/new"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center font-medium border-2 border-purple-700"
          >
            + Write News Article
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-center font-medium border-2 border-yellow-600"
          >
            + Add Testimonial
          </Link>
          <Link
            href="/admin/careers/new"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-center font-medium border-2 border-emerald-700"
          >
            + Post New Job
          </Link>
          <Link
            href="/admin/careers/applications"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-center font-medium border-2 border-indigo-700"
          >
            📋 View Applications
          </Link>
        </div>
      </div>
    </div>
  );
}
