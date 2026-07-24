'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Application {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  cvFilename: string;
  cvUrl: string;
  coverLetter: string | null;
  notes: string | null;
  status: string;
  submittedAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
}

const STATUS_OPTIONS = ['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NEW: { bg: 'var(--green-50)', color: 'var(--green-700)' },
  REVIEWING: { bg: '#fefce8', color: '#854d0e' },
  INTERVIEW: { bg: '#eff6ff', color: '#1d4ed8' },
  OFFER: { bg: '#faf5ff', color: '#7e22ce' },
  HIRED: { bg: 'var(--green-100)', color: 'var(--green-700)' },
  REJECTED: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)' as const,
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '.04em',
  color: 'var(--slate-500)',
  marginBottom: '4px',
};

const valueStyle = {
  fontFamily: 'var(--font-body)' as const,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--navy-900)',
};

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [appId, setAppId] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    params.then(({ id }) => setAppId(id));
  }, [params]);

  useEffect(() => {
    if (!appId) return;
    fetch(`/api/admin/applications/${appId}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setApplication(data);
        setStatus(data.status);
        setNotes(data.notes || '');
      })
      .catch(() => setError('Failed to load application'))
      .finally(() => setLoading(false));
  }, [appId]);

  const handleSave = async () => {
    if (!appId) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplication((prev) => prev ? { ...prev, status: updated.status, notes: updated.notes } : prev);
        setSaveMsg('Saved');
        setTimeout(() => setSaveMsg(''), 3000);
      } else {
        setSaveMsg('Failed to save');
      }
    } catch {
      setSaveMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--slate-400)' }}>Loading…</div>;
  if (error || !application) return <div style={{ padding: '24px', color: '#dc2626', fontFamily: 'var(--font-body)' }}>{error || 'Application not found'}</div>;

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/admin/careers/applications')}
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '10px', display: 'block' }}
        >
          ← Back to Applications
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: 'var(--navy-900)', margin: '0 0 4px 0' }}>
              {application.fullName}
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Ref: {application.reference}
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: STATUS_COLORS[application.status]?.bg || 'var(--slate-100)',
              color: STATUS_COLORS[application.status]?.color || 'var(--slate-600)',
              textTransform: 'uppercase',
              letterSpacing: '.03em',
            }}
          >
            {application.status}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Personal Info */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              Applicant Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={labelStyle}>Email</div>
                <div style={valueStyle}>{application.email}</div>
              </div>
              <div>
                <div style={labelStyle}>Phone</div>
                <div style={valueStyle}>{application.phone}</div>
              </div>
              <div>
                <div style={labelStyle}>Postcode</div>
                <div style={valueStyle}>{application.postcode}</div>
              </div>
              <div>
                <div style={labelStyle}>Submitted</div>
                <div style={valueStyle}>
                  {new Date(application.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Job Applied For */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              Job Applied For
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={labelStyle}>Title</div>
                <div style={valueStyle}>{application.job?.title}</div>
              </div>
              <div>
                <div style={labelStyle}>Department</div>
                <div style={valueStyle}>{application.job?.department}</div>
              </div>
              <div>
                <div style={labelStyle}>Location</div>
                <div style={valueStyle}>{application.job?.location}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => router.push(`/admin/careers/${application.job?.id}/edit`)}
                style={{
                  padding: '6px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--slate-50)',
                  color: 'var(--slate-600)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View Job Listing →
              </button>
            </div>
          </div>

          {/* CV */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', margin: '0 0 14px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              CV
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--navy-900)' }}>{application.cvFilename}</div>
              <a
                href={`/api/applications/${application.id}/cv`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 14px',
                  background: 'var(--green-600)',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', margin: '0 0 14px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                Cover Letter
              </h3>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--navy-900)', whiteSpace: 'pre-wrap' }}>
                {application.coverLetter}
              </div>
            </div>
          )}
        </div>

        {/* Right: Status & Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'sticky', top: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--navy-900)', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
              Status & Notes
            </h3>

            {/* Status */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ ...labelStyle, marginBottom: '8px' }}>Status</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {STATUS_OPTIONS.map((s) => (
                  <label
                    key={s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${status === s ? 'var(--green-600)' : 'var(--border)'}`,
                      background: status === s ? 'var(--green-50)' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      style={{ accentColor: 'var(--green-600)' }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: STATUS_COLORS[s]?.color || 'var(--slate-600)',
                      }}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ ...labelStyle, marginBottom: '8px' }}>Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--navy-900)',
                  background: '#fff',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                placeholder="Add internal notes…"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--green-600)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>

            {saveMsg && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: saveMsg === 'Saved' ? 'var(--green-50)' : '#fef2f2',
                color: saveMsg === 'Saved' ? 'var(--green-700)' : '#dc2626',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                textAlign: 'center',
              }}>
                {saveMsg === 'Saved' ? '✓ Saved successfully' : saveMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
