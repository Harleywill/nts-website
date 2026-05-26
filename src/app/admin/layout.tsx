"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for auth token from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    setAuthToken(token || null);
    setIsChecking(false);

    if (!token && pathname !== "/admin/login") {
      redirect("/admin/login");
    }
  }, [pathname]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  // Don't show the nav for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NTS Admin</h1>
          <div className="flex gap-6 items-center">
            <Link href="/admin/projects" className="hover:text-green-400">
              Projects
            </Link>
            <Link href="/admin/testimonials" className="hover:text-green-400">
              Testimonials
            </Link>
            <Link href="/admin/news" className="hover:text-green-400">
              News
            </Link>
            <Link href="/admin/users" className="hover:text-green-400">
              Users
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button className="hover:text-red-400">Logout</button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
