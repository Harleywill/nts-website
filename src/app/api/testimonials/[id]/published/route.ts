import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testId = parseInt(id);
    if (isNaN(testId)) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "testimonials")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage testimonials" },
        { status: 403 }
      );
    }

    const { published } = await request.json();
    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published must be a boolean" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: testId },
      data: { published },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to update testimonial publish status:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
