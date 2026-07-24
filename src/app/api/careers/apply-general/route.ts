import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateApplicationReference } from "@/lib/careers";
import {
  sendGeneralApplicationNotification,
  sendGeneralApplicationConfirmationEmail,
} from "@/lib/email";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

// Every general (no specific vacancy) application is filed against this
// single placeholder Job record so it fits the existing Application ->
// Job relation without a schema change. Status CLOSED keeps it off the
// public /careers listing (which only shows status: "PUBLISHED").
const GENERAL_JOB_SLUG = "general-application";

async function getOrCreateGeneralJob() {
  const existing = await prisma.job.findUnique({ where: { slug: GENERAL_JOB_SLUG } });
  if (existing) return existing;

  return prisma.job.create({
    data: {
      slug: GENERAL_JOB_SLUG,
      title: "General Application (Talent Pool)",
      department: "General",
      location: "Hull, UK",
      employmentType: "FULL_TIME",
      salaryRange: "N/A",
      experience: "N/A",
      closesAt: new Date("2099-12-31"),
      status: "CLOSED",
      description: "Speculative applications submitted without a specific vacancy.",
      responsibilities: "N/A",
      requirements: "N/A",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitKey(request);
    const isAllowed = checkRateLimit(`apply-general:${ip}`, {
      limit: 10,
      window: 24 * 60 * 60 * 1000,
    });
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many applications submitted. Please try again tomorrow." },
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
        { error: "Full name, email, phone, and CV are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const generalJob = await getOrCreateGeneralJob();

    // Fold the extra fields this form collects (no dedicated columns for
    // them) into coverLetter, which the admin panel already renders.
    const coverLetterParts = [
      desiredRole && `Desired role: ${desiredRole}`,
      skills && `Skills: ${skills}`,
      experience && `Experience: ${experience}`,
      message && `\n${message}`,
    ].filter(Boolean);
    const coverLetter = coverLetterParts.length > 0 ? coverLetterParts.join("\n") : null;

    let application;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        application = await prisma.application.create({
          data: {
            fullName,
            email,
            phone,
            postcode: "",
            cvFilename,
            cvUrl,
            coverLetter,
            reference: generateApplicationReference(),
            jobId: generalJob.id,
          },
        });
        break;
      } catch (err: any) {
        // Reference collision (extremely unlikely) - retry with a fresh one.
        if (err.code === "P2002" && err.meta?.target?.includes("reference")) continue;
        throw err;
      }
    }

    if (!application) {
      throw new Error("Failed to generate a unique application reference");
    }

    try {
      await sendGeneralApplicationNotification(fullName, email, application.reference);
      await sendGeneralApplicationConfirmationEmail(email, fullName, application.reference, application.id);
    } catch (emailError) {
      console.error("General application email failed (application still saved):", emailError);
    }

    return NextResponse.json({ success: true, reference: application.reference });
  } catch (error) {
    console.error("General application error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
