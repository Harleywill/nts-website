import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sendGeneralApplicationNotification,
  sendGeneralApplicationConfirmationEmail
} from "@/lib/email";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

function generateApplicationReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "NTS-APP-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitKey(request);
    const isAllowed = checkRateLimit(ip, {
      limit: 1,
      window: 24 * 60 * 60 * 1000,
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Only one application per day is allowed." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      desiredRole,
      skills,
      experience,
      message,
      cvUrl,
      cvFilename,
    } = body;

    if (!fullName || !email || !phone || !cvUrl || !cvFilename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const reference = generateApplicationReference();

    const application = await prisma.generalApplication.create({
      data: {
        reference,
        fullName,
        email,
        phone,
        desiredRole: desiredRole || null,
        skills: skills || null,
        experience: experience || null,
        message: message || null,
        cvUrl,
        cvFilename,
        status: "NEW",
      },
    });

    await Promise.all([
      sendGeneralApplicationNotification(fullName, email, reference),
      sendGeneralApplicationConfirmationEmail(
        email,
        fullName,
        reference,
        application.id
      ),
    ]).catch((err) =>
      console.error("Failed to send emails:", err)
    );

    return NextResponse.json(
      {
        reference: application.reference,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
