'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NEW: { bg: 'var(--green-50)', color: 'var(--green-700)' },
  REVIEWING: { bg: '#fefce8', color: '#854d0e' },
  INTERVIEW: { bg: '#eff6ff', color: '#1d4ed8' },
  OFFER: { bg: '#faf5ff', color: '#7e22ce' },
  HIRED: { bg: 'var(--green-100)', color: 'var(--green-700)' },
  REJECTED: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
};

const STATUS_OPTIONS = ['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

function ApplicationsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (jobIdParam) params.set('jobId', jobIdParam);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('limit', '20');

      const res = await fetch(`/api/admin/applications?${params.toString()}`, { credentials: 'include' });
      const data = await res.json();
      setApplications(Array.isArray(data.applications) ? data.applications : []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, [jobIdParam, statusFilter, search, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <button
            onClick={() => router.push('/admin/careers')}
            style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '8px', display: 'block' }}
          >
            ← Back to Careers
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: 0 }}>
            Applications
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email…"
          style={{
            padding: '9px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--navy-900)',
            background: '#fff',
            outline: 'none',
            width: '260px',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '9px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--navy-900)',
            background: '#fff',
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        {(search || statusFilter || jobIdParam) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); router.push('/admin/careers/applications'); }}
            style={{
              padding: '9px 14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--slate-600)',
              background: '#fff',
              cursor: 'pointer',
            }}
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
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            No applications found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--slate-50)' }}>
                {['Reference', 'Name', 'Email', 'Job', 'Status', 'Submitted', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '.04em',
                      color: 'var(--slate-500)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: idx < applications.length - 1 ? '1px solid var(--slate-100)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  onClick={() => router.push(`/admin/careers/applications/${app.id}`)}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-600)' }}>
                    {app.reference}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--navy-900)', whiteSpace: 'nowrap' }}>
                    {app.fullName}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)' }}>
                    {app.email}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-600)', maxWidth: '180px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate-400)' }}>{app.job?.department}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: STATUS_COLORS[app.status]?.bg || 'var(--slate-50)',
                        color: STATUS_COLORS[app.status]?.color || 'var(--slate-600)',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                    {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => router.push(`/admin/careers/applications/${app.id}`)}
                      style={{
                        padding: '5px 12px',
                        background: 'var(--navy-50)',
                        color: 'var(--navy-800)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)' }}>
            {pagination.total} application{pagination.total !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '7px 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                cursor: page <= 1 ? 'default' : 'pointer',
                opacity: page <= 1 ? 0.4 : 1,
                color: 'var(--navy-900)',
              }}
            >
              ← Prev
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--slate-500)', padding: '0 8px' }}>
              {page} / {pagination.pages}
            </span>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '7px 14px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                cursor: page >= pagination.pages ? 'default' : 'pointer',
                opacity: page >= pagination.pages ? 0.4 : 1,
                color: 'var(--navy-900)',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>}>
      <ApplicationsTable />
    </Suspense>
  );
}
