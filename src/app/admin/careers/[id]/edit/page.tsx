import { notFound } from "next/navigation";
import JobForm from "@/components/admin/careers/JobForm";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `Edit ${job.title} - Admin`,
  };
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600 mt-2">Update job details and publish when ready</p>
      </div>

      <JobForm job={job} mode="edit" />
    </div>
  );
}
