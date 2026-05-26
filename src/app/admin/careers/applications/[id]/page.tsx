import Link from "next/link";
import { prisma } from "@/lib/db";
import { statusPillColors } from "@/lib/careers";
import { formatDistanceToNow, format } from "date-fns";
import { notFound } from "next/navigation";
import ApplicationStatusForm from "@/components/admin/careers/ApplicationStatusForm";

export const metadata = {
  title: "Application Details - Admin",
};

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: { select: { title: true, id: true, slug: true } },
    },
  });

  if (!application) {
    notFound();
  }

  const colors = statusPillColors(application.status);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/admin/careers/applications" className="text-blue-600 hover:text-blue-800">
          Applications
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{application.fullName}</span>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {application.fullName}
          </h1>
          <p className="text-gray-600">
            Applied for: <span className="font-medium">{application.job.title}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Reference: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{application.reference}</code>
          </p>
        </div>
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          {application.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <a href={`mailto:${application.email}`} className="text-blue-600 hover:text-blue-800">
                  {application.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <a href={`tel:${application.phone}`} className="text-blue-600 hover:text-blue-800">
                  {application.phone}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Postcode</p>
                <p className="text-gray-900">{application.postcode}</p>
              </div>
            </div>
          </div>

          {application.coverLetter && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Cover Letter</h2>
              <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {application.coverLetter}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
            <form className="space-y-4">
              <textarea
                name="notes"
                defaultValue={application.notes || ""}
                placeholder="Add internal notes about this application..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Notes
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Status</h2>
            <ApplicationStatusForm applicationId={application.id} currentStatus={application.status} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Submitted</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(application.submittedAt), "PPP 'at' HH:mm")}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(application.updatedAt), "PPP 'at' HH:mm")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">CV</h2>
            <p className="text-sm text-gray-600 mb-3">
              Filename: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{application.cvFilename}</code>
            </p>
            <a
              href={application.cvUrl}
              download
              className="block w-full px-6 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download CV
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Job</h2>
            <Link
              href={`/admin/careers/${application.job.id}/edit`}
              className="block text-blue-600 hover:text-blue-800 font-medium"
            >
              {application.job.title} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
