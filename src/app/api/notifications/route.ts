import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch unread contact submissions
    const unreadSubmissions = await prisma.contactSubmission.count({
      where: { read: false },
    });

    // Fetch new applications
    const newApplications = await prisma.application.count({
      where: { status: "NEW" },
    });

    // Get recent items for preview
    const recentSubmissions = await prisma.contactSubmission.findMany({
      where: { read: false },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    const recentApplications = await prisma.application.findMany({
      where: { status: "NEW" },
      orderBy: { submittedAt: "desc" },
      take: 3,
      include: {
        job: { select: { title: true } },
      },
    });

    return NextResponse.json({
      unreadSubmissions,
      newApplications,
      totalCount: unreadSubmissions + newApplications,
      recent: [
        ...recentSubmissions.map((s) => ({
          id: s.id,
          type: "submission",
          name: s.name,
          title: "Contact Submission",
          createdAt: s.createdAt,
        })),
        ...recentApplications.map((a) => ({
          id: a.id,
          type: "application",
          name: a.fullName,
          title: `Application for ${a.job.title}`,
          createdAt: a.submittedAt,
        })),
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
