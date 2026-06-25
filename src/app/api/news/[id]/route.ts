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
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission
    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit news items" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        cropX: body.cropX !== undefined ? body.cropX : undefined,
        cropY: body.cropY !== undefined ? body.cropY : undefined,
        cropWidth: body.cropWidth !== undefined ? body.cropWidth : undefined,
        cropHeight: body.cropHeight !== undefined ? body.cropHeight : undefined,
        featured: body.featured,
      },
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
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission
    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete news items" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.newsItem.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news item" }, { status: 500 });
  }
}
