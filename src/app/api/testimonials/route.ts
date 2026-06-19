import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

// Public GET - fetch all testimonials ordered by featured and creation order
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: { project: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// Admin POST - requires 'edit' permission
export async function POST(request: NextRequest) {
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
    if (!hasPermission(userRole, "testimonials")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage testimonials" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Testimonial text is required" },
        { status: 400 }
      );
    }

    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        text: body.text.trim(),
        name: body.name.trim(),
        company: body.company ? body.company.trim() : null,
        projectId: body.projectId ? parseInt(body.projectId) : null,
        featured: typeof body.featured === "boolean" ? body.featured : false,
      },
      include: { project: true },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
