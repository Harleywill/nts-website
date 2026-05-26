import Link from "next/link";
import { Job } from "@prisma/client";
import { EmploymentType } from "@prisma/client";

interface JobCardProps {
  job: Job & { _count?: { applications: number } };
}

function formatEmploymentType(type: EmploymentType): string {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export default function JobCard({ job }: JobCardProps) {
  const daysUntilClose = Math.ceil(
    (new Date(job.closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/careers/${job.slug}`}>
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_4px_18px_rgba(13,21,48,0.05)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(13,21,48,0.08)] hover:-translate-y-1">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1a2f6e] transition-colors">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{job.department}</p>
          </div>
          {daysUntilClose <= 7 && daysUntilClose > 0 && (
            <span className="ml-2 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Closes soon
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-2 text-gray-600">{job.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {job.location}
          </span>
          {job.salaryRange && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {job.salaryRange}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-600">
            Closes in{" "}
            <span className="font-semibold text-gray-900">
              {daysUntilClose > 0 ? `${daysUntilClose} day${daysUntilClose !== 1 ? "s" : ""}` : "Closed"}
            </span>
          </div>
          <span className="text-sm font-semibold text-[#4caf50] group-hover:translate-x-1 transition-transform">
            View Role →
          </span>
        </div>
      </div>
    </Link>
  );
}
