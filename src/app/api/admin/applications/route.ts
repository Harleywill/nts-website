import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessPermitted } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const denied = await denyUnlessPermitted(request, "applications");
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: Record<string, unknown> = {};

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.application.count({ where });

    // Get applications
    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { select: { title: true, department: true } },
      },
      orderBy: { submittedAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
