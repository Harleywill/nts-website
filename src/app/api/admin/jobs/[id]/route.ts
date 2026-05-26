import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAdminAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("auth-token");
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
    const {
      title,
      department,
      location,
      employmentType,
      salaryRange,
      experience,
      closesAt,
      description,
      responsibilities,
      requirements,
      status,
    } = body;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (department !== undefined) updateData.department = department;
    if (location !== undefined) updateData.location = location;
    if (employmentType !== undefined) updateData.employmentType = employmentType;
    if (salaryRange !== undefined) updateData.salaryRange = salaryRange;
    if (experience !== undefined) updateData.experience = experience;
    if (closesAt !== undefined) updateData.closesAt = new Date(closesAt);
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    if (responsibilities !== undefined) {
      updateData.responsibilities = Array.isArray(responsibilities)
        ? responsibilities.join("\n")
        : responsibilities;
    }

    if (requirements !== undefined) {
      updateData.requirements = Array.isArray(requirements)
        ? requirements.join("\n")
        : requirements;
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const job = await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
