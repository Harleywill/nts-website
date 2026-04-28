"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8">NTS Admin</h1>
        <nav className="space-y-4">
          <Link
            href="/admin/projects"
            className="block px-4 py-2 rounded hover:bg-blue-800"
          >
            Projects
          </Link>
          <Link
            href="/admin/testimonials"
            className="block px-4 py-2 rounded hover:bg-blue-800"
          >
            Testimonials
          </Link>
          <Link
            href="/admin/news"
            className="block px-4 py-2 rounded hover:bg-blue-800"
          >
            News
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 rounded hover:bg-blue-800"
          >
            Users
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full mt-auto block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-8"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">NTS Admin</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </header>

        {/* Mobile Menu */}
        {isMounted && isMenuOpen && (
          <nav className="md:hidden bg-blue-800 text-white">
            <Link
              href="/admin/projects"
              className="block px-4 py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/admin/testimonials"
              className="block px-4 py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/admin/news"
              className="block px-4 py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Users
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-green-500 text-white text-left"
            >
              Logout
            </button>
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
