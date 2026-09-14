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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "projects")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit projects" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { published } = await request.json();

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published must be a boolean" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { published },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to update project publish status:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
