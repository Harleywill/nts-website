'use client';

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDelete, MdImage, MdOpenInNew } from 'react-icons/md';
import Link from 'next/link';

type ImageSource = 'gallery' | 'project' | 'news';

interface GalleryImageItem {
  id: number;
  imageUrl: string;
  alt: string;
  caption: string;
  category: string;
  published: boolean;
  order: number;
  source: ImageSource;
  sourceLabel: string | null;
  sourceId: number | null;
}

const SOURCE_CONFIG: Record<ImageSource, { label: string; bg: string; color: string }> = {
  gallery: { label: 'Gallery', bg: 'var(--slate-100)',  color: 'var(--slate-600)' },
  project: { label: 'Project', bg: '#dbeafe',           color: '#1d4ed8' },
  news:    { label: 'News',    bg: 'var(--green-50)',   color: 'var(--green-700)' },
};

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

type FilterTab = 'all' | ImageSource;

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
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<GalleryImageItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/gallery', { credentials: 'include' })
      .then(r => r.json())
      .then((data: GalleryImageItem[]) => setImages(Array.isArray(data) ? data : []))
      .catch(() => showToast('Failed to load gallery', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredImages = filter === 'all' ? images : images.filter(img => img.source === filter);

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
          const newImg = await createRes.json() as GalleryImageItem;
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
    if (!selected || selected.source !== 'gallery') return;
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
        const updated = await res.json() as GalleryImageItem;
        setImages(prev => prev.map(img => img.id === updated.id && img.source === 'gallery' ? updated : img));
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
    if (!confirm('Delete this image from the gallery?')) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => !(img.id === id && img.source === 'gallery')));
        if (selected?.id === id && selected.source === 'gallery') setSelected(null);
        showToast('Deleted');
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Error deleting', 'error');
    }
  };

  const counts = {
    all: images.length,
    gallery: images.filter(i => i.source === 'gallery').length,
    project: images.filter(i => i.source === 'project').length,
    news: images.filter(i => i.source === 'news').length,
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Left panel — image grid */}
      <div style={{
        width: '440px', flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
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

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '-1px' }}>
            {(['all', 'gallery', 'project', 'news'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '7px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '.05em',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: filter === tab ? 'var(--green-700)' : 'var(--slate-400)',
                  borderBottom: filter === tab ? '2px solid var(--green-600)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab === 'all' ? `All (${counts.all})` : `${SOURCE_CONFIG[tab as ImageSource].label} (${counts[tab as ImageSource]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {loading ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)', textAlign: 'center', paddingTop: '40px' }}>
              Loading…
            </p>
          ) : filteredImages.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <MdImage size={48} style={{ color: 'var(--slate-300)', marginBottom: '12px' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)' }}>
                {filter === 'all' ? 'No images yet. Click Upload to add some.' : `No ${filter} images.`}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {filteredImages.map(img => (
                <button
                  key={`${img.source}-${img.id}`}
                  onClick={() => setSelected(img)}
                  style={{
                    padding: 0, border: `2px solid ${selected?.id === img.id && selected?.source === img.source ? 'var(--green-600)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer',
                    background: 'var(--slate-100)', aspectRatio: '1',
                    opacity: img.published ? 1 : 0.5,
                    transition: 'border-color 0.15s',
                    position: 'relative',
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.alt || 'Gallery image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Source badge */}
                  {img.source !== 'gallery' && (
                    <div style={{
                      position: 'absolute', bottom: '4px', right: '4px',
                      background: SOURCE_CONFIG[img.source].bg,
                      color: SOURCE_CONFIG[img.source].color,
                      fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700,
                      padding: '1px 4px', borderRadius: '3px', textTransform: 'uppercase',
                    }}>
                      {SOURCE_CONFIG[img.source].label}
                    </div>
                  )}
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
              Select an image to view details
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '560px' }}>
            {/* Preview */}
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '20px', background: 'var(--slate-100)' }}>
              <img
                src={selected.imageUrl}
                alt={selected.alt || 'Gallery image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Source badge + link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                padding: '3px 10px', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase', letterSpacing: '.04em',
                background: SOURCE_CONFIG[selected.source].bg,
                color: SOURCE_CONFIG[selected.source].color,
              }}>
                {SOURCE_CONFIG[selected.source].label}
              </span>
              {selected.sourceLabel && selected.sourceId !== null && (
                <Link
                  href={`/admin/${selected.source === 'project' ? 'projects' : 'news'}/${selected.sourceId}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)',
                    textDecoration: 'none',
                  }}
                >
                  {selected.sourceLabel}
                  <MdOpenInNew size={13} style={{ color: 'var(--slate-400)' }} />
                </Link>
              )}
            </div>

            {selected.source === 'gallery' ? (
              <>
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
              </>
            ) : (
              <div style={{
                padding: '16px', borderRadius: 'var(--radius-md)',
                background: 'var(--slate-50)', border: '1px solid var(--border)',
                fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)',
              }}>
                This image is part of a {selected.source}. To edit or remove it, go to the{' '}
                <Link href={`/admin/${selected.source === 'project' ? 'projects' : 'news'}`}
                  style={{ color: 'var(--green-700)', textDecoration: 'underline' }}>
                  {selected.source === 'project' ? 'Projects' : 'News'} section
                </Link>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
