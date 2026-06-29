'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  text: string;
  published: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials', { credentials: 'include' });
        const data = await res.json();
        const testimonialsArr = Array.isArray(data) ? data : [];
        setTestimonials(testimonialsArr);
        if (testimonialsArr.length > 0 && selectedId === null) {
          setSelectedId(testimonialsArr[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const selected = testimonials.find((t) => t.id === selectedId);

  const toggleStatus = async () => {
    if (!selected) return;
    setToggling(true);
    try {
      const newStatus = !selected.published;
      const res = await fetch(`/api/testimonials/${selected.id}/published`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === selected.id ? { ...t, published: newStatus } : t))
        );
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>;

  return (
    <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 100px)', background: 'var(--slate-50)' }}>
      {/* List Column */}
      <div
        style={{
          flex: '0 0 380px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-900)', margin: 0 }}>
              Testimonials
            </h2>
            <button
              onClick={() => router.push('/admin/testimonials/new')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--green-600)',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {testimonials.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No testimonials yet
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <button
                key={testimonial.id}
                onClick={() => setSelectedId(testimonial.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedId === testimonial.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === testimonial.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  opacity: testimonial.published ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== testimonial.id) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== testimonial.id) {
                    (e.currentTarget as HTMLElement).style.background = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)' }}>
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: testimonial.published ? 'var(--green-100)' : 'var(--slate-100)',
                      color: testimonial.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {testimonial.published ? '✓ Live' : '● Draft'}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-600)' }}>
                  {testimonial.company || 'No company'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--slate-50)' }}>
        {selected ? (
          <>
            {/* Detail Header with green bar */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--border)',
                borderLeft: '3px solid var(--green-600)',
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: '0 0 8px 0' }}>
                    {selected.name}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '12px' }}>
                    {selected.company || 'No company listed'}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: selected.published ? 'var(--green-50)' : 'var(--slate-100)',
                      color: selected.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '.03em',
                    }}
                  >
                    {selected.published ? '✓ Published' : '● Draft'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={toggleStatus}
                    disabled={toggling}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: selected.published ? 'var(--green-50)' : 'var(--slate-50)',
                      color: selected.published ? 'var(--green-700)' : 'var(--slate-600)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: toggling ? 'default' : 'pointer',
                      opacity: toggling ? 0.6 : 1,
                    }}
                  >
                    {toggling ? 'Updating…' : selected.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/testimonials/${selected.id}/edit`)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      color: 'var(--slate-600)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {/* Testimonial Text */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '12px' }}>
                  Testimonial
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: 'var(--navy-900)',
                    whiteSpace: 'pre-wrap',
                    background: '#fff',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontStyle: 'italic',
                  }}
                >
                  "{selected.text}"
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--slate-500)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          >
            Select a testimonial to view details
          </div>
        )}
      </div>
    </div>
  );
}
