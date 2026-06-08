import Link from "next/link";
import { prisma } from "@/lib/db";
import { FaStar, FaEdit } from "react-icons/fa";
import DeleteReviewButton from "@/components/admin/reviews/DeleteReviewButton";
import { BoldPanel } from "@/components/admin/ui/BoldPanel";

export default async function ReviewsPage() {
  const reviews = await prisma.googleReview.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">Google Reviews</h1>
          <p className="text-xs text-adm-textMut mt-1">
            Manage reviews displayed on your homepage
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="px-4 py-2 bg-nts-green text-white rounded-lg font-semibold hover:bg-brand-green-600 transition-colors"
        >
          + Add Review
        </Link>
      </div>

      {/* Reviews Table */}
      <BoldPanel cornerBrackets>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-adm-border">
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left">
                  Review Text
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center">
                  Rating
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center">
                  Featured
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center">
                  Order
                </th>
                <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-adm-textMut text-sm font-mono">
                    No reviews added yet
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-adm-panelAlt/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-adm-textPri">
                        {review.reviewerName}
                      </p>
                      {review.reviewerTitle && (
                        <p className="text-xs text-adm-textMut">{review.reviewerTitle}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-adm-textBody line-clamp-2">
                        {review.reviewText}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <FaStar key={i} size={14} style={{ color: "#fbbf24" }} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          review.featured
                            ? "bg-nts-green/20 text-nts-green"
                            : "bg-adm-panelAlt text-adm-textMut"
                        }`}
                      >
                        {review.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-semibold text-adm-textBody">
                        {review.order}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/reviews/${review.id}`}
                          className="p-2 hover:bg-adm-panelAlt rounded transition-colors text-adm-textMut hover:text-nts-green"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <DeleteReviewButton reviewId={review.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BoldPanel>
    </div>
  );
}
