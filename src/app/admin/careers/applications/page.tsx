import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteButton from "@/components/admin/DeleteButton";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";

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
      { fullName: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
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

  const columns: ColumnDef<any>[] = [
    {
      key: "fullName",
      label: "Name",
      width: "w-40",
    },
    {
      key: "email",
      label: "Email",
      width: "flex-1",
    },
    {
      key: "phone",
      label: "Phone",
      width: "w-32",
    },
    {
      key: "status",
      label: "Status",
      width: "w-24",
      align: "center",
    },
  ];

  const kpiStats = [
    { label: "Total", count: counts.total, icon: "📋" },
    { label: "New", count: counts.new, icon: "🆕" },
    { label: "Reviewing", count: counts.reviewing, icon: "👀" },
    { label: "Interview", count: counts.interview, icon: "🎤" },
    { label: "Offer", count: counts.offer, icon: "🎉" },
    { label: "Hired", count: counts.hired, icon: "✓" },
  ];

  return (
    <AdminListPage
      title="Applications"
      items={applications}
      columns={columns}
      searchPlaceholder="Search by name or email..."
      emptyStateMessage="No applications found"
      kpiStats={kpiStats}
      renderActions={(item: any) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/careers/applications/${item.id}`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="View"
          >
            View
          </Link>
          <DeleteButton 
            id={item.id} 
            type="application" 
            name={item.fullName}
          />
        </div>
      )}
    />
  );
}
