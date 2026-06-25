'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────

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

interface Application {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
  job: { title: string; department: string };
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const JOB_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
  PUBLISHED: { bg: 'var(--green-100)', color: 'var(--green-700)' },
  CLOSED: { bg: '#fee2e2', color: '#dc2626' },
};

const JOB_STATUS_LABELS: Record<string, string> = {
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

const APP_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NEW: { bg: 'var(--green-50)', color: 'var(--green-700)' },
  REVIEWING: { bg: '#fefce8', color: '#854d0e' },
  INTERVIEW: { bg: '#eff6ff', color: '#1d4ed8' },
  OFFER: { bg: '#faf5ff', color: '#7e22ce' },
  HIRED: { bg: 'var(--green-100)', color: 'var(--green-700)' },
  REJECTED: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
};

const STATUS_OPTIONS = ['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

// ─── Tab bar ─────────────────────────────────────────────────────────────────

function TabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <div style={{
      display: 'flex', gap: '0', borderBottom: '1px solid var(--border)',
      background: '#fff', paddingLeft: '24px', flexShrink: 0,
    }}>
      {['jobs', 'applications'].map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '14px 20px',
              fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
              border: 'none', background: 'none', cursor: 'pointer',
              color: active ? 'var(--navy-800)' : 'var(--slate-500)',
              borderBottom: active ? '2px solid var(--green-600)' : '2px solid transparent',
              marginBottom: '-1px',
              textTransform: 'capitalize',
              letterSpacing: '.01em',
              transition: 'color 0.15s',
            }}
          >
            {tab === 'jobs' ? 'Jobs' : 'Applications'}
          </button>
        );
      })}
    </div>
  );
}

// ─── Jobs Tab ────────────────────────────────────────────────────────────────

