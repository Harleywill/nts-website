"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New", color: "bg-brand-green-50 text-brand-green-900" },
  { value: "REVIEWING", label: "Reviewing", color: "bg-yellow-50 text-yellow-900" },
  { value: "INTERVIEW", label: "Interview", color: "bg-blue-50 text-blue-900" },
  { value: "OFFER", label: "Offer", color: "bg-purple-50 text-purple-900" },
  { value: "HIRED", label: "Hired", color: "bg-brand-green-50 text-brand-green-900" },
  { value: "REJECTED", label: "Rejected", color: "bg-gray-50 text-gray-900" },
];

interface ApplicationStatusFormProps {
  applicationId: string;
  currentStatus: string;
}

export default function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: ApplicationStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {STATUS_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="status"
              value={option.value}
              checked={status === option.value}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
              className="w-4 h-4"
            />
            <span className="flex-1 font-medium text-gray-900">{option.label}</span>
            <span className={`text-xs px-2 py-1 rounded ${option.color}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || status === currentStatus}
        className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </form>
  );
}
