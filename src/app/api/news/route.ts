import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function GET() {
  try {
    const newsItems = await prisma.newsItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(newsItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, featured, imageUrl, gallery } = body as {
      title: string;
      content: string;
      featured: boolean;
      imageUrl?: string;
      gallery?: string[];
    };

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || "",
        featured: featured ?? false,
        images: gallery && gallery.length > 0
          ? { create: gallery.map((url, i) => ({ imageUrl: url, order: i })) }
          : undefined,
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("News creation error:", error);
    return NextResponse.json({ error: "Failed to create news item" }, { status: 500 });
  }
}
