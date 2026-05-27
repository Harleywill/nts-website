'use client';

import ProtectedLayout from "@/components/admin/ProtectedLayout";
import { AdminShell } from "@/components/admin/shell/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
