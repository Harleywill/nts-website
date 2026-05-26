import Link from "next/link";
import { prisma } from "@/lib/db";
import { statusPillColors } from "@/lib/careers";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Applications - Admin",
};

async function getApplications(
  jobId?: string,
  status?: string,
  search?: string
) {
  const where: Record<string, unknown> = {};

  if (jobId) where.jobId = jobId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    include: {
      job: { select: { title: true, id: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return applications;
}

async function getCounts() {
  const counts = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.application.count({ where: { status: "REVIEWING" } }),
    prisma.application.count({ where: { status: "INTERVIEW" } }),
    prisma.application.count({ where: { status: "OFFER" } }),
    prisma.application.count({ where: { status: "HIRED" } }),
  ]);

  return {
    total: counts[0],
    new: counts[1],
    reviewing: counts[2],
    interview: counts[3],
    offer: counts[4],
    hired: counts[5],
  };
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    jobId?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { jobId, status, search } = params;

  const applications = await getApplications(jobId, status, search);
  const counts = await getCounts();
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Applications</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total", value: counts.total, color: "blue" },
          { label: "New", value: counts.new, color: "green" },
          { label: "Reviewing", value: counts.reviewing, color: "yellow" },
          { label: "Interview", value: counts.interview, color: "purple" },
          { label: "Offer", value: counts.offer, color: "indigo" },
          { label: "Hired", value: counts.hired, color: "emerald" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-50 rounded-lg border border-${stat.color}-200 p-4`}
          >
            <p className={`text-sm font-medium text-${stat.color}-900`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold text-${stat.color}-700`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              placeholder="Name or email..."
              defaultValue={search || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Job
            </label>
            <select
              name="jobId"
              defaultValue={jobId || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue={status || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Filter
          </button>
          <Link
            href="/admin/careers/applications"
            className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
          >
            Clear
          </Link>
        </div>
      </form>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const colors = statusPillColors(app.status);
                return (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.fullName}</p>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/careers/${app.job.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {app.job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {app.reference}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDistanceToNow(new Date(app.submittedAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/careers/applications/${app.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
