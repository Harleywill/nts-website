'use client';

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDelete, MdImage, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

interface HeroImageItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  alt: string | null;
  order: number;
  published: boolean;
}

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
const hintStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-400)', margin: '6px 0 0',
};
const arrowButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: '#fff',
  color: 'var(--slate-600)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
});

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

export default function HeroImagesAdminPage() {
  const [images, setImages] = useState<HeroImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<HeroImageItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/hero-images', { credentials: 'include' })
      .then(r => r.json())
      .then((data: HeroImageItem[]) => {
        const arr = Array.isArray(data) ? data : [];
        setImages(arr);
        if (arr.length > 0) setSelected(arr[0]);
      })
      .catch(() => showToast('Failed to load hero images', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    let lastError = '';
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      fd.append('kind', 'hero');
      try {
        const uploadRes = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({})) as { error?: string };
          lastError = err.error || 'Upload failed';
          continue;
        }
        const { url } = await uploadRes.json() as { url: string };
        const createRes = await fetch('/api/admin/hero-images', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url }),
        });
        if (createRes.ok) {
          const newImg = await createRes.json() as HeroImageItem;
          setImages(prev => [...prev, newImg]);
          setSelected(newImg);
          added++;
        }
      } catch { /* skip failed file */ }
    }
    if (added > 0) showToast(`${added} image${added > 1 ? 's' : ''} added to the hero`);
    else showToast(lastError || 'Upload failed', 'error');
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hero-images/${selected.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: selected.caption ?? '',
          alt: selected.alt ?? '',
          published: selected.published,
        }),
      });
      if (res.ok) {
        const updated = await res.json() as HeroImageItem;
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
    if (!confirm('Remove this image from the home page hero?')) return;
    try {
      const res = await fetch(`/api/admin/hero-images/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        const remaining = images.filter(img => img.id !== id);
        setImages(remaining);
        setSelected(remaining[0] ?? null);
        showToast('Deleted');
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Error deleting', 'error');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const previous = images;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    try {
      const res = await fetch('/api/admin/hero-images/reorder', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map(img => img.id) }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setImages(previous);
      showToast('Failed to reorder', 'error');
    }
  };

  const liveCount = images.filter(img => img.published).length;

  return (
    // Fixed height so the list and the detail panel scroll independently.
    // Mirrors the gallery admin layout.
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', minHeight: 0 }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Left panel — ordered slide list */}
      <div style={{
        width: '400px', flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--navy-800)', margin: 0 }}>
              Hero Images
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
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} style={{ display: 'none' }} />
          </div>
          <p style={{ ...hintStyle, marginTop: '8px' }}>
            Slides on the home page, shown top to bottom. {liveCount} live. Landscape photos at least 1920px wide work best (max 10MB).
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)', textAlign: 'center', paddingTop: '40px' }}>
              Loading…
            </p>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <MdImage size={48} style={{ color: 'var(--slate-300)', marginBottom: '12px' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)' }}>
                No hero images. The home page is showing the default set. Click Upload to add your own.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {images.map((img, index) => {
                const isSelected = selected?.id === img.id;
                return (
                  <div
                    key={img.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--green-600)' : 'var(--border)'}`,
                      background: '#fff',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)', width: '16px', textAlign: 'center' }}>
                      {index + 1}
                    </span>
                    <button
                      onClick={() => setSelected(img)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0,
                        padding: 0, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.alt || 'Hero image'}
                        style={{
                          width: '88px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)',
                          flexShrink: 0, opacity: img.published ? 1 : 0.45,
                        }}
                      />
                      <span style={{ minWidth: 0 }}>
                        <span style={{
                          display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                          color: img.caption ? 'var(--navy-800)' : 'var(--slate-400)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {img.caption || 'No caption'}
                        </span>
                        <span style={{
                          display: 'inline-block', marginTop: '4px',
                          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                          padding: '1px 6px', borderRadius: '3px',
                          background: img.published ? 'var(--green-100)' : 'var(--slate-100)',
                          color: img.published ? 'var(--green-700)' : 'var(--slate-600)',
                        }}>
                          {img.published ? 'Live' : 'Hidden'}
                        </span>
                      </span>
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} style={arrowButtonStyle(index === 0)}>
                        <MdArrowUpward size={14} />
                      </button>
                      <button aria-label="Move down" disabled={index === images.length - 1} onClick={() => move(index, 1)} style={arrowButtonStyle(index === images.length - 1)}>
                        <MdArrowDownward size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — preview and details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <MdImage size={64} style={{ color: 'var(--slate-200)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate-400)' }}>
              Select an image to edit it
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '640px' }}>
            {/* Preview — caption sits where it will on the home page */}
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', marginBottom: '20px', background: 'var(--slate-100)',
            }}>
              <img
                src={selected.imageUrl}
                alt={selected.alt || 'Hero image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
              {selected.caption && (
                <span style={{
                  position: 'absolute', right: '14px', bottom: '12px',
                  fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
                  color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                }}>
                  {selected.caption}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Caption (optional)</label>
                <input
                  type="text"
                  value={selected.caption ?? ''}
                  maxLength={80}
                  onChange={e => setSelected({ ...selected, caption: e.target.value })}
                  style={fieldStyle}
                  placeholder="Vida Del Padle, Hull"
                />
                <p style={hintStyle}>Small text in the bottom-right corner of the hero. Leave blank for none.</p>
              </div>

              <div>
                <label style={labelStyle}>Alt Text</label>
                <input
                  type="text"
                  value={selected.alt ?? ''}
                  onChange={e => setSelected({ ...selected, alt: e.target.value })}
                  style={fieldStyle}
                  placeholder="Engineer commissioning a rooftop AHU"
                />
                <p style={hintStyle}>Describes the photo for screen readers and search engines.</p>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selected.published}
                  onChange={e => setSelected({ ...selected, published: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-800)', fontWeight: 500 }}>
                  Show on the home page
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
