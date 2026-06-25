'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

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
                onClick={() => setSelectedId(item.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedId === item.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === item.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  opacity: item.published ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== item.id) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== item.id) {
                    (e.currentTarget as HTMLElement).style.background = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)' }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.published ? 'var(--green-100)' : 'var(--slate-100)',
                      color: item.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.published ? '✓ Live' : '● Draft'}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)' }}>
                  {new Date(item.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    {selected.title}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '12px' }}>
                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                    onClick={() => router.push(`/admin/news/${selected.id}`)}
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
              {/* Content */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '12px' }}>
                  Article Content
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: 'var(--navy-900)',
                    whiteSpace: 'pre-wrap',
                    background: '#fff',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {selected.content}
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
            Select a news article to view details
          </div>
        )}
      </div>
    </div>
  );
}
