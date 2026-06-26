import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
  try {
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const submissionId = parseInt(id);
    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
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

    // Check delete permission
    if (!hasPermission(authResult.user.role, "contact-submissions")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete submissions" },
        { status: 403 }
      );
    }

    await prisma.contactSubmission.delete({
      where: { id: submissionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const submissionId = parseInt(id);
    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { read, status } = body;

    const updateData: Record<string, unknown> = {};
    if (read !== undefined) updateData.read = read;
    if (status !== undefined) {
      const validStatuses = ["UNREAD", "READ", "REPLIED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = status;
      updateData.read = status !== "UNREAD";
    }

    const submission = await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
