import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        ...job,
        applicationCount: job._count.applications,
      })),
    });
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
