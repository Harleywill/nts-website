'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Quote } from 'lucide-react';
import { canEdit, canDelete } from '@/lib/admin/permissions';

interface Testimonial {
  id: string;
  text: string;
  name: string;
  company?: string;
  featured: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    fetch('/api/testimonials', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const testimonialsData = Array.isArray(data) ? data : data.testimonials || [];
        setTestimonials(testimonialsData);
      })
      .catch((error) => console.error('Failed to fetch testimonials:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Delete testimonial from ${author}?`)) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const showEditDelete = canEdit(userRole as any) || canDelete(userRole as any);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="mepm-h2 text-navy-700">Testimonials</h1>
          <p className="mepm-spec mt-1 text-slate-500">
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canEdit(userRole as any) && (
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
          >
            <Plus size={17} /> Add testimonial
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-slate-400">Loading…</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center">
          <p className="mepm-spec text-slate-400">No testimonials yet</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow overflow-hidden"
              style={{
                borderTop: '3px solid #4caf50',
              }}
            >
              <div style={{ padding: '20px' }}>
                {/* Quote Icon */}
                <div style={{ marginBottom: '12px' }}>
                  <Quote
                    size={24}
                    style={{ color: '#4caf50' }}
                  />
                </div>

                {/* Quote Text */}
                <p style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#1a2f6e',
                  margin: '0 0 16px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  "{testimonial.text}"
                </p>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: '#e5e7eb',
                  margin: '16px 0',
                }}></div>

                {/* Author */}
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#1a2f6e',
                    margin: 0,
                  }}>
                    {testimonial.name}
                  </p>
                  {testimonial.company && (
                    <p style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: '2px 0 0 0',
                    }}>
                      {testimonial.company}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {showEditDelete && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '12px',
                    marginTop: '12px',
                  }}>
                    {canEdit(userRole as any) && (
                      <Link
                        href={`/admin/testimonials/${testimonial.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                    )}
                    {canDelete(userRole as any) && (
                      <button
                        onClick={() => handleDelete(testimonial.id, testimonial.name)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
