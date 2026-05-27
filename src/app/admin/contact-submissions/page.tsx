"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrash, FaArrowLeft, FaEye, FaCheck, FaExclamation } from "react-icons/fa";
import ContactSubmissionModal from "@/components/admin/ContactSubmissionModal";

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
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact-submissions");
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: number) => {
    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete submission");
      setSubmissions(submissions.filter((s) => s.id !== id));
      setSelectedSubmission(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const markAsRead = async (id: number, read: boolean) => {
    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error("Failed to update submission");
      const updated = submissions.map((s) =>
        s.id === id ? { ...s, read } : s
      );
      setSubmissions(updated);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, read });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const unreadCount = submissions.filter((s) => !s.read).length;
  const emailSuccessCount = submissions.filter(
    (s) => s.emailSentToAdmin
  ).length;
  const emailFailureCount = submissions.filter(
    (s) => !s.emailSentToAdmin
  ).length;

  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4"
          >
            <FaArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Submissions
          </h1>
          <p className="text-gray-600 mt-2">
            Manage messages from your website contact form
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">
            {submissions.length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Unread</p>
          <p className="text-2xl font-bold text-yellow-900">{unreadCount}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Emails Sent</p>
          <p className="text-2xl font-bold text-green-900">
            {emailSuccessCount}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Email Failures</p>
          <p className="text-2xl font-bold text-red-900">{emailFailureCount}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No contact submissions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Service
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Email Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-center px-6 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    !submission.read ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {submission.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-green-600 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {submission.service || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {!submission.read ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full" />
                        Unread
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Read
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {submission.emailSentToAdmin ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-sm">
                        <FaCheck size={14} className="text-green-600" />
                        Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 text-sm">
                        <FaExclamation size={14} className="text-red-600" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(submission.createdAt).toLocaleString("en-GB", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        title="View details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                        title="Delete submission"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <ContactSubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onDelete={deleteSubmission}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
