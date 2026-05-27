import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";

async function getProjects(searchQuery?: string) {
  try {
    const where = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { description: { contains: searchQuery, mode: "insensitive" as const } },
            { category: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { date: "desc" },
    });
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const projects = await getProjects(searchQuery);

  const columns: ColumnDef<any>[] = [
    {
      key: "title",
      label: "Title",
      width: "flex-1",
    },
    {
      key: "category",
      label: "Category",
      width: "w-32",
    },
    {
      key: "date",
      label: "Date",
      width: "w-32",
      render: (project) => new Date(project.date).toLocaleDateString(),
    },
    {
      key: "featured",
      label: "Featured",
      width: "w-24",
      align: "center",
      render: (project) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-mono font-semibold ${
          project.featured
            ? "bg-green-100 text-green-900"
            : "bg-gray-100 text-gray-700"
        }`}>
          {project.featured ? "YES" : "NO"}
        </span>
      ),
    },
  ];

  return (
    <AdminListPage
      title="Projects"
      items={projects}
      columns={columns}
      newUrl="/admin/projects/new"
      newLabel="+ New Project"
      searchPlaceholder="Search by title, description, or category..."
      emptyStateMessage="No projects found"
      renderActions={(project) => (
        <>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="text-nts-green hover:text-green-400 text-xs font-mono transition-colors"
          >
            Edit
          </Link>
          <DeleteProjectButton projectId={project.id} />
        </>
      )}
    />
  );
}
