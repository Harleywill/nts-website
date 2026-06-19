'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { canEdit, isAdministrator } from '@/lib/admin/permissions';

interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    fetch('/api/users', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const usersData = Array.isArray(data) ? data : data.users || [];
        setUsers(usersData.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      })
      .catch((error) => console.error('Failed to fetch users:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Remove ${username} from admin panel?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'administrator':
        return { bg: '#fef3c7', color: '#b45309' };
      case 'editor':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'viewer':
        return { bg: '#f3f4f6', color: '#4b5563' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563' };
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="mepm-h2 text-navy-700">Team</h1>
          <p className="mepm-spec mt-1 text-slate-500">
            {users.length} team member{users.length !== 1 ? 's' : ''} — admin panel access
          </p>
        </div>
        {isAdministrator(userRole as any) && (
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
          >
            <Plus size={17} /> Add member
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-slate-400">Loading…</span>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center">
          <p className="mepm-spec text-slate-400">No team members yet</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '18px',
        }}>
          {users.map((user) => {
            const roleBadge = getRoleBadgeColor(user.role);
            const initials = user.username.slice(0, 2).toUpperCase();
            return (
              <div
                key={user.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow"
              >
                <div
                  style={{
                    height: '140px',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4b5563',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: '22px',
                    }}
                  >
                    {initials}
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#1a2f6e',
                    }}
                  >
                    {user.username}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        letterSpacing: '.04em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: roleBadge.bg,
                        color: roleBadge.color,
                        display: 'inline-block',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '8px',
                    }}
                  >
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      marginTop: '12px',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '12px',
                    }}
                  >
                    {isAdministrator(userRole as any) && (
                      <>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          title="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          title="Delete"
                          className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
