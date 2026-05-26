import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Simple auth check - you would want to enhance this
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  // For now, just check if token exists. In production, verify JWT/session
  return !!token || !!request.cookies.get("auth-token");
}

export async function GET(request: NextRequest) {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { username: true } },
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        ...job,
        applicationCount: job._count.applications,
      })),
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      slug,
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

    // Validate required fields
    if (
      !title ||
      !slug ||
      !department ||
      !location ||
      !employmentType ||
      !closesAt ||
      !description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingJob = await prisma.job.findUnique({
      where: { slug },
    });

    if (existingJob) {
      return NextResponse.json(
        { error: "A job with this slug already exists" },
        { status: 400 }
      );
    }

    // Join array items with newlines for storage
    const responsibilitiesText = Array.isArray(responsibilities)
      ? responsibilities.join("\n")
      : responsibilities || "";

    const requirementsText = Array.isArray(requirements)
      ? requirements.join("\n")
      : requirements || "";

    const job = await prisma.job.create({
      data: {
        title,
        slug,
        department,
        location,
        employmentType,
        salaryRange: salaryRange || "",
        experience: experience || "",
        closesAt: new Date(closesAt),
        description,
        responsibilities: responsibilitiesText,
        requirements: requirementsText,
        status: status || "DRAFT",
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
