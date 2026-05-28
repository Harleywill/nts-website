import ReviewForm from "@/components/admin/reviews/ReviewForm";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Add a new Google review to display on your homepage
        </p>
      </div>
      <ReviewForm />
    </div>
  );
}
