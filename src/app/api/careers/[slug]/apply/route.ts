import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendApplicationNotification } from "@/lib/email";

function generateApplicationReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "NTS-APP-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const { fullName, email, phone, postcode, cvUrl, cvFilename, coverLetter } =
      body;

    // Validate required fields
    if (!fullName || !email || !phone || !postcode || !cvUrl || !cvFilename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Find the job
    const job = await prisma.job.findUnique({
      where: { slug },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if applications are still open
    if (new Date(job.closesAt) <= new Date()) {
      return NextResponse.json(
        { error: "Applications for this position are now closed" },
        { status: 400 }
      );
    }

    // Generate reference
    const reference = generateApplicationReference();

    // Create application
    const application = await prisma.application.create({
      data: {
        reference,
        jobId: job.id,
        fullName,
        email,
        phone,
        postcode,
        cvUrl,
        cvFilename,
        coverLetter: coverLetter || null,
        status: "NEW",
      },
    });

    // Send emails (fire and forget - don't block response if email fails)
    sendApplicationNotification(fullName, email, job.title, reference).catch(
      (err) => console.error("Failed to send notification emails:", err)
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
