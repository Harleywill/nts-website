import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateApplicationReference } from "@/lib/careers";
import { sendApplicationNotification } from "@/lib/email";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const ip = getRateLimitKey(request);
    const isAllowed = checkRateLimit(`apply-job:${ip}`, {
      limit: 10,
      window: 24 * 60 * 60 * 1000,
    });
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many applications submitted. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const job = await prisma.job.findUnique({ where: { slug } });
    if (!job || job.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This position is no longer accepting applications" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, postcode, coverLetter, agreed, cvUrl, cvFilename } = body;

    if (!fullName || !email || !phone || !postcode || !cvUrl || !cvFilename) {
      return NextResponse.json(
        { error: "Please fill in all required fields and upload a CV" },
        { status: 400 }
      );
    }

    if (!agreed) {
      return NextResponse.json(
        { error: "You must agree to the privacy policy" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    let application;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        application = await prisma.application.create({
          data: {
            fullName,
            email,
            phone,
            postcode,
            cvFilename,
            cvUrl,
            coverLetter: coverLetter || null,
            reference: generateApplicationReference(),
            jobId: job.id,
          },
        });
        break;
      } catch (err: any) {
        if (err.code === "P2002" && err.meta?.target?.includes("reference")) continue;
        throw err;
      }
    }

    if (!application) {
      throw new Error("Failed to generate a unique application reference");
    }

    try {
      await sendApplicationNotification(fullName, email, job.title, application.reference);
    } catch (emailError) {
      console.error("Application email failed (application still saved):", emailError);
    }

    return NextResponse.json({ success: true, reference: application.reference });
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
