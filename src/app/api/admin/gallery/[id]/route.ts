import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("admin-session");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json() as { alt?: string; caption?: string; category?: string; published?: boolean; order?: number };
    const image = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.caption !== undefined && { caption: body.caption }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({ ...image, source: "gallery", sourceLabel: null, sourceId: null });
  } catch {
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.galleryImage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
