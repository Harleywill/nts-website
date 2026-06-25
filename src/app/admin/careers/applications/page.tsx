'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  postcode?: string;
  status: string;
  cvUrl?: string;
  cvFilename?: string;
  coverLetter?: string;
  submittedAt: string;
  job: {
    title: string;
    id: string;
  };
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  NEW:       { bg: 'var(--navy-100)',   color: 'var(--navy-700)',  label: 'New'       },
  REVIEWING: { bg: '#FEF9C3',          color: '#854D0E',          label: 'Reviewing' },
  INTERVIEW: { bg: '#DBEAFE',          color: '#1E40AF',          label: 'Interview' },
  OFFER:     { bg: 'var(--green-100)', color: 'var(--green-700)', label: 'Offer'     },
  HIRED:     { bg: 'var(--green-100)', color: 'var(--green-700)', label: 'Hired'     },
  REJECTED:  { bg: '#FEE2E2',          color: '#991B1B',          label: 'Rejected'  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'var(--slate-100)', color: 'var(--slate-600)', label: status };
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      fontWeight: 600,
      padding: '2px 7px',
      borderRadius: 'var(--radius-sm)',
      background: s.bg,
      color: s.color,
      textTransform: 'uppercase',
      letterSpacing: '.02em',
      display: 'inline-block',
    }}>
      {s.label}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      color: 'var(--slate-600)',
      marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      color: 'var(--navy-800)',
    }}>
      {children}
    </div>
  );
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/careers/applications', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const arr: Application[] = Array.isArray(data) ? data : data.applications || [];
        arr.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setApplications(arr);
        if (arr.length > 0 && selectedId === null) setSelectedId(arr[0].id);
      })
      .catch((err) => console.error('Failed to fetch applications:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete application from ${name}?`)) return;
    const res = await fetch(`/api/careers/applications/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      const remaining = applications.filter((a) => a.id !== id);
      setApplications(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/careers/applications/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const selected = applications.find((a) => a.id === selectedId);

  return (
    <div>
      {/* Tab nav — mirrors careers page */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/admin/careers')}
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--slate-600)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Job Listings
        </button>
        <div style={{
          padding: '12px 24px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--navy-900)',
          borderBottom: '2px solid var(--green-600)',
        }}>
          Applications
        </div>
      </div>

      {/* Split panel — same structure as careers page */}
      <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 160px)', background: '#fff' }}>

        {/* Left list */}
        <div style={{
          flex: '0 0 380px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-800)', margin: '0 0 6px 0' }}>
              Applications
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {applications.length} submission{applications.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                Loading…
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                No applications yet
              </div>
            ) : (
              applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border)',
                    background: selectedId === app.id ? 'var(--navy-50)' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                    borderLeft: selectedId === app.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedId !== app.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedId !== app.id) (e.currentTarget as HTMLElement).style.background = '#fff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-800)' }}>
                      {app.fullName}
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '.03em' }}>
                    {app.job?.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-400)' }}>
                    {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </button>
              ))
            )}
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
                    {selected.fullName}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {selected.job?.title} · submitted {new Date(selected.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      color: 'var(--navy-700)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id, selected.fullName)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--slate-400)',
                      fontSize: '16px',
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Detail content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

                {/* Status selector */}
                <div style={{ marginBottom: '24px' }}>
                  <FieldLabel>Status</FieldLabel>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {Object.entries(STATUS_COLORS).map(([key, cfg]) => {
                      const isActive = selected.status === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(selected.id, key)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: isActive ? `2px solid ${cfg.color}` : '2px solid var(--border)',
                            background: isActive ? cfg.bg : '#fff',
                            color: isActive ? cfg.color : 'var(--slate-500)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '.04em',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            opacity: isActive ? 1 : 0.7,
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = cfg.bg;
                              (e.currentTarget as HTMLElement).style.color = cfg.color;
                              (e.currentTarget as HTMLElement).style.opacity = '1';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = '#fff';
                              (e.currentTarget as HTMLElement).style.color = 'var(--slate-500)';
                              (e.currentTarget as HTMLElement).style.opacity = '0.7';
                            }
                          }}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Two-column info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <a href={`mailto:${selected.email}`} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--green-600)', textDecoration: 'none' }}>
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <a href={`tel:${selected.phone}`} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--green-600)', textDecoration: 'none' }}>
                      {selected.phone}
                    </a>
                  </div>
                  <div>
                    <FieldLabel>Job Applied For</FieldLabel>
                    <FieldValue>{selected.job?.title}</FieldValue>
                  </div>
                  {selected.postcode && (
                    <div>
                      <FieldLabel>Postcode</FieldLabel>
                      <FieldValue>{selected.postcode}</FieldValue>
                    </div>
                  )}
                </div>

                {/* CV download */}
                {selected.cvUrl && (
                  <div style={{ marginBottom: '24px' }}>
                    <FieldLabel>CV / Resume</FieldLabel>
                    <a
                      href={selected.cvUrl}
                      download={selected.cvFilename}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--green-300)',
                        background: 'var(--green-50)',
                        color: 'var(--green-700)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--green-100)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--green-50)'; }}
                    >
                      <Download size={14} />
                      {selected.cvFilename ?? 'Download CV'}
                    </a>
                  </div>
                )}

                {/* Cover letter */}
                {selected.coverLetter && (
                  <div>
                    <FieldLabel>Cover Letter</FieldLabel>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      lineHeight: 1.65,
                      color: 'var(--navy-800)',
                      whiteSpace: 'pre-wrap',
                      background: 'var(--slate-50)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                    }}>
                      {selected.coverLetter}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--slate-500)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}>
              Select an application to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
