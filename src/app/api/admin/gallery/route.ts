import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessPermitted } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const denied = await denyUnlessPermitted(request, "gallery");
    if (denied) return denied;

    const [galleryImages, projectImages, newsImages] = await Promise.all([
      prisma.galleryImage.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.projectImage.findMany({
        orderBy: { createdAt: "desc" },
        include: { project: { select: { id: true, title: true } } },
      }),
      prisma.newsImage.findMany({
        orderBy: { order: "asc" },
        include: { newsItem: { select: { id: true, title: true } } },
      }),
    ]);

    const combined = [
      ...galleryImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        alt: img.alt,
        caption: img.caption,
        category: img.category,
        published: img.published,
        order: img.order,
        source: "gallery" as const,
        sourceLabel: null,
        sourceId: null,
      })),
      ...projectImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        alt: img.alt ?? "",
        caption: "",
        category: "Projects",
        published: true,
        order: 0,
        source: "project" as const,
        sourceLabel: img.project.title,
        sourceId: img.project.id,
      })),
      ...newsImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        alt: img.alt ?? "",
        caption: "",
        category: "News",
        published: true,
        order: img.order,
        source: "news" as const,
        sourceLabel: img.newsItem.title,
        sourceId: img.newsItem.id,
      })),
    ];

    return NextResponse.json(combined);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await denyUnlessPermitted(request, "gallery");
    if (denied) return denied;
    const body = await request.json() as { imageUrl: string; alt?: string; caption?: string; category?: string };
    if (!body.imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }
    const image = await prisma.galleryImage.create({
      data: {
        imageUrl: body.imageUrl,
        alt: body.alt ?? "",
        caption: body.caption ?? "",
        category: body.category ?? "General",
        published: true,
      },
    });
    return NextResponse.json({
      ...image,
      source: "gallery",
      sourceLabel: null,
      sourceId: null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}
