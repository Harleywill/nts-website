import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsItem = await prisma.newsItem.findUnique({
      where: { id: parseInt(id) },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (!newsItem) {
      return NextResponse.json({ error: "News item not found" }, { status: 404 });
    }
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news item" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, imageUrl, featured, published, gallery } = body as {
      title: string;
      content: string;
      imageUrl?: string;
      featured?: boolean;
      published?: boolean;
      gallery?: string[];
    };

    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        imageUrl: imageUrl ?? "",
        featured: featured ?? false,
        published: published ?? false,
        // Replace all gallery images
        images: {
          deleteMany: {},
          create: (gallery ?? []).map((url, i) => ({ imageUrl: url, order: i })),
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update news item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.newsItem.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news item" }, { status: 500 });
  }
}
