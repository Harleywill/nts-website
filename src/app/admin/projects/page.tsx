'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminListPage } from '@/components/admin/templates/AdminListPage';
import { ColumnDef } from '@/components/admin/templates/AdminListPage';
import { useSearchParams } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  category: string;
  date: string;
  featured: boolean;
}

export default function AdminProjectsPage() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProjects();
  }, [searchQuery]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/projects${query}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      key: "title",
      label: "Title",
      width: "flex-1",
    },
    {
      key: "category",
      label: "Category",
      width: "w-32",
    },
    {
      key: "date",
      label: "Date",
      width: "w-32",
    },
    {
      key: "featured",
      label: "Featured",
      width: "w-24",
      align: "center",
    },
  ];

  return (
    <AdminListPage
      title="Projects"
      items={projects}
      columns={columns}
      newUrl="/admin/projects/new"
      newLabel="+ New Project"
      searchPlaceholder="Search by title, description, or category..."
      emptyStateMessage="No projects found"
      renderActions={(item: Project) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/projects/${item.id}/edit`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="Edit"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteProject(item.id)}
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
