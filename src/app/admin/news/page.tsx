import { prisma } from "@/lib/db";
import Link from "next/link";
import { BoldPanel } from "@/components/admin/ui/BoldPanel";
import { BoldButton } from "@/components/admin/ui/BoldButton";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">
            News
          </h1>
          <p className="text-xs text-adm-textMut mt-1">
            {newsItems.length} {newsItems.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Link href="/admin/news/new">
          <BoldButton variant="primary" size="md">
            + New Article
          </BoldButton>
        </Link>
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search by title or content..."
            defaultValue={searchQuery}
            className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
          />
          <BoldButton type="submit" variant="primary" size="md">
            Search
          </BoldButton>
          {searchQuery && (
            <Link href="/admin/news">
              <BoldButton variant="secondary" size="md">
                Clear
              </BoldButton>
            </Link>
          )}
        </div>
      </form>

      {newsItems.length === 0 ? (
        <BoldPanel cornerBrackets>
          <div className="py-12 text-center">
            <p className="text-adm-textMut text-sm font-mono mb-4">No news articles found</p>
            <Link href="/admin/news/new">
              <BoldButton variant="secondary" size="md">
                + New Article
              </BoldButton>
            </Link>
          </div>
        </BoldPanel>
      ) : (
        <BoldPanel cornerBrackets>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-adm-border">
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left flex-1">
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-32">
                    Created
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-center w-24">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-right w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border/50">
                {newsItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-adm-panelAlt/30 transition-colors">
                    <td className="px-4 py-3 text-adm-textBody">{item.title}</td>
                    <td className="px-4 py-3 text-adm-textBody">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-mono ${item.featured ? 'text-nts-green' : 'text-adm-textMut'}`}>
                        {item.featured ? '✓' : '−'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
                        title="Edit"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={item.id} type="news" name={item.title} />
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
