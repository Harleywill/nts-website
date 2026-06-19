import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
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
    if (!hasPermission(authResult.user.role, "contact-submissions")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view submissions" },
        { status: 403 }
      );
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    if (!hasPermission(authResult.user.role, "contact-submissions")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update submissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { read } = body;

    const updated = await prisma.contactSubmission.update({
      where: { id: parseInt(id) },
      data: { read },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    if (!hasPermission(authResult.user.role, "contact-submissions")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete submissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // P2025 = record not found, which is fine for delete (idempotent)
    if (error?.code === "P2025") {
      return NextResponse.json({ success: true });
    }

    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
