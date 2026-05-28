import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ActivityEntry {
  timestamp: Date;
  action: string;
  resource: string;
  type: string;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch recent activity from all tables
    const [users, projects, newsItems, testimonials, contactSubmissions, applications] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
      }),
      prisma.newsItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.application.findMany({
        orderBy: { submittedAt: "desc" },
        take: 50,
      }),
    ]);

    // Build activity list
    const activity: ActivityEntry[] = [];

    // Add user activities
    users.forEach((user) => {
      activity.push({
        timestamp: user.createdAt,
        action: "Created",
        resource: "User Account",
        type: "user",
      });
    });

    // Add project activities
    projects.forEach((project) => {
      activity.push({
        timestamp: project.updatedAt,
        action: "Updated",
        resource: `Project: ${project.title}`,
        type: "project",
      });
    });

    // Add news activities
    newsItems.forEach((item) => {
      activity.push({
        timestamp: item.createdAt,
        action: "Published",
        resource: `News: ${item.title}`,
        type: "news",
      });
    });

    // Add testimonial activities
    testimonials.forEach((testimonial) => {
      activity.push({
        timestamp: testimonial.createdAt,
        action: "Added",
        resource: "Testimonial",
        type: "testimonial",
      });
    });

    // Add contact submission activities
    contactSubmissions.forEach((submission) => {
      activity.push({
        timestamp: submission.createdAt,
        action: "Received",
        resource: "Contact Submission",
        type: "contact",
      });
    });

    // Add application activities
    applications.forEach((application) => {
      activity.push({
        timestamp: application.submittedAt,
        action: "Applied",
        resource: "Job Application",
        type: "application",
      });
    });

    // Sort by timestamp descending and take last 10
    const sorted = activity
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    // Format for response
    const formatted = sorted.map((entry) => ({
      timestamp: entry.timestamp.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      action: entry.action,
      resource: entry.resource,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
