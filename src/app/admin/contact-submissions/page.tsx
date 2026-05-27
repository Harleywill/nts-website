'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTrash, FaEye } from 'react-icons/fa';
import { AdminListPage } from '@/components/admin/templates/AdminListPage';
import { ColumnDef } from '@/components/admin/templates/AdminListPage';
import ContactSubmissionModal from '@/components/admin/ContactSubmissionModal';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  read: boolean;
  emailSentToAdmin: boolean;
  emailSentToUser: boolean;
  adminEmails?: string;
  userEmail?: string;
  emailError?: string;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact-submissions');
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: number) => {
    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete submission');
      setSubmissions(submissions.filter((s) => s.id !== id));
      setSelectedSubmission(null);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: number, read: boolean) => {
    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error('Failed to update submission');
      const updated = submissions.map((s) => (s.id === id ? { ...s, read } : s));
      setSubmissions(updated);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, read });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = submissions.filter((s) => !s.read).length;
  const emailSuccessCount = submissions.filter((s) => s.emailSentToAdmin).length;
  const emailFailureCount = submissions.filter((s) => !s.emailSentToAdmin).length;

  const columns: ColumnDef<ContactSubmission>[] = [
    {
      key: 'name',
      label: 'Name',
      width: 'w-32',
    },
    {
      key: 'email',
      label: 'Email',
      width: 'flex-1',
      render: (submission) => (
        <a href={`mailto:${submission.email}`} className="text-nts-green hover:underline text-xs">
          {submission.email}
        </a>
      ),
    },
    {
      key: 'service',
      label: 'Service',
      width: 'w-32',
      render: (submission) => submission.service || '-',
    },
    {
      key: 'read',
      label: 'Status',
      width: 'w-20',
      align: 'center',
      render: (submission) => (
        <span
          className={`inline-flex px-2 py-1 rounded text-xs font-mono font-semibold ${
            submission.read ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-900'
          }`}
        >
          {submission.read ? 'READ' : 'NEW'}
        </span>
      ),
    },
    {
      key: 'emailSentToAdmin',
      label: 'Email',
      width: 'w-20',
      align: 'center',
      render: (submission) => (
        <span
          className={`text-xs font-mono ${submission.emailSentToAdmin ? 'text-nts-green' : 'text-nts-danger'}`}
        >
          {submission.emailSentToAdmin ? '✓' : '✗'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      width: 'w-32',
      render: (submission) =>
        new Date(submission.createdAt).toLocaleString('en-GB', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  const kpiStats = [
    { label: 'Total', count: submissions.length, icon: '📬' },
    { label: 'Unread', count: unreadCount, icon: '🆕' },
    { label: 'Email Success', count: emailSuccessCount, icon: '✓' },
    { label: 'Email Failed', count: emailFailureCount, icon: '✗' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-adm-textMut font-mono">LOADING SUBMISSIONS...</div>
      </div>
    );
  }

  return (
    <>
      <AdminListPage
        title="Contact Submissions"
        items={submissions}
        columns={columns}
        searchPlaceholder="Search by name or email..."
        emptyStateMessage="No contact submissions found"
        kpiStats={kpiStats}
        renderActions={(submission) => (
          <>
            <button
              onClick={() => setSelectedSubmission(submission)}
              className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
              title="View details"
            >
              View
            </button>
            <button
              onClick={() => deleteSubmission(submission.id)}
              className="text-nts-danger hover:text-red-300 text-xs font-mono transition-colors"
              title="Delete submission"
            >
              Delete
            </button>
          </>
        )}
      />

      {/* Modal */}
      <ContactSubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onDelete={deleteSubmission}
        onMarkAsRead={markAsRead}
      />
    </>
  );
}
