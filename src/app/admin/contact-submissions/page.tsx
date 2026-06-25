'use client';

import { useEffect, useState } from 'react';
import { canDelete } from '@/lib/admin/permissions';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => { if (data.role) setUserRole(data.role); })
      .catch(() => setUserRole('viewer'));

    fetch('/api/contact-submissions', { credentials: 'include' })
      .then((res) => { if (!res.ok) throw new Error(`API error: ${res.status}`); return res.json(); })
      .then((data) => {
        const arr: Enquiry[] = Array.isArray(data) ? data : data.submissions || [];
        setEnquiries(arr);
        if (arr.length > 0) setSelectedId(arr[0].id);
      })
      .catch(() => setEnquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: number) => {
    await fetch(`/api/contact-submissions?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
      credentials: 'include',
    }).catch(() => {});
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete enquiry from ${name}?`)) return;
    const res = await fetch(`/api/contact-submissions?id=${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      const remaining = enquiries.filter((e) => e.id !== id);
      setEnquiries(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const selectEnquiry = (id: number) => {
    setSelectedId(id);
    const enquiry = enquiries.find((e) => e.id === id);
    if (enquiry && !enquiry.read) markAsRead(id);
  };

  const selected = enquiries.find((e) => e.id === selectedId);
  const showDelete = canDelete(userRole as any);
  const unreadCount = enquiries.filter((e) => !e.read).length;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', background: '#fff' }}>

      {/* Left list */}
      <div style={{
        flex: '0 0 380px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-800)', margin: '0 0 4px 0' }}>
            Enquiries
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {enquiries.length} total{unreadCount > 0 ? ` · ${unreadCount} unread` : ''}
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Loading…</div>
          ) : enquiries.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>No enquiries yet</div>
          ) : enquiries.map((enquiry) => (
            <button
              key={enquiry.id}
              onClick={() => selectEnquiry(enquiry.id)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                background: selectedId === enquiry.id ? 'var(--navy-50)' : '#fff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
                borderLeft: selectedId === enquiry.id ? '3px solid var(--green-600)' : '3px solid transparent',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
              onMouseEnter={(e) => { if (selectedId !== enquiry.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
              onMouseLeave={(e) => { if (selectedId !== enquiry.id) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <div style={{ width: '8px', paddingTop: '5px', flexShrink: 0 }}>
                {!enquiry.read && (
                  <span style={{ display: 'block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green-600)' }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '13px', fontWeight: enquiry.read ? 600 : 700,
                  color: 'var(--navy-800)',
                  marginBottom: '3px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {enquiry.name}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--slate-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {enquiry.email}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--slate-400)', flexShrink: 0, paddingTop: '2px' }}>
                {new Date(enquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: 'var(--navy-800)', margin: '0 0 4px 0' }}>
                  {selected.name}
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {new Date(selected.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  {selected.read && <span style={{ marginLeft: '10px', color: 'var(--slate-400)' }}>· Read</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`mailto:${selected.email}`}
                  style={{
                    height: '32px', padding: '0 12px',
                    display: 'inline-flex', alignItems: 'center',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--green-50)',
                    color: 'var(--green-700)',
                    fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Reply
                </a>
                {!selected.read && (
                  <button
                    onClick={() => markAsRead(selected.id)}
                    style={{
                      height: '32px', padding: '0 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      color: 'var(--slate-600)',
                      fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Mark Read
                  </button>
                )}
                {showDelete && (
                  <button
                    onClick={() => handleDelete(selected.id, selected.name)}
                    style={{
                      width: '32px', height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      color: 'var(--slate-400)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '14px',
                    }}
                    title="Delete"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={labelStyle}>Email</div>
                  <a href={`mailto:${selected.email}`} style={{ ...valueStyle, color: 'var(--green-700)', textDecoration: 'none' }}>
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div>
                    <div style={labelStyle}>Phone</div>
                    <a href={`tel:${selected.phone}`} style={{ ...valueStyle, color: 'var(--green-700)', textDecoration: 'none' }}>
                      {selected.phone}
                    </a>
                  </div>
                )}
                {selected.service && (
                  <div>
                    <div style={labelStyle}>Service</div>
                    <div style={valueStyle}>{selected.service}</div>
                  </div>
                )}
              </div>

              <div>
                <div style={labelStyle}>Message</div>
                <div style={contentBoxStyle}>{selected.message}</div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Select an enquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '.04em',
  color: 'var(--slate-600)', marginBottom: '6px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--navy-800)',
};

const contentBoxStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px', lineHeight: 1.65,
  color: 'var(--navy-800)',
  whiteSpace: 'pre-wrap',
  background: 'var(--slate-50)',
  padding: '16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
};
