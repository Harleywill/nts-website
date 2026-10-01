import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessPermitted } from "@/lib/auth-middleware";

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}

export async function GET(request: NextRequest) {
  try {
    const denied = await denyUnlessPermitted(request, "careers");
    if (denied) return denied;

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await denyUnlessPermitted(request, "careers");
    if (denied) return denied;

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

    if (
      !title ||
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

    // Generate unique slug
    const baseSlug = toKebabCase(title);
    let slug = baseSlug;

    // Check for conflicts
    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${shortId()}`;
    }

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
        responsibilities: responsibilities || "",
        requirements: requirements || "",
        status: status || "DRAFT",
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
