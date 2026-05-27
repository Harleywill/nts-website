'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminListPage } from '@/components/admin/templates/AdminListPage';
import { ColumnDef } from '@/components/admin/templates/AdminListPage';
import { useSearchParams } from 'next/navigation';

interface User {
  id: string;
  username: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/users${query}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "username",
      label: "Username",
      width: "flex-1",
    },
    {
      key: "createdAt",
      label: "Created",
      width: "w-32",
    },
  ];

  return (
    <AdminListPage
      title="Users"
      items={users}
      columns={columns}
      newUrl="/admin/users/new"
      newLabel="+ New User"
      searchPlaceholder="Search by username..."
      emptyStateMessage="No users found"
      renderActions={(item: User) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/users/${item.id}/edit`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="Edit"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteUser(item.id)}
            className="text-nts-danger hover:text-red-300 text-xs font-mono transition-colors"
            title="Delete"
          >
            Delete
          </button>
        </div>
      )}
    />
  );
}
