'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  experience: string;
  closesAt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  description: string;
  responsibilities: string;
  requirements: string;
  createdAt: string;
  _count: { applications: number };
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
  PUBLISHED: { bg: 'var(--green-100)', color: 'var(--green-700)' },
  CLOSED: { bg: '#fee2e2', color: '#dc2626' },
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: '● Draft',
  PUBLISHED: '✓ Published',
  CLOSED: '✕ Closed',
};

const EMP_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
};

export default function CareersPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/admin/jobs', { credentials: 'include' });
      const data = await res.json();
      const arr: Job[] = Array.isArray(data.jobs) ? data.jobs : [];
      setJobs(arr);
      if (arr.length > 0 && selectedId === null) {
        setSelectedId(arr[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const selected = jobs.find((j) => j.id === selectedId);

  const setStatus = async (status: string) => {
    if (!selected) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/jobs/${selected.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === selected.id ? { ...j, status: status as Job['status'] } : j)));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Delete "${selected.title}"? This will also delete all applications. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${selected.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const remaining = jobs.filter((j) => j.id !== selected.id);
        setJobs(remaining);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
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
              Job Listings
            </h2>
            <button
              onClick={() => router.push('/admin/careers/new')}
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
              + New Job
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {jobs.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              No jobs yet
            </div>
          ) : (
            jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedId(job.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedId === job.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === job.id ? '3px solid var(--green-600)' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== job.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)';
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== job.id) (e.currentTarget as HTMLElement).style.background = '#fff';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', flex: 1, marginRight: '8px' }}>
                    {job.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: STATUS_COLORS[job.status]?.bg,
                      color: STATUS_COLORS[job.status]?.color,
                      textTransform: 'uppercase',
                      letterSpacing: '.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {STATUS_LABELS[job.status]}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-600)', marginBottom: '2px' }}>
                  {job.department} · {job.location}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)' }}>
                  {job._count.applications} application{job._count.applications !== 1 ? 's' : ''}
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
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: 'var(--navy-900)', margin: '0 0 4px 0' }}>
                    {selected.title}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '10px' }}>
                    {selected.department} · {selected.location}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: STATUS_COLORS[selected.status]?.bg,
                      color: STATUS_COLORS[selected.status]?.color,
                      textTransform: 'uppercase',
                      letterSpacing: '.03em',
                    }}
                  >
                    {STATUS_LABELS[selected.status]}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {selected.status !== 'PUBLISHED' && (
                    <button
                      onClick={() => setStatus('PUBLISHED')}
                      disabled={statusUpdating}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--green-600)',
                        background: 'var(--green-50)',
                        color: 'var(--green-700)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: statusUpdating ? 'default' : 'pointer',
                        opacity: statusUpdating ? 0.6 : 1,
                      }}
                    >
                      Publish
                    </button>
                  )}
                  {selected.status !== 'CLOSED' && (
                    <button
                      onClick={() => setStatus('CLOSED')}
                      disabled={statusUpdating}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: statusUpdating ? 'default' : 'pointer',
                        opacity: statusUpdating ? 0.6 : 1,
                      }}
                    >
                      Close
                    </button>
                  )}
                  {selected.status !== 'DRAFT' && (
                    <button
                      onClick={() => setStatus('DRAFT')}
                      disabled={statusUpdating}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--slate-50)',
                        color: 'var(--slate-600)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: statusUpdating ? 'default' : 'pointer',
                        opacity: statusUpdating ? 0.6 : 1,
                      }}
                    >
                      Set Draft
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/admin/careers/${selected.id}/edit`)}
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
              {/* Applications button */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => router.push(`/admin/careers/applications?jobId=${selected.id}`)}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--navy-800)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View Applications ({selected._count.applications})
                </button>
              </div>

              {/* Meta grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Employment Type', value: EMP_TYPE_LABELS[selected.employmentType] || selected.employmentType },
                  { label: 'Salary Range', value: selected.salaryRange || '—' },
                  { label: 'Experience', value: selected.experience || '—' },
                  { label: 'Closes', value: new Date(selected.closesAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#fff', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-500)', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--navy-900)' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {selected.description && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '10px' }}>Description</div>
                  <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, color: 'var(--navy-900)', whiteSpace: 'pre-wrap' }}>
                    {selected.description}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selected.responsibilities && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '10px' }}>Responsibilities</div>
                  <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, color: 'var(--navy-900)', whiteSpace: 'pre-wrap' }}>
                    {selected.responsibilities}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selected.requirements && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '10px' }}>Requirements</div>
                  <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, color: 'var(--navy-900)', whiteSpace: 'pre-wrap' }}>
                    {selected.requirements}
                  </div>
                </div>
              )}
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
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}
