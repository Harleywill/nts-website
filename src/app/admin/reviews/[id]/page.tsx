import ReviewForm from "@/components/admin/reviews/ReviewForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await prisma.googleReview.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Update the review from {review.reviewerName}
        </p>
      </div>
      <ReviewForm initialData={review} />
    </div>
  );
}
