import { prisma } from "@/lib/db";
import Link from "next/link";
import { BoldPanel } from "@/components/admin/ui/BoldPanel";
import { BoldButton } from "@/components/admin/ui/BoldButton";
import DeleteButton from "@/components/admin/DeleteButton";

async function getTestimonials(searchQuery?: string) {
  try {
    const where = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } },
            { company: { contains: searchQuery, mode: "insensitive" as const } },
            { text: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
    return testimonials;
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const testimonials = await getTestimonials(searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">
            Testimonials
          </h1>
          <p className="text-xs text-adm-textMut mt-1">
            {testimonials.length} {testimonials.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <BoldButton variant="primary" size="md">
            + New Testimonial
          </BoldButton>
        </Link>
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search by name, company, or text..."
            defaultValue={searchQuery}
            className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
          />
          <BoldButton type="submit" variant="primary" size="md">
            Search
          </BoldButton>
          {searchQuery && (
            <Link href="/admin/testimonials">
              <BoldButton variant="secondary" size="md">
                Clear
              </BoldButton>
            </Link>
          )}
        </div>
      </form>

      {testimonials.length === 0 ? (
        <BoldPanel cornerBrackets>
          <div className="py-12 text-center">
            <p className="text-adm-textMut text-sm font-mono mb-4">No testimonials found</p>
            <Link href="/admin/testimonials/new">
              <BoldButton variant="secondary" size="md">
                + New Testimonial
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
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-40">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left w-40">
                    Company
                  </th>
                  <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-left flex-1">
                    Text
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
                {testimonials.map((item: any) => (
                  <tr key={item.id} className="hover:bg-adm-panelAlt/30 transition-colors">
                    <td className="px-4 py-3 text-adm-textBody">{item.name}</td>
                    <td className="px-4 py-3 text-adm-textBody">{item.company}</td>
                    <td className="px-4 py-3 text-adm-textBody truncate">{item.text}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-mono ${item.featured ? 'text-nts-green' : 'text-adm-textMut'}`}>
                        {item.featured ? '✓' : '−'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/testimonials/${item.id}/edit`}
                        className="text-nts-info hover:text-cyan-300 text-xs font-mono transition-colors"
                        title="Edit"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={item.id} type="testimonial" name={item.name} />
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
