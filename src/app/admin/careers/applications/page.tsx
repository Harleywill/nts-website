import Link from "next/link";
import { prisma } from "@/lib/db";
import { BoldPanel } from "@/components/admin/ui/BoldPanel";
import { BoldButton } from "@/components/admin/ui/BoldButton";
import DeleteButton from "@/components/admin/DeleteButton";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">
            Applications
          </h1>
          <p className="text-xs text-adm-textMut mt-1">
            {applications.length} {applications.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
        <BoldPanel title="Total">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.total}</div>
        </BoldPanel>
        <BoldPanel title="New">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.new}</div>
        </BoldPanel>
        <BoldPanel title="Reviewing">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.reviewing}</div>
        </BoldPanel>
        <BoldPanel title="Interview">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.interview}</div>
        </BoldPanel>
        <BoldPanel title="Offer">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.offer}</div>
        </BoldPanel>
        <BoldPanel title="Hired">
          <div className="text-2xl font-mono font-bold text-nts-green">{counts.hired}</div>
        </BoldPanel>
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search by name or email..."
            defaultValue={search}
            className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
          />
          <BoldButton type="submit" variant="primary" size="md">
            Search
          </BoldButton>
        </div>
      </form>

      {applications.length === 0 ? (
        <BoldPanel cornerBrackets>
          <div className="py-12 text-center">
            <p className="text-adm-textMut text-sm font-mono">No applications found</p>
          </div>
        </BoldPanel>
      ) : (
        <BoldPanel cornerBrackets>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-adm-border">
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-40">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left flex-1">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-32">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center w-24">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-right w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border/50">
                {applications.map((item: any) => (
                  <tr key={item.id} className="hover:bg-adm-panelAlt/30 transition-colors">
                    <td className="px-4 py-3 text-adm-textBody">{item.fullName}</td>
                    <td className="px-4 py-3 text-adm-textBody">{item.email}</td>
                    <td className="px-4 py-3 text-adm-textBody">{item.phone}</td>
                    <td className="px-4 py-3 text-center text-xs font-mono text-adm-textMut">{item.status}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/careers/applications/${item.id}`}
                        className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
                        title="View"
                      >
                        View
                      </Link>
                      <DeleteButton id={item.id} type="application" name={item.fullName} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BoldPanel>
      )}
    </div>
  );
}
