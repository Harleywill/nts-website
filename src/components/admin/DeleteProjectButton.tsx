"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ projectId }: { projectId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMsg = "Failed to delete project";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          // If response is not JSON, use default message
        }

        if (res.status === 404) {
          errorMsg = "Project not found";
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
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
