import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteJobButton from "@/components/admin/DeleteJobButton";
import { formatDistanceToNow } from "date-fns";

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Careers</h1>
        <Link
          href="/admin/careers/new"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors border-2 border-green-700"
        >
          New Job
        </Link>
      </div>

      <form className="mb-6" method="GET">
        <div className="flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by title or department..."
            defaultValue={searchQuery}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 border-2 border-green-700"
          >
            Search
          </button>
          {searchQuery && (
            <Link
              href="/admin/careers"
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 border-2 border-gray-500"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No jobs yet</p>
          <Link
            href="/admin/careers/new"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors border-2 border-green-700"
          >
            Post your first job
          </Link>
        </div>
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
