import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "projects")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}
