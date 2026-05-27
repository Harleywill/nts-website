"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCheck, FaExclamation, FaEnvelope } from "react-icons/fa";

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
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4"
        >
          <FaArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Email Log</h1>
        <p className="text-gray-600 mt-2">
          Track all emails sent from your contact form and applications
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total Emails</p>
          <p className="text-2xl font-bold text-blue-900">{emails.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Delivered</p>
          <p className="text-2xl font-bold text-green-900">{deliveredCount}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-red-600 text-sm font-medium">Failed</p>
          <p className="text-2xl font-bold text-red-900">{failedCount}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Success Rate</p>
          <p className="text-2xl font-bold text-purple-900">
            {emails.length === 0 ? "—" : `${Math.round((deliveredCount / emails.length) * 100)}%`}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          All ({emails.length})
        </button>
        <button
          onClick={() => setFilter("delivered")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === "delivered"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          <FaCheck size={12} /> Delivered ({deliveredCount})
        </button>
        <button
          onClick={() => setFilter("failed")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === "failed"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          <FaExclamation size={12} /> Failed ({failedCount})
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading email log...</p>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          <FaEnvelope size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No emails found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  From
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  To
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Subject
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">
                  Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => (
                <tr key={email.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        email.type === "admin-notification"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {email.type === "admin-notification"
                        ? "Admin Alert"
                        : "User Confirmation"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                    {email.from}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm break-all">
                    <a
                      href={`mailto:${email.to}`}
                      className="text-green-600 hover:underline"
                    >
                      {email.to}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <span className="truncate max-w-xs block" title={email.subject}>
                      {email.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {email.status === "delivered" ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-sm">
                        <FaCheck size={14} className="text-green-600" />
                        Delivered
                      </span>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 text-red-700 text-sm mb-1">
                          <FaExclamation size={14} className="text-red-600" />
                          Failed
                        </span>
                        {email.error && (
                          <p className="text-xs text-red-600 font-medium mt-1">
                            {email.error}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                    {new Date(email.timestamp).toLocaleString("en-GB", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Email Type Legend</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Admin Alert
            </p>
            <p className="text-sm text-gray-600">
              Notification sent to admin team when a contact form is submitted
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              User Confirmation
            </p>
            <p className="text-sm text-gray-600">
              Confirmation email sent to the user who submitted the form
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
