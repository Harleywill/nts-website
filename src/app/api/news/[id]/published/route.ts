import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function PATCH(
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
    const { published } = await request.json();

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published must be a boolean" },
        { status: 400 }
      );
    }

    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: { published },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Failed to update news publish status:", error);
    return NextResponse.json({ error: "Failed to update news item" }, { status: 500 });
  }
}
