import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NTS Admin</h1>
          <div className="flex gap-6 items-center">
            <Link href="/admin/dashboard" className="hover:text-green-400">
              Dashboard
            </Link>
            <Link href="/admin/contact-submissions" className="hover:text-green-400">
              Contact
            </Link>
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
            <Link href="/admin/settings" className="hover:text-green-400">
              Settings
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
