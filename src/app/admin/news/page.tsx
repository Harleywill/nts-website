import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";

async function getNewsItems(searchQuery?: string) {
  try {
    const where = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { content: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const newsItems = await prisma.newsItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return newsItems;
  } catch (error) {
    console.error("Failed to fetch news items:", error);
    return [];
  }
}

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const newsItems = await getNewsItems(searchQuery);

  const columns: ColumnDef<any>[] = [
    {
      key: "title",
      label: "Title",
      width: "flex-1",
    },
    {
      key: "createdAt",
      label: "Created",
      width: "w-32",
    },
    {
      key: "featured",
      label: "Featured",
      width: "w-24",
      align: "center",
    },
  ];

  // Add actions column
  const columnsWithActions: ColumnDef<any>[] = [
    ...columns,
    {
      key: "actions",
      label: "Actions",
      width: "w-32",
      align: "right",
      render: (news) => null, // Placeholder - actions handled by server component below
    },
  ];

  return (
    <AdminListPage
      title="News"
      items={newsItems}
      columns={columns}
      newUrl="/admin/news/new"
      newLabel="+ New Article"
      searchPlaceholder="Search by title or content..."
      emptyStateMessage="No news articles found"
    />
  );
}
