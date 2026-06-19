import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

// Public GET - fetch single testimonial by id
export async function GET(
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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testId },
      include: { project: true },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// Admin PATCH - partial update, requires 'edit' permission
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
    if (!hasPermission(userRole, "testimonials")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage testimonials" },
        { status: 403 }
      );
    }

    // Fetch existing testimonial
    const existing = await prisma.testimonial.findUnique({
      where: { id: testId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update data
    const updateData: any = {};
    if (body.text !== undefined && body.text !== null) {
      updateData.text = body.text.trim();
    }
    if (body.name !== undefined && body.name !== null) {
      updateData.name = body.name.trim();
    }
    if (body.company !== undefined) {
      updateData.company = body.company ? body.company.trim() : null;
    }
    if (body.projectId !== undefined) {
      updateData.projectId = body.projectId ? parseInt(body.projectId) : null;
    }
    if (body.featured !== undefined) {
      updateData.featured = body.featured;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: testId },
      data: updateData,
      include: { project: true },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// Admin DELETE - requires 'delete' permission
export async function DELETE(
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
    if (!hasPermission(userRole, "testimonials")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage testimonials" },
        { status: 403 }
      );
    }

    // Verify testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testId },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await prisma.testimonial.delete({
      where: { id: testId },
    });

    return NextResponse.json({ success: true, id: testId });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
