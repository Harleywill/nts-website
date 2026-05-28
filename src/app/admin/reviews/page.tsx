import Link from "next/link";
import { prisma } from "@/lib/db";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";

export default async function ReviewsPage() {
  const reviews = await prisma.googleReview.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage reviews displayed on your homepage
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          + Add Review
        </Link>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Reviewer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Review Text
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Featured
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No reviews added yet
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </p>
                    {review.reviewerTitle && (
                      <p className="text-xs text-gray-600">{review.reviewerTitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {review.reviewText}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} size={14} style={{ color: "#f59e0b" }} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        review.featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {review.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {review.order}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/reviews/${review.id}`}
                        className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-green-600"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
