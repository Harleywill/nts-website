'use client';

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDelete, MdImage } from 'react-icons/md';

interface GalleryImage {
  id: number;
  imageUrl: string;
  alt: string;
  caption: string;
  category: string;
  published: boolean;
  order: number;
}

const CATEGORIES = ['General', 'Commercial', 'Residential', 'Industrial', 'Air Conditioning', 'Plumbing & Heating', 'Ventilation'];

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)', fontFamily: 'var(--font-body)',
  fontSize: '14px', color: 'var(--navy-800)', background: '#fff', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)',
  display: 'block', marginBottom: '6px',
};

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      padding: '12px 18px', borderRadius: 'var(--radius-md)',
      background: type === 'success' ? 'var(--green-600)' : '#dc2626',
      color: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {message}
    </div>
  );
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/gallery', { credentials: 'include' })
      .then(r => r.json())
      .then((data: GalleryImage[]) => setImages(Array.isArray(data) ? data : []))
      .catch(() => showToast('Failed to load gallery', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      try {
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!uploadRes.ok) continue;
        const { url } = await uploadRes.json() as { url: string };
        const createRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url }),
        });
        if (createRes.ok) {
          const newImg = await createRes.json() as GalleryImage;
          setImages(prev => [newImg, ...prev]);
          added++;
        }
      } catch { /* skip failed file */ }
    }
    if (added > 0) showToast(`${added} image${added > 1 ? 's' : ''} uploaded`);
    else showToast('Upload failed', 'error');
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery/${selected.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: selected.alt,
          caption: selected.caption,
          category: selected.category,
          published: selected.published,
        }),
      });
      if (res.ok) {
        const updated = await res.json() as GalleryImage;
        setImages(prev => prev.map(img => img.id === updated.id ? updated : img));
        setSelected(updated);
        showToast('Saved');
      } else {
        showToast('Failed to save', 'error');
      }
    } catch {
      showToast('Error saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        if (selected?.id === id) setSelected(null);
        showToast('Deleted');
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Error deleting', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Left panel — image grid */}
      <div style={{
        width: '420px', flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--navy-800)', margin: 0 }}>
              Gallery
            </h1>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: 'var(--radius-md)', border: 'none',
                background: 'var(--green-600)', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                cursor: uploading ? 'default' : 'pointer', opacity: uploading ? 0.6 : 1,
              }}
            >
              <MdAdd size={16} />
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
            {images.length} image{images.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {loading ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)', textAlign: 'center', paddingTop: '40px' }}>
              Loading…
            </p>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <MdImage size={48} style={{ color: 'var(--slate-300)', marginBottom: '12px' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)' }}>
                No images yet. Click Upload to add some.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {images.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelected(img)}
                  style={{
                    padding: 0, border: `2px solid ${selected?.id === img.id ? 'var(--green-600)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer',
                    background: 'var(--slate-100)', aspectRatio: '1',
                    opacity: img.published ? 1 : 0.5,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.alt || 'Gallery image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <MdImage size={64} style={{ color: 'var(--slate-200)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)' }}>
              Select an image to edit its details
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '560px' }}>
            {/* Preview */}
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px', background: 'var(--slate-100)' }}>
              <img
                src={selected.imageUrl}
                alt={selected.alt || 'Gallery image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Caption</label>
                <input
                  type="text"
                  value={selected.caption}
                  onChange={e => setSelected({ ...selected, caption: e.target.value })}
                  style={fieldStyle}
                  placeholder="Short description of this image"
                />
              </div>

              <div>
                <label style={labelStyle}>Alt Text</label>
                <input
                  type="text"
                  value={selected.alt}
                  onChange={e => setSelected({ ...selected, alt: e.target.value })}
                  style={fieldStyle}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={selected.category}
                  onChange={e => setSelected({ ...selected, category: e.target.value })}
                  style={fieldStyle}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selected.published}
                  onChange={e => setSelected({ ...selected, published: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)', fontWeight: 500 }}>
                  Published (visible on public gallery)
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: 'none',
                  background: 'var(--green-600)', color: '#fff',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                  cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                style={{
                  padding: '10px 16px', borderRadius: 'var(--radius-md)',
                  border: '1px solid #dc2626', background: 'transparent',
                  color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                }}
              >
                <MdDelete size={16} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
