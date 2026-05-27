import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Model for storing email sending logs
// This helps track which emails were sent, when, and their status

export async function GET(request: NextRequest) {
  try {
    // Get all contact submissions with email tracking data
    const submissions = await prisma.contactSubmission.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        service: true,
        emailSentToAdmin: true,
        emailSentToUser: true,
        adminEmails: true,
        userEmail: true,
        emailError: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data for email log view
    const emailLog = submissions.flatMap((submission) => {
      const logs = [];

      // Admin notification email
      logs.push({
        id: `${submission.id}-admin`,
        type: "admin-notification",
        subject: `Contact Form: ${submission.name}`,
        from: "contact@ntsltd.com",
        to: submission.adminEmails
          ? JSON.parse(submission.adminEmails).join(", ")
          : "info@ntsltd.co.uk",
        status: submission.emailSentToAdmin ? "delivered" : "failed",
        error: submission.emailError,
        timestamp: submission.createdAt,
        submissionId: submission.id,
        sender: submission.name,
      });

      // User confirmation email (if applicable)
      if (submission.email) {
        logs.push({
          id: `${submission.id}-user`,
          type: "user-confirmation",
          subject: "Thank you for your enquiry - NTS Ltd",
          from: "contact@ntsltd.com",
          to: submission.email,
          status: submission.emailSentToUser ? "delivered" : "failed",
          error: submission.emailSentToUser ? null : "Not sent",
          timestamp: submission.createdAt,
          submissionId: submission.id,
          sender: "NTS Ltd",
        });
      }

      return logs;
    });

    return NextResponse.json(emailLog);
  } catch (error) {
    console.error("Error fetching email log:", error);
    return NextResponse.json(
      { error: "Failed to fetch email log" },
      { status: 500 }
    );
  }
}
