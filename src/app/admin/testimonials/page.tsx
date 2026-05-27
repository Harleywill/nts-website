'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminListPage } from '@/components/admin/templates/AdminListPage';
import { ColumnDef } from '@/components/admin/templates/AdminListPage';
import { useSearchParams } from 'next/navigation';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  featured: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchTestimonials();
  }, [searchQuery]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/testimonials${query}`);
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(testimonials.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete testimonial');
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      key: "name",
      label: "Name",
      width: "w-40",
    },
    {
      key: "company",
      label: "Company",
      width: "w-40",
    },
    {
      key: "text",
      label: "Text",
      width: "flex-1",
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
      title="Testimonials"
      items={testimonials}
      columns={columns}
      newUrl="/admin/testimonials/new"
      newLabel="+ New Testimonial"
      searchPlaceholder="Search by name, company, or text..."
      emptyStateMessage="No testimonials found"
      renderActions={(item: Testimonial) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/testimonials/${item.id}/edit`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="Edit"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteTestimonial(item.id)}
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
