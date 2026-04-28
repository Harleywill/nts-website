"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteNewsButton({ newsId }: { newsId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this news item?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete news item");
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
