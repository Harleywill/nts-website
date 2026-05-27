import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";
import DeleteButton from "@/components/admin/DeleteButton";

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

  return (
    <AdminListPage
      title="News"
      items={newsItems}
      columns={columns}
      newUrl="/admin/news/new"
      newLabel="+ New Article"
      searchPlaceholder="Search by title or content..."
      emptyStateMessage="No news articles found"
      renderActions={(item: any) => (
        <div className="flex gap-2 justify-end">
          <Link
            href={`/admin/news/${item.id}/edit`}
            className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
            title="Edit"
          >
            Edit
          </Link>
          <DeleteButton 
            id={item.id} 
            type="news" 
            name={item.title}
          />
        </div>
      )}
    />
  );
}
