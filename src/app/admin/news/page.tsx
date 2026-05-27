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
      render: (news) => new Date(news.createdAt).toLocaleDateString(),
    },
    {
      key: "featured",
      label: "Featured",
      width: "w-24",
      align: "center",
      render: (news) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-mono font-semibold ${
          news.featured
            ? "bg-green-100 text-green-900"
            : "bg-gray-100 text-gray-700"
        }`}>
          {news.featured ? "YES" : "NO"}
        </span>
      ),
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
      renderActions={(news) => (
        <>
          <Link
            href={`/admin/news/${news.id}/edit`}
            className="text-nts-green hover:text-green-400 text-xs font-mono transition-colors"
          >
            Edit
          </Link>
          <DeleteNewsButton newsId={news.id} />
        </>
      )}
    />
  );
}
