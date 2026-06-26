import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendApplicationStatusUpdate } from "@/lib/email";

const EMAIL_TRIGGER_STATUSES = new Set(["INTERVIEW", "OFFER", "HIRED"]);

function isAdminAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("admin-session");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, notes } = body;

    // Fetch current status before updating so we only email on genuine transitions
    const existing = await prisma.application.findUnique({
      where: { id },
      select: { status: true, fullName: true, email: true, reference: true },
    });

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        job: { select: { title: true } },
      },
    });

    // Fire status-change email for key milestones (only on genuine status change)
    if (
      existing &&
      status !== undefined &&
      status !== existing.status &&
      EMAIL_TRIGGER_STATUSES.has(status)
    ) {
      sendApplicationStatusUpdate(
        existing.fullName,
        existing.email,
        application.job.title,
        existing.reference,
        status
      ).catch((err) => console.error("Status update email failed:", err));
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
