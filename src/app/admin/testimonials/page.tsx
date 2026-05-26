import { prisma } from "@/lib/db";
import Link from "next/link";
import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          New Testimonial
        </Link>
      </div>

      <form className="mb-6" method="GET">
        <div className="flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by name, company, or testimonial text..."
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
              href="/admin/testimonials"
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No testimonials yet</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create your first testimonial
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Text
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
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {testimonial.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {testimonial.company || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {testimonial.text}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        testimonial.featured
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {testimonial.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <DeleteTestimonialButton testimonialId={testimonial.id} />
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
