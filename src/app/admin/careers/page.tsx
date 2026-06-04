import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteJobButton from "@/components/admin/DeleteJobButton";
import { formatDistanceToNow } from "date-fns";
import { BoldPanel } from "@/components/admin/ui/BoldPanel";
import { BoldButton } from "@/components/admin/ui/BoldButton";

export const metadata = {
  title: "Careers Management - Admin",
};

export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";

  const jobs = await prisma.job.findMany({
    where: searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery } },
            { department: { contains: searchQuery } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">Careers</h1>
          <p className="text-xs text-adm-textMut mt-1">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
          </p>
        </div>
        <Link
          href="/admin/careers/new"
        >
          <BoldButton variant="primary" size="md">
            + New Job
          </BoldButton>
        </Link>
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search by title or department..."
            defaultValue={searchQuery}
            className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
          />
          <BoldButton type="submit" variant="primary" size="md">
            Search
          </BoldButton>
          {searchQuery && (
            <Link
              href="/admin/careers"
            >
              <BoldButton variant="secondary" size="md">
                Clear
              </BoldButton>
            </Link>
          )}
        </div>
      </form>

      {jobs.length === 0 ? (
        <BoldPanel cornerBrackets>
          <div className="py-12 text-center">
            <p className="text-adm-textMut text-sm font-mono mb-4">No jobs posted yet</p>
            <Link
              href="/admin/careers/new"
            >
              <BoldButton variant="secondary" size="md">
                Post your first job
              </BoldButton>
            </Link>
          </div>
        </BoldPanel>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Posted
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a
                      href={`/careers/${job.slug}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{job.department}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : job.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <Link
                      href={`/admin/careers/applications?jobId=${job.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {job._count?.applications || 0}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/careers/${job.id}/edit`}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 border-2 border-blue-600"
                      >
                        Edit
                      </Link>
                      <DeleteJobButton jobId={job.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
