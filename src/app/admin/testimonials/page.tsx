import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";

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

  const columns: ColumnDef<any>[] = [
    {
      key: "name",
      label: "Name",
      width: "w-40",
    },
    {
      key: "company",
      label: "Company",
      width: "w-40",
    },
    {
      key: "text",
      label: "Text",
      width: "flex-1",
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
      title="Testimonials"
      items={testimonials}
      columns={columns}
      newUrl="/admin/testimonials/new"
      newLabel="+ New Testimonial"
      searchPlaceholder="Search by name, company, or text..."
      emptyStateMessage="No testimonials found"
    />
  );
}
