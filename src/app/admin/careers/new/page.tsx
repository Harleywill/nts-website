import JobForm from "@/components/admin/careers/JobForm";

export const metadata = {
  title: "New Job - Admin",
};

export default function NewJobPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-2">
          Create a new job opening for your careers page
        </p>
      </div>

      <JobForm mode="new" />
    </div>
  );
}
