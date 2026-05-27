import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "users"; // users, projects, news, testimonials, submissions, applications

    // Get the last 30 days of stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // First, ensure today's stats exist
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayStats = await prisma.dailyStats.findUnique({
      where: { date: today },
    });

    if (!todayStats) {
      // Create today's stats by counting current records
      const [
        userCount,
        projectCount,
        newsCount,
        testimonialCount,
        contactSubmissionCount,
        applicationCount,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.newsItem.count(),
        prisma.testimonial.count(),
        prisma.contactSubmission.count(),
        prisma.application.count(),
      ]);

      todayStats = await prisma.dailyStats.create({
        data: {
          date: today,
          userCount,
          projectCount,
          newsCount,
          testimonialCount,
          contactSubmissionCount,
          applicationCount,
        },
      });
    }

    // Fetch stats for the last 30 days
    const stats = await prisma.dailyStats.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Extract the data for the requested type
    let data: number[] = [];
    if (type === "users") {
      data = stats.map((s) => s.userCount);
    } else if (type === "projects") {
      data = stats.map((s) => s.projectCount);
    } else if (type === "news") {
      data = stats.map((s) => s.newsCount);
    } else if (type === "testimonials") {
      data = stats.map((s) => s.testimonialCount);
    } else if (type === "submissions") {
      data = stats.map((s) => s.contactSubmissionCount);
    } else if (type === "applications") {
      data = stats.map((s) => s.applicationCount);
    }

    // If we have fewer than 30 days of data, fill the gaps with the first available value
    if (data.length < 30) {
      const firstValue = data.length > 0 ? data[0] : 0;
      const fillCount = 30 - data.length;
      data = Array(fillCount).fill(firstValue).concat(data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching stats history:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats history" },
      { status: 500 }
    );
  }
}
