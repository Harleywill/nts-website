'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectImage {
  id: number;
  imageUrl: string;
  alt?: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  cropX?: number;
  cropY?: number;
  published: boolean;
  featured: boolean;
  clientName: string | null;
  date: string;
  highlights: string | null;
  metrics: string | null;
  createdAt: string;
  images: ProjectImage[];
}

type DetailTab = 'details' | 'gallery';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('details');
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const arr: Project[] = Array.isArray(data) ? data : [];
        setProjects(arr);
        if (arr.length > 0 && selectedId === null) setSelectedId(arr[0].id);
      })
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const selected = projects.find((p) => p.id === selectedId);

  const toggleStatus = async () => {
    if (!selected || toggling) return;
    setToggling(true);
    try {
      const newStatus = !selected.published;
      const res = await fetch(`/api/projects/${selected.id}/published`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newStatus }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === selected.id ? { ...p, published: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setToggling(false);
    }
  };

  // All images for the selected project: main imageUrl + gallery images, deduplicated
  const allImages = (() => {
    if (!selected) return [];
    const gallery = selected.images.map((img) => ({ url: img.imageUrl, alt: img.alt ?? selected.title }));
    if (selected.imageUrl && !gallery.some((g) => g.url === selected.imageUrl)) {
      return [{ url: selected.imageUrl, alt: selected.title }, ...gallery];
    }
    return gallery;
  })();

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 100px)', background: '#fff' }}>

        {/* Left list */}
        <div style={{
          flex: '0 0 380px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-800)', margin: 0 }}>
                Projects
              </h2>
              <button
                onClick={() => router.push('/admin/projects/new')}
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
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Loading…</div>
            ) : projects.length === 0 ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>No projects yet</div>
            ) : projects.map((project) => (
              <button
                key={project.id}
                onClick={() => { setSelectedId(project.id); setDetailTab('details'); }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: selectedId === project.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === project.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  opacity: project.published ? 1 : 0.65,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => { if (selectedId !== project.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
                onMouseLeave={(e) => { if (selectedId !== project.id) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--navy-100)',
                  border: '1px solid var(--border)',
                }}>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${(project.cropX ?? 0.5) * 100}% ${(project.cropY ?? 0.5) * 100}%` }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-300)', fontSize: '18px' }}>🏗</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--navy-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {project.title}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px', fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: project.published ? 'var(--green-100)' : 'var(--slate-200)',
                      color: project.published ? 'var(--green-700)' : 'var(--slate-600)',
                      textTransform: 'uppercase', letterSpacing: '.02em', flexShrink: 0,
                    }}>
                      {project.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.03em' }}>
                    {project.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selected ? (
            <>
              {/* Detail header */}
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: 'var(--navy-800)', margin: '0 0 6px 0' }}>
                    {selected.title}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {selected.category}{selected.clientName ? ` · ${selected.clientName}` : ''}
                    {selected.date ? ` · ${new Date(selected.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={toggleStatus}
                    disabled={toggling}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: selected.published ? 'var(--green-100)' : 'var(--slate-100)',
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
                    onClick={() => router.push(`/admin/projects/${selected.id}/edit`)}
                    style={{
                      width: '32px', height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--slate-600)', fontSize: '15px',
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {/* Inner tab bar: Details | Gallery */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#fff' }}>
                {(['details', 'gallery'] as DetailTab[]).map((tab) => {
                  const isActive = detailTab === tab;
                  const label = tab === 'details' ? 'Details' : `Gallery (${allImages.length})`;
                  return (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      style={{
                        padding: '10px 20px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isActive ? 'var(--navy-900)' : 'var(--slate-500)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: isActive ? '2px solid var(--green-600)' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Detail content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

                {detailTab === 'details' && (
                  <>
                    {/* Hero image */}
                    {selected.imageUrl && (
                      <div style={{ marginBottom: '28px' }}>
                        <img
                          src={selected.imageUrl}
                          alt={selected.title}
                          onClick={() => setLightbox(selected.imageUrl!)}
                          style={{
                            width: '100%', height: '260px', objectFit: 'cover',
                            objectPosition: `${(selected.cropX ?? 0.5) * 100}% ${(selected.cropY ?? 0.5) * 100}%`,
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            cursor: 'zoom-in',
                          }}
                        />
                      </div>
                    )}

                    {/* Meta grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                      <div>
                        <div style={labelStyle}>Category</div>
                        <div style={valueStyle}>{selected.category}</div>
                      </div>
                      {selected.clientName && (
                        <div>
                          <div style={labelStyle}>Client</div>
                          <div style={valueStyle}>{selected.clientName}</div>
                        </div>
                      )}
                      <div>
                        <div style={labelStyle}>Date</div>
                        <div style={valueStyle}>
                          {new Date(selected.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div style={labelStyle}>Status</div>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: selected.published ? 'var(--green-100)' : 'var(--slate-100)',
                          color: selected.published ? 'var(--green-700)' : 'var(--slate-600)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px', fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '.02em',
                        }}>
                          {selected.published ? '✓ Published' : '● Draft'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {selected.description && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={labelStyle}>Description</div>
                        <div style={contentBoxStyle}>{selected.description}</div>
                      </div>
                    )}

                    {/* Highlights */}
                    {selected.highlights && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={labelStyle}>Highlights</div>
                        <div style={contentBoxStyle}>{selected.highlights}</div>
                      </div>
                    )}

                    {/* Metrics */}
                    {selected.metrics && (
                      <div>
                        <div style={labelStyle}>Metrics / Technical Summary</div>
                        <div style={contentBoxStyle}>{selected.metrics}</div>
                      </div>
                    )}
                  </>
                )}

                {detailTab === 'gallery' && (
                  <>
                    {allImages.length === 0 ? (
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        height: '200px', color: 'var(--slate-400)',
                        fontFamily: 'var(--font-body)', fontSize: '14px', gap: '8px',
                      }}>
                        <span style={{ fontSize: '32px' }}>🖼</span>
                        No images attached to this project
                      </div>
                    ) : (
                      <>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '16px' }}>
                          {allImages.length} image{allImages.length !== 1 ? 's' : ''} — click to enlarge
                        </p>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: '12px',
                        }}>
                          {allImages.map((img, i) => (
                            <div
                              key={i}
                              onClick={() => setLightbox(img.url)}
                              style={{
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                cursor: 'zoom-in',
                                aspectRatio: '16/10',
                                background: 'var(--navy-50)',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={img.url}
                                alt={img.alt}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                              />
                              {i === 0 && selected.imageUrl && (
                                <div style={{
                                  position: 'absolute', top: '8px', left: '8px',
                                  background: 'rgba(0,0,0,0.55)',
                                  color: '#fff',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '9px', fontWeight: 600,
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-sm)',
                                  textTransform: 'uppercase', letterSpacing: '.04em',
                                }}>
                                  Cover
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: 'var(--slate-500)',
              fontFamily: 'var(--font-body)', fontSize: '14px',
            }}>
              Select a project to view details
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.04em',
  color: 'var(--slate-600)',
  marginBottom: '8px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--navy-800)',
};

const contentBoxStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  lineHeight: 1.65,
  color: 'var(--navy-800)',
  whiteSpace: 'pre-wrap',
  background: 'var(--slate-50)',
  padding: '16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
};
