import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteButton from "@/components/admin/DeleteButton";
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
    },
    {
      key: "featured",
      label: "Featured",
      width: "w-24",
      align: "center",
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
      renderActions={(item: any) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/projects/${item.id}/edit`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="Edit"
          >
            Edit
          </Link>
          <DeleteButton 
            id={item.id} 
            type="project" 
            name={item.title}
          />
        </div>
      )}
    />
  );
}
