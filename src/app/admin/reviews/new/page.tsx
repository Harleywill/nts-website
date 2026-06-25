'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--navy-900)',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '.04em',
  color: 'var(--slate-600)',
  marginBottom: '6px',
};

export default function NewReviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    text: '',
    imageUrl: '',
    order: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.imageUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create review');
        setLoading(false);
        return;
      }

      router.push('/admin/reviews');
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={() => router.push('/admin/reviews')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '12px' }}
        >
          ← Back to Reviews
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: 0 }}>
          Add Google Review
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {error && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Author */}
        <div>
          <label style={labelStyle}>Author Name *</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} required style={inputStyle} placeholder="e.g. John Smith" />
        </div>

        {/* Rating */}
        <div>
          <label style={labelStyle}>Rating (1–5) *</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: formData.rating >= star ? '#fef3c7' : '#fff',
                  color: formData.rating >= star ? '#f59e0b' : 'var(--slate-400)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ★
              </button>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-500)', marginLeft: '4px' }}>
              {formData.rating}/5
            </span>
          </div>
        </div>

        {/* Text */}
        <div>
          <label style={labelStyle}>Review Text *</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows={5}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Enter the review text…"
          />
        </div>

        {/* Image URL */}
        <div>
          <label style={labelStyle}>Image URL (optional)</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputStyle} placeholder="https://…" />
        </div>

        {/* Order */}
        <div>
          <label style={labelStyle}>Display Order</label>
          <input type="number" name="order" value={formData.order} onChange={handleChange} style={{ ...inputStyle, width: '120px' }} min={0} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-500)', margin: '4px 0 0 0' }}>Lower numbers appear first</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 24px',
              background: 'var(--green-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Adding…' : 'Add Review'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/reviews')}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: 'var(--slate-600)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