function JobsTab({ onViewApplications }: { onViewApplications: (jobId: string) => void }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/jobs', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const arr: Job[] = Array.isArray(data.jobs) ? data.jobs : [];
        setJobs(arr);
        if (arr.length > 0) setSelectedId(arr[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selected = jobs.find((j) => j.id === selectedId);

  const setStatus = async (status: string) => {
    if (!selected) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/jobs/${selected.id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setJobs((prev) => prev.map((j) => j.id === selected.id ? { ...j, status: status as Job['status'] } : j));
    } catch (e) { console.error(e); }
    finally { setStatusUpdating(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Delete "${selected.title}"? This will also delete all applications.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${selected.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        const remaining = jobs.filter((j) => j.id !== selected.id);
        setJobs(remaining);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)', fontFamily: 'var(--font-body)' }}>Loading…</div>;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* List */}
      <div style={{ flex: '0 0 360px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--navy-900)' }}>Job Listings</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => router.push('/admin/careers/new')}
            style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', background: 'var(--green-600)', color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            + New Job
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {jobs.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>No jobs yet</div>
          ) : jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedId(job.id)}
              style={{
                width: '100%', padding: '14px 20px', borderBottom: '1px solid var(--slate-100)',
                background: selectedId === job.id ? 'var(--navy-50)' : '#fff',
                border: 'none', borderLeft: selectedId === job.id ? '3px solid var(--green-600)' : '3px solid transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (selectedId !== job.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
              onMouseLeave={(e) => { if (selectedId !== job.id) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--navy-900)', flex: 1, marginRight: '8px' }}>{job.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-sm)', background: JOB_STATUS_COLORS[job.status]?.bg, color: JOB_STATUS_COLORS[job.status]?.color, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {JOB_STATUS_LABELS[job.status]}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-600)', marginBottom: '2px' }}>{job.department} · {job.location}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-400)' }}>{job._count.applications} application{job._count.applications !== 1 ? 's' : ''}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--slate-50)' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', borderLeft: '3px solid var(--green-600)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--navy-900)', margin: '0 0 3px 0' }}>{selected.title}</h2>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>
                    {selected.department} · {selected.location}
                  </div>
                  <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-md)', background: JOB_STATUS_COLORS[selected.status]?.bg, color: JOB_STATUS_COLORS[selected.status]?.color, textTransform: 'uppercase' }}>
                    {JOB_STATUS_LABELS[selected.status]}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {selected.status !== 'PUBLISHED' && (
                    <button onClick={() => setStatus('PUBLISHED')} disabled={statusUpdating} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--green-600)', background: 'var(--green-50)', color: 'var(--green-700)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: statusUpdating ? 0.6 : 1 }}>Publish</button>
                  )}
                  {selected.status !== 'CLOSED' && (
                    <button onClick={() => setStatus('CLOSED')} disabled={statusUpdating} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: statusUpdating ? 0.6 : 1 }}>Close</button>
                  )}
                  {selected.status !== 'DRAFT' && (
                    <button onClick={() => setStatus('DRAFT')} disabled={statusUpdating} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--slate-50)', color: 'var(--slate-600)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: statusUpdating ? 0.6 : 1 }}>Set Draft</button>
                  )}
                  <button onClick={() => router.push(`/admin/careers/${selected.id}/edit`)} style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }} title="Edit">✏️</button>
                  <button onClick={handleDelete} disabled={deleting} style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', border: '1px solid #fca5a5', background: '#fff', cursor: deleting ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', opacity: deleting ? 0.6 : 1 }} title="Delete">🗑️</button>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* View Applications button */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => onViewApplications(selected.id)}
                  style={{ padding: '9px 18px', background: 'var(--navy-800)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  View Applications ({selected._count.applications})
                </button>
              </div>

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Employment Type', value: EMP_TYPE_LABELS[selected.employmentType] || selected.employmentType },
                  { label: 'Salary Range', value: selected.salaryRange || '—' },
                  { label: 'Experience', value: selected.experience || '—' },
                  { label: 'Closes', value: new Date(selected.closesAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#fff', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-500)', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>{value}</div>
                  </div>
                ))}
              </div>

              {[
                { label: 'Description', value: selected.description },
                { label: 'Responsibilities', value: selected.responsibilities },
                { label: 'Requirements', value: selected.requirements },
              ].filter(s => s.value).map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-600)', marginBottom: '8px' }}>{label}</div>
                  <div style={{ background: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.6, color: 'var(--navy-900)', whiteSpace: 'pre-wrap' }}>{value}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Applications Tab ─────────────────────────────────────────────────────────

function ApplicationsTab({ initialJobId }: { initialJobId?: string }) {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState(initialJobId ?? '');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (jobFilter) params.set('jobId', jobFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '20');
      const res = await fetch(`/api/admin/applications?${params.toString()}`, { credentials: 'include' });
      const data = await res.json();
      setApplications(Array.isArray(data.applications) ? data.applications : []);
      setPagination(data.pagination ?? null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [jobFilter, statusFilter, search, page]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Sync initialJobId when it changes (from clicking "View Applications" in jobs tab)
  useEffect(() => { setJobFilter(initialJobId ?? ''); setPage(1); }, [initialJobId]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch (e) { console.error(e); }
    finally { setUpdatingId(null); }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--navy-900)', margin: '0 0 4px 0' }}>Applications</h2>
        {jobFilter && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em', margin: 0 }}>
            Filtered by job
          </p>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email…"
          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--navy-900)', background: '#fff', outline: 'none', width: '220px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--navy-900)', background: '#fff', outline: 'none' }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
        </select>
        {(search || statusFilter || jobFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setJobFilter(''); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)', background: '#fff', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-400)', fontFamily: 'var(--font-body)' }}>Loading…</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>No applications found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
                {['Reference', 'Name', 'Email', 'Job', 'Status', 'Submitted', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: idx < applications.length - 1 ? '1px solid var(--slate-100)' : 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  onClick={() => router.push(`/admin/careers/applications/${app.id}`)}
                >
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-600)' }}>{app.reference}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)', whiteSpace: 'nowrap' }}>{app.fullName}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)' }}>{app.email}</td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)', maxWidth: '160px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate-400)' }}>{app.job?.department}</div>
                  </td>
                  <td style={{ padding: '11px 14px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{ padding: '3px 7px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, background: APP_STATUS_COLORS[app.status]?.bg || 'var(--slate-50)', color: APP_STATUS_COLORS[app.status]?.color || 'var(--slate-600)', cursor: 'pointer', outline: 'none' }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '11px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                    {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '11px 14px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => router.push(`/admin/careers/applications/${app.id}`)}
                      style={{ padding: '4px 10px', background: 'var(--navy-50)', color: 'var(--navy-800)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)' }}>
            {pagination.total} application{pagination.total !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.4 : 1, color: 'var(--navy-900)' }}>← Prev</button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-500)' }}>{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: page >= pagination.pages ? 'default' : 'pointer', opacity: page >= pagination.pages ? 0.4 : 1, color: 'var(--navy-900)' }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function CareersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') ?? 'jobs';
  const jobIdParam = searchParams.get('jobId') ?? undefined;

  const handleTabChange = (newTab: string) => {
    router.push(`/admin/careers?tab=${newTab}`);
  };

  const handleViewApplications = (jobId: string) => {
    router.push(`/admin/careers?tab=applications&jobId=${jobId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabBar activeTab={tab} onTabChange={handleTabChange} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {tab === 'jobs' ? (
          <JobsTab onViewApplications={handleViewApplications} />
        ) : (
          <ApplicationsTab initialJobId={jobIdParam} />
        )}
      </div>
    </div>
  );
}

export default function CareersPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>}>
      <CareersContent />
    </Suspense>
  );
}
