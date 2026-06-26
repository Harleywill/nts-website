'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAdministrator } from '@/lib/admin/permissions';

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN:       { bg: '#fef3c7', color: '#92400e' },
  MANAGER:     { bg: '#dbeafe', color: '#1e40af' },
  EDITOR:      { bg: 'var(--green-100)', color: 'var(--green-700)' },
  VIEWER:      { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
  ADMINISTRATOR:{ bg: '#fef3c7', color: '#92400e' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    fetch('/api/users', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const arr: User[] = Array.isArray(data) ? data : data.users || [];
        const sorted = arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUsers(sorted);
        if (sorted.length > 0) setSelectedId(sorted[0].id);
      })
      .catch((err) => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    setChangingRole(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: updated.role } : u));
      }
    } catch { /* ignore */ } finally {
      setChangingRole(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Remove ${username} from admin panel?`)) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      const remaining = users.filter((u) => u.id !== id);
      setUsers(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const roleStyle = (role: string) => ROLE_COLORS[role?.toUpperCase()] ?? ROLE_COLORS.VIEWER;

  const selected = users.find((u) => u.id === selectedId);
  const showAdmin = isAdministrator(userRole as any);

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
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--navy-800)', margin: '0 0 4px 0' }}>
              Team
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', margin: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {users.length} member{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          {showAdmin && (
            <Link
              href="/admin/users/new"
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--green-600)',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              + Add
            </Link>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Loading…</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>No users yet</div>
          ) : users.map((user) => {
            const { bg, color } = roleStyle(user.role);
            return (
              <button
                key={user.id}
                onClick={() => setSelectedId(user.id)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: selectedId === user.id ? 'var(--navy-50)' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: selectedId === user.id ? '3px solid var(--green-600)' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
                onMouseEnter={(e) => { if (selectedId !== user.id) (e.currentTarget as HTMLElement).style.background = 'var(--slate-50)'; }}
                onMouseLeave={(e) => { if (selectedId !== user.id) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--navy-800)' }}>
                  {user.username}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px', fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: bg, color,
                  textTransform: 'uppercase', letterSpacing: '.02em',
                  flexShrink: 0,
                }}>
                  {user.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right detail */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: 'var(--navy-800)', margin: '0 0 6px 0' }}>
                  {selected.username}
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Joined {new Date(selected.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </div>
              </div>
              {showAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/admin/users/${selected.id}/edit`}
                    style={{
                      height: '32px', padding: '0 12px',
                      display: 'inline-flex', alignItems: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      color: 'var(--slate-600)',
                      fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(selected.id, selected.username)}
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
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={labelStyle}>Role</div>
                  {showAdmin ? (
                    <select
                      value={selected.role}
                      disabled={changingRole}
                      onChange={(e) => handleRoleChange(selected.id, e.target.value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: roleStyle(selected.role).bg,
                        color: roleStyle(selected.role).color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '.03em',
                        cursor: changingRole ? 'wait' : 'pointer',
                        opacity: changingRole ? 0.6 : 1,
                      }}
                    >
                      {(['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'] as const).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: roleStyle(selected.role).bg,
                      color: roleStyle(selected.role).color,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.03em',
                    }}>
                      {selected.role}
                    </span>
                  )}
                </div>
                <div>
                  <div style={labelStyle}>Joined</div>
                  <div style={valueStyle}>
                    {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Username</div>
                  <div style={{ ...valueStyle, fontFamily: 'var(--font-mono)' }}>{selected.username}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-500)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Select a team member to view details
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
  color: 'var(--slate-600)', marginBottom: '8px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--navy-800)',
};
