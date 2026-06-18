import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateAccreditation, sanitizeAccreditation } from "@/lib/accreditations";
import { verifyAuthWithUser } from "@/lib/auth-middleware";

/**
 * GET /api/accreditations
 * Public endpoint - returns all accreditations ordered by order field
 */
export async function GET() {
  try {
    const accreditations = await prisma.accreditation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(accreditations);
  } catch (error) {
    console.error("Failed to fetch accreditations:", error);
    return NextResponse.json(
      { error: "Failed to fetch accreditations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/accreditations
 * Admin-only endpoint - creates a new accreditation
 * Requires 'edit' permission
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuthWithUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error || "Authentication failed" },
        { status: 401 }
      );
    }

    // Check if user has 'edit' permission (admin/manager roles typically have this)
    if (!authResult.user || (authResult.user.role !== "ADMIN" && authResult.user.role !== "MANAGER")) {
      return NextResponse.json(
        { error: "You do not have permission to create accreditations" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = validateAccreditation(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitized = sanitizeAccreditation(body);

    // Create accreditation
    const accreditation = await prisma.accreditation.create({
      data: {
        label: sanitized.label,
        order: sanitized.order,
      },
    });

    return NextResponse.json(accreditation, { status: 201 });
  } catch (error) {
    console.error("Failed to create accreditation:", error);
    return NextResponse.json(
      { error: "Failed to create accreditation" },
      { status: 500 }
    );
  }
}
