'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string | number;
  type: 'news' | 'project' | 'testimonial' | 'user' | 'contact' | 'application';
  name?: string;
}

export default function DeleteButton({ id, type, name }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmMsg = name 
      ? `Delete "${name}"?` 
      : 'Are you sure you want to delete this item?';
    
    if (!confirm(confirmMsg)) return;

    setDeleting(true);
    try {
      const endpoints: Record<string, string> = {
        news: `/api/news/${id}`,
        project: `/api/projects/${id}`,
        testimonial: `/api/testimonials/${id}`,
        user: `/api/users/${id}`,
        contact: `/api/contact-submissions?id=${id}`,
        application: `/api/admin/applications/${id}`,
      };

      const res = await fetch(endpoints[type], {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      
      // Refresh the page to show updated list
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-nts-danger hover:text-red-300 text-xs font-mono transition-colors disabled:opacity-50"
      title="Delete"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
