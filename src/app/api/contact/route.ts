import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, service, contact, message } = body;

    // Validation
    if (!name || !service || !contact || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const isValidContact = emailRegex.test(contact) || phoneRegex.test(contact);

    if (!isValidContact) {
      return NextResponse.json(
        { error: "Please provide a valid email address or phone number" },
        { status: 400 }
      );
    }

    // Determine if contact is email or phone
    const isEmail = emailRegex.test(contact);
    const email = isEmail ? contact : undefined;
    const phone = !isEmail ? contact : undefined;

    // Send emails and track status
    let emailSentToAdmin = false;
    let emailSentToUser = false;
    let emailError: string | null = null;
    const adminEmails = ["info@nt.services", "info@ntsltd.com", "hjakewilliams@gmail.com"];

    try {
      await sendContactNotification(name, contact, service, message);
      emailSentToAdmin = true;
      emailSentToUser = isEmail; // Mark as sent if we sent confirmation email
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to send contact notification emails:", err);
    }

    // Save submission to database with email tracking
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email: email || "",
          phone: phone || null,
          service,
          message,
          emailSentToAdmin,
          emailSentToUser: emailSentToUser,
          adminEmails: JSON.stringify(adminEmails),
          userEmail: isEmail ? contact : null,
          emailError,
        },
      });
    } catch (dbError) {
      console.error("Database error saving contact submission:", dbError);
      // Don't fail the request if database save fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been sent successfully. We'll get back to you soon!"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
