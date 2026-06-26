'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewsImage {
  id: number;
  imageUrl: string;
  alt?: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  images?: NewsImage[];
}

type DetailTab = 'details' | 'gallery';

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out',
      }}
    >
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', cursor: 'default' }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '24px',
          background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
          width: '36px', height: '36px', borderRadius: '50%',
          fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('details');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news', { credentials: 'include' });
        const data = await res.json();
        const newsArr = Array.isArray(data) ? data : [];
        setNews(newsArr);
        if (newsArr.length > 0 && selectedId === null) {
          setSelectedId(newsArr[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const selected = news.find((n) => n.id === selectedId);

  const allImages = selected
    ? [
        ...(selected.imageUrl ? [{ id: -1, imageUrl: selected.imageUrl, alt: 'Cover image', isCover: true }] : []),
        ...(selected.images?.map((img) => ({ ...img, isCover: false })) ?? []),
      ]
    : [];

  const toggleStatus = async () => {
    if (!selected) return;
    setToggling(true);
    try {
      const newStatus = !selected.published;
      const res = await fetch(`/api/news/${selected.id}/published`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      if (res.ok) {
        setNews((prev) =>
          prev.map((n) => (n.id === selected.id ? { ...n, published: newStatus } : n))
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
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

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
              News
            </h2>
            <button
              onClick={() => router.push('/admin/news/new')}
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
            {news.length} article{news.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {news.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No news articles yet
            </div>
          ) : (
            news.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSelectedId(item.id); setActiveTab('details'); }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedId === item.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === item.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== item.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== item.id) (e.currentTarget as HTMLElement).style.background = '#fff';
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: item.imageUrl ? '#000' : 'var(--navy-50)',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: item.published ? 1 : 0.5 }} />
                    : <span style={{ fontSize: '18px', opacity: 0.4 }}>📰</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px', gap: '8px' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--navy-900)',
                      opacity: item.published ? 1 : 0.65,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                      padding: '2px 6px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: item.published ? 'var(--green-100)' : 'var(--slate-100)',
                      color: item.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase', letterSpacing: '.02em',
                    }}>
                      {item.published ? '✓ Live' : '● Draft'}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
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
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid var(--border)',
              borderLeft: '3px solid var(--green-600)',
              background: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: '0 0 8px 0' }}>
                    {selected.title}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '12px' }}>
                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                    padding: '4px 10px', borderRadius: 'var(--radius-md)',
                    background: selected.published ? 'var(--green-50)' : 'var(--slate-100)',
                    color: selected.published ? 'var(--green-700)' : 'var(--slate-600)',
                    textTransform: 'uppercase', letterSpacing: '.03em',
                  }}>
                    {selected.published ? '✓ Published' : '● Draft'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={toggleStatus}
                    disabled={toggling}
                    style={{
                      padding: '8px 16px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: selected.published ? 'var(--green-50)' : 'var(--slate-50)',
                      color: selected.published ? 'var(--green-700)' : 'var(--slate-600)',
                      fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                      cursor: toggling ? 'default' : 'pointer', opacity: toggling ? 0.6 : 1,
                    }}
                  >
                    {toggling ? 'Updating…' : selected.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/news/${selected.id}`)}
                    style={{
                      width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)', background: '#fff', cursor: 'pointer',
                      color: 'var(--slate-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', background: '#fff', paddingLeft: '28px' }}>
              {(['details', 'gallery'] as DetailTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 16px',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '.06em',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: activeTab === tab ? 'var(--green-700)' : 'var(--slate-400)',
                    borderBottom: activeTab === tab ? '2px solid var(--green-600)' : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'color 0.15s',
                  }}
                >
                  {tab === 'gallery' ? `Gallery (${allImages.length})` : tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {activeTab === 'details' ? (
                <>
                  {/* Cover image preview */}
                  {selected.imageUrl && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '10px' }}>
                        Cover Image
                      </div>
                      <div
                        onClick={() => setLightboxSrc(selected.imageUrl!)}
                        style={{
                          width: '100%', maxWidth: '480px', aspectRatio: '16/9',
                          borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'zoom-in',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <img src={selected.imageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '12px' }}>
                      Article Content
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7,
                      color: 'var(--navy-900)', whiteSpace: 'pre-wrap',
                      background: '#fff', padding: '20px',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                    }}>
                      {selected.content}
                    </div>
                  </div>
                </>
              ) : (
                /* Gallery tab */
                allImages.length === 0 ? (
                  <div style={{ textAlign: 'center', paddingTop: '60px', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                    No images attached to this article
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {allImages.map((img) => (
                      <div key={img.id} style={{ position: 'relative' }}>
                        <div
                          onClick={() => setLightboxSrc(img.imageUrl)}
                          style={{
                            width: '100%', aspectRatio: '4/3',
                            borderRadius: 'var(--radius-md)', overflow: 'hidden',
                            cursor: 'zoom-in', border: '1px solid var(--border)',
                          }}
                        >
                          <img src={img.imageUrl} alt={img.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        </div>
                        {'isCover' in img && img.isCover && (
                          <div style={{
                            position: 'absolute', top: '6px', left: '6px',
                            background: 'rgba(0,0,0,0.65)', color: '#fff',
                            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '.04em',
                          }}>
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Select a news article to view details
          </div>
        )}
      </div>
    </div>
  );
}
