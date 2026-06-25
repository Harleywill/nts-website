"use client";

import { useEffect, useState } from "react";

interface EmailLog {
  id: string;
  type: "admin-notification" | "user-confirmation";
  subject: string;
  from: string;
  to: string;
  status: "delivered" | "failed";
  error: string | null;
  timestamp: string;
  submissionId: number;
  sender: string;
}

export default function EmailLogPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "delivered" | "failed">("all");

  useEffect(() => {
    fetchEmailLog();
  }, []);

  const fetchEmailLog = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emails/log");
      if (!res.ok) throw new Error("Failed to fetch email log");
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    if (filter === "all") return true;
    return email.status === filter;
  });

  const deliveredCount = emails.filter((e) => e.status === "delivered").length;
  const failedCount = emails.filter((e) => e.status === "failed").length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '28px',
          color: '#1a2f6e',
          margin: '0 0 12px 0',
        }}>
          Email Log
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--slate-600)',
          margin: 0,
        }}>
          Track all emails sent from contact forms and applications
        </p>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--navy-50)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            color: 'var(--slate-600)',
            margin: '0 0 8px 0',
          }}>
            Total
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2f6e',
            margin: 0,
          }}>
            {emails.length}
          </p>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: '#f0fdf4',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            color: '#166534',
            margin: '0 0 8px 0',
          }}>
            Delivered
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#4caf50',
            margin: 0,
          }}>
            {deliveredCount}
          </p>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: '#fef2f2',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            color: '#991b1b',
            margin: '0 0 8px 0',
          }}>
            Failed
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#ef4444',
            margin: 0,
          }}>
            {emails.length - deliveredCount}
          </p>
        </div>
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--navy-50)',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            color: 'var(--slate-600)',
            margin: '0 0 8px 0',
          }}>
            Success Rate
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2f6e',
            margin: 0,
          }}>
            {emails.length === 0 ? '—' : `${Math.round((deliveredCount / emails.length) * 100)}%`}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['all', 'delivered', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: filter === f ? '#1a2f6e' : '#fff',
              color: filter === f ? '#fff' : '#1a2f6e',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f === 'all' && `All (${emails.length})`}
            {f === 'delivered' && `Delivered (${deliveredCount})`}
            {f === 'failed' && `Failed (${emails.length - deliveredCount})`}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #fecaca',
          backgroundColor: '#fef2f2',
          color: '#7f1d1d',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {/* Content */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            color: 'var(--slate-400)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          }}>
            Loading…
          </div>
        ) : filteredEmails.length === 0 ? (
          <div style={{
            padding: '48px 32px',
            textAlign: 'center',
            color: 'var(--slate-400)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          }}>
            No emails found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--navy-50)' }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    Type
                  </th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    From
                  </th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    To
                  </th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    Subject
                  </th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    Status
                  </th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '.02em',
                    color: 'var(--slate-600)',
                  }}>
                    Sent
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{
                      padding: '12px 16px',
                      color: '#1a2f6e',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: email.type === 'admin-notification' ? '#dbeafe' : '#e9d5ff',
                        color: email.type === 'admin-notification' ? '#1e40af' : '#7e22ce',
                      }}>
                        {email.type === 'admin-notification' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#1a2f6e',
                      fontWeight: 500,
                    }}>
                      {email.from}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#1a2f6e',
                    }}>
                      <a href={`mailto:${email.to}`} style={{
                        color: '#4caf50',
                        textDecoration: 'none',
                      }}>
                        {email.to}
                      </a>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#1a2f6e',
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {email.subject}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: email.status === 'delivered' ? '#4caf50' : '#ef4444',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {email.status === 'delivered' ? '✓' : '✕'} {email.status === 'delivered' ? 'Delivered' : 'Failed'}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: 'var(--slate-500)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}>
                      {new Date(email.timestamp).toLocaleString('en-GB', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
