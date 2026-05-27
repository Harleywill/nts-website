'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BoldPanel } from '@/components/admin/ui/BoldPanel';
import { BoldButton } from '@/components/admin/ui/BoldButton';
import DeleteButton from '@/components/admin/DeleteButton';
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">
              Contact Submissions
            </h1>
            <p className="text-xs text-adm-textMut mt-1">
              {submissions.length} {submissions.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))` }}>
          {kpiStats.map((stat, idx) => (
            <BoldPanel key={idx} title={stat.label}>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-mono font-bold text-nts-green">
                  {stat.count}
                </div>
                {stat.icon && <span className="text-2xl">{stat.icon}</span>}
              </div>
            </BoldPanel>
          ))}
        </div>

        <form className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
            />
            <BoldButton type="submit" variant="primary" size="md">
              Search
            </BoldButton>
          </div>
        </form>

        {submissions.length === 0 ? (
          <BoldPanel cornerBrackets>
            <div className="py-12 text-center">
              <p className="text-adm-textMut text-sm font-mono">No contact submissions found</p>
            </div>
          </BoldPanel>
        ) : (
          <BoldPanel cornerBrackets>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-adm-border">
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-32">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left flex-1">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-32">
                      Service
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center w-20">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center w-20">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-32">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-right w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-adm-border/50">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-adm-panelAlt/30 transition-colors">
                      <td className="px-4 py-3 text-adm-textBody">{submission.name}</td>
                      <td className="px-4 py-3 text-adm-textBody">{submission.email}</td>
                      <td className="px-4 py-3 text-adm-textBody text-xs">{submission.service}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${submission.read ? 'text-nts-green' : 'text-nts-warn'}`}>
                          {submission.read ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-mono ${submission.emailSentToAdmin ? 'text-nts-green' : 'text-nts-danger'}`}>
                          {submission.emailSentToAdmin ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-adm-textBody text-xs">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
                          title="View details"
                        >
                          View
                        </button>
                        <DeleteButton id={submission.id} type="contact" name={submission.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BoldPanel>
        )}
      </div>

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
