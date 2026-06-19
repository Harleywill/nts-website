'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
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
    // Fetch user role
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    // Fetch enquiries
    fetch('/api/contact-submissions', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const enquiriesData = Array.isArray(data) ? data : data.submissions || [];
        setEnquiries(enquiriesData);
        if (enquiriesData.length > 0 && selectedId === null) {
          setSelectedId(enquiriesData[0].id);
          markAsRead(enquiriesData[0].id);
        }
      })
      .catch((error) => console.error('Failed to fetch enquiries:', error))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/contact-submissions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
        credentials: 'include',
      });

      setEnquiries(
        enquiries.map((e) => (e.id === id ? { ...e, read: true } : e))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete enquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const remaining = enquiries.filter((e) => e.id !== id);
        setEnquiries(remaining);
        if (selectedId === id) {
          setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
    }
  };

  const selected = enquiries.find((e) => e.id === selectedId);
  const showDelete = canDelete(userRole as any);

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' }}>
      {/* List Column */}
      <div style={{
        flex: '0 0 320px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--navy-50)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--slate-600)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
          }}>
            {enquiries.length} enquir{enquiries.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            color: 'var(--slate-400)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          }}>
            Loading…
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            color: 'var(--slate-400)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            textAlign: 'center',
          }}>
            No enquiries
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {enquiries.map((enquiry) => (
              <button
                key={enquiry.id}
                onClick={() => {
                  setSelectedId(enquiry.id);
                  markAsRead(enquiry.id);
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: selectedId === enquiry.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== enquiry.id) {
                    (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== enquiry.id) {
                    (e.currentTarget as HTMLElement).style.background = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {!enquiry.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#4caf50',
                      marginTop: '5px',
                      flexShrink: 0,
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1a2f6e',
                      margin: '0 0 2px 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {enquiry.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--slate-500)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {enquiry.email}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Column */}
      <div style={{
        flex: 1,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {selected ? (
          <>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1a2f6e',
                  margin: '0 0 4px 0',
                }}>
                  {selected.name}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--slate-500)',
                  margin: 0,
                }}>
                  {new Date(selected.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {showDelete && (
                <button
                  onClick={() => handleDelete(selected.id, selected.name)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                  color: 'var(--slate-500)',
                  margin: '0 0 6px 0',
                }}>
                  Email
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#1a2f6e',
                  margin: 0,
                  wordBreak: 'break-all',
                }}>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{
                      color: '#4caf50',
                      textDecoration: 'none',
                    }}
                  >
                    {selected.email}
                  </a>
                </p>
              </div>

              {selected.phone && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.03em',
                    color: 'var(--slate-500)',
                    margin: '0 0 6px 0',
                  }}>
                    Phone
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#1a2f6e',
                    margin: 0,
                  }}>
                    <a
                      href={`tel:${selected.phone}`}
                      style={{
                        color: '#4caf50',
                        textDecoration: 'none',
                      }}
                    >
                      {selected.phone}
                    </a>
                  </p>
                </div>
              )}

              {selected.service && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.03em',
                    color: 'var(--slate-500)',
                    margin: '0 0 6px 0',
                  }}>
                    Service
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#1a2f6e',
                    margin: 0,
                  }}>
                    {selected.service}
                  </p>
                </div>
              )}

              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                  color: 'var(--slate-500)',
                  margin: '0 0 6px 0',
                }}>
                  Message
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#1a2f6e',
                  lineHeight: 1.6,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>
                  {selected.message}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--slate-400)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          }}>
            Select an enquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}
