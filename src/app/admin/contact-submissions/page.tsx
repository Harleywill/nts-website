"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

interface ContactSubmission {
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
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const res = await fetch(`/api/contact-submissions?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete submission");
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard" className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4">
            <FaArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-2">Manage messages from your website contact form</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{submissions.length}</p>
          <p className="text-gray-600">Total submissions</p>
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
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Service</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-700">Message Preview</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{submission.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <a href={`mailto:${submission.email}`} className="text-green-600 hover:underline">
                      {submission.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{submission.phone || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{submission.service || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">
                    {submission.message.substring(0, 50)}...
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
