'use client';

import { usePathname } from "next/navigation";
import ProtectedLayout from "@/components/admin/ProtectedLayout";
import { AdminShell } from "@/components/admin/shell/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // The login page must render bare — no sidebar/shell — since the visitor
  // isn't authenticated yet. Every other admin route is wrapped in the
  // protected shell, which only renders once the session is verified.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Change-password also renders bare (but still behind ProtectedLayout's
  // auth check) — new/reset accounts get forced here before anything else,
  // and there should be no sidebar nav to click away through in the meantime.
  if (pathname === "/admin/change-password") {
    return <ProtectedLayout>{children}</ProtectedLayout>;
  }

  return (
    <ProtectedLayout>
      <AdminShell>
        <div className="p-8 max-w-7xl">
          {children}
        </div>
      </AdminShell>
    </ProtectedLayout>
  );
}
