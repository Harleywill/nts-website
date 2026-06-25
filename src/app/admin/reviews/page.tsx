'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GoogleReview {
  id: number;
  author: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '1px' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/reviews', { credentials: 'include' });
        const data = await res.json();
        const arr: GoogleReview[] = Array.isArray(data.reviews) ? data.reviews : [];
        setReviews(arr);
        if (arr.length > 0 && selectedId === null) {
          setSelectedId(arr[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const selected = reviews.find((r) => r.id === selectedId);

  const togglePublished = async () => {
    if (!selected) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/admin/reviews/${selected.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: selected.author,
          text: selected.text,
          rating: selected.rating,
          imageUrl: selected.imageUrl,
          order: selected.order,
          published: !selected.published,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === selected.id ? { ...r, published: updated.published } : r)));
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${selected.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const remaining = reviews.filter((r) => r.id !== selected.id);
        setReviews(remaining);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setDeleting(false);
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
              Google Reviews
            </h2>
            <button
              onClick={() => router.push('/admin/reviews/new')}
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
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {reviews.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No reviews yet
            </div>
          ) : (
            reviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedId(review.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedId === review.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === review.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  opacity: review.published ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== review.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== review.id) (e.currentTarget as HTMLElement).style.background = '#fff';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)' }}>
                    {review.author}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: review.published ? 'var(--green-100)' : 'var(--slate-100)',
                      color: review.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {review.published ? '✓ Live' : '● Draft'}
                  </div>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <StarRating rating={review.rating} />
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {review.text}
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
            {/* Detail Header */}
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
                    {selected.author}
                  </h2>
                  <div style={{ marginBottom: '8px' }}>
                    <StarRating rating={selected.rating} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', marginLeft: '8px' }}>
                      {selected.rating}/5
                    </span>
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
                    onClick={togglePublished}
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
                    onClick={() => router.push(`/admin/reviews/${selected.id}/edit`)}
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
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #fca5a5',
                      background: '#fff',
                      cursor: deleting ? 'default' : 'pointer',
                      color: '#dc2626',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      opacity: deleting ? 0.6 : 1,
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {/* Review Text */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '12px' }}>
                  Review Text
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

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-500)', marginBottom: '6px' }}>Display Order</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--navy-900)' }}>{selected.order}</div>
                </div>
                {selected.imageUrl && (
                  <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-500)', marginBottom: '6px' }}>Image URL</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--navy-900)', wordBreak: 'break-all' }}>{selected.imageUrl}</div>
                  </div>
                )}
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
            Select a review to view details
          </div>
        )}
      </div>
    </div>
  );
}
