import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">News</h1>
        <Link
          href="/admin/news/new"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          New News Item
        </Link>
      </div>

      <form className="mb-6" method="GET">
        <div className="flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by title or content..."
            defaultValue={searchQuery}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Search
          </button>
          {searchQuery && (
            <Link
              href="/admin/news"
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {newsItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No news items yet</p>
          <Link
            href="/admin/news/new"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create your first news item
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
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {newsItems.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {news.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(news.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        news.featured
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {news.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <Link
                      href={`/admin/news/${news.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <DeleteNewsButton newsId={news.id} />
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
