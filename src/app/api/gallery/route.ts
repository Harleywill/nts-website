import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [standalone, projectImages] = await Promise.all([
      prisma.galleryImage.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.projectImage.findMany({
        include: { project: { select: { category: true, title: true, published: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const standaloneItems = standalone.map((img) => ({
      id: `g-${img.id}`,
      imageUrl: img.imageUrl,
      alt: img.alt ?? "",
      caption: img.caption ?? "",
      category: img.category ?? "General",
      source: "gallery" as const,
    }));

    const projectItems = projectImages
      .filter((img) => img.project.published)
      .map((img) => ({
        id: `p-${img.id}`,
        imageUrl: img.imageUrl,
        alt: img.alt ?? img.project.title,
        caption: img.project.title,
        category: img.project.category,
        source: "project" as const,
      }));

    return NextResponse.json([...standaloneItems, ...projectItems]);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
