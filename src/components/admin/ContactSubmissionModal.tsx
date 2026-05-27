"use client";

import { useState } from "react";
import { FaTimes, FaCheck, FaExclamation, FaCopy } from "react-icons/fa";

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

interface ContactSubmissionModalProps {
  submission: ContactSubmission | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number, read: boolean) => void;
}

export default function ContactSubmissionModal({
  submission,
  onClose,
  onDelete,
  onMarkAsRead,
}: ContactSubmissionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const adminEmails = submission.adminEmails
    ? JSON.parse(submission.adminEmails)
    : ["info@nt.services", "hjakewilliams@gmail.com"];

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Contact Submission Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Submission Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Submitted
              </h3>
              <p className="text-blue-700">{formatDate(submission.createdAt)}</p>
            </div>
            <div className={`rounded-lg p-4 ${submission.read ? "bg-green-50" : "bg-yellow-50"}`}>
              <h3 className={`text-sm font-semibold ${submission.read ? "text-green-900" : "text-yellow-900"} mb-2`}>
                Status
              </h3>
              <p className={submission.read ? "text-green-700" : "text-yellow-700"}>
                {submission.read ? "Read" : "Unread"}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="text-gray-900 font-medium">{submission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-green-600 hover:text-green-700 font-medium break-all"
                  >
                    {submission.email}
                  </a>
                  {submission.email && (
                    <button
                      onClick={() => handleCopyEmail(submission.email)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Copy email"
                    >
                      <FaCopy size={14} />
                    </button>
                  )}
                </div>
              </div>
              {submission.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <a
                    href={`tel:${submission.phone}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {submission.phone}
                  </a>
                </div>
              )}
              {submission.service && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service
                  </label>
                  <p className="text-gray-900 font-medium">{submission.service}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {submission.message}
              </p>
            </div>
          </div>

          {/* Email Delivery Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Email Delivery Status
            </h3>
            <div className="space-y-3">
              {/* Admin Notification */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {submission.emailSentToAdmin ? (
                        <>
                          <FaCheck size={16} className="text-green-600" />
                          <span>Admin Notification Sent</span>
                        </>
                      ) : (
                        <>
                          <FaExclamation size={16} className="text-red-600" />
                          <span>Admin Notification Failed</span>
                        </>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {submission.emailSentToAdmin
                        ? "Email was successfully sent to the admin team"
                        : "Failed to send email to admin team"}
                    </p>
                  </div>
                </div>

                {/* Admin Emails List */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Admin Emails Notified:
                  </p>
                  <div className="space-y-2">
                    {adminEmails.map((email: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            submission.emailSentToAdmin
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-gray-700 break-all">{email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {submission.emailError && (
                  <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 p-2 rounded text-red-700 text-sm">
                    <strong>Error:</strong> {submission.emailError}
                  </div>
                )}
              </div>

              {/* User Confirmation */}
              {submission.email && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {submission.emailSentToUser ? (
                          <>
                            <FaCheck size={16} className="text-green-600" />
                            <span>User Confirmation Sent</span>
                          </>
                        ) : (
                          <>
                            <FaExclamation size={16} className="text-red-600" />
                            <span>User Confirmation Failed</span>
                          </>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {submission.emailSentToUser
                          ? `Confirmation email was sent to ${submission.email}`
                          : "Failed to send confirmation email to user"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Sent To:
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          submission.emailSentToUser
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-gray-700 break-all">{submission.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onMarkAsRead(submission.id, !submission.read)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                submission.read
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {submission.read ? "Mark as Unread" : "Mark as Read"}
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to delete this submission?"
                  )
                ) {
                  onDelete(submission.id);
                }
              }}
              className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
