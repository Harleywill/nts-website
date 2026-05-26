"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This will also delete all associated applications.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMsg = "Failed to delete job";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // If response is not JSON, use default message
        }

        if (res.status === 404) {
          errorMsg = "Job not found";
        } else if (res.status === 500) {
          errorMsg = "Server error - please try again";
        }

        alert(errorMsg);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err) {
      alert("An error occurred");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 border-2 border-red-600"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
