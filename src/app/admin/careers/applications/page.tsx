'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminListPage } from '@/components/admin/templates/AdminListPage';
import { ColumnDef } from '@/components/admin/templates/AdminListPage';
import { useSearchParams } from 'next/navigation';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
  job?: {
    id: string;
    title: string;
  };
}

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchApplications();
  }, [searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/admin/applications${query}`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete application');
      setApplications(applications.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete application');
    }
  };

  const columns: ColumnDef<Application>[] = [
    {
      key: "fullName",
      label: "Name",
      width: "w-40",
    },
    {
      key: "email",
      label: "Email",
      width: "flex-1",
    },
    {
      key: "phone",
      label: "Phone",
      width: "w-32",
    },
    {
      key: "status",
      label: "Status",
      width: "w-24",
      align: "center",
    },
  ];

  return (
    <AdminListPage
      title="Applications"
      items={applications}
      columns={columns}
      searchPlaceholder="Search by name or email..."
      emptyStateMessage="No applications found"
      renderActions={(item: Application) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/careers/applications/${item.id}`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="View"
          >
            View
          </Link>
          <button
            onClick={() => deleteApplication(item.id)}
            className="text-nts-danger hover:text-red-300 text-xs font-mono transition-colors"
            title="Delete"
          >
            Delete
          </button>
        </div>
      )}
    />
  );
}
