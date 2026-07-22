import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

// A response body can only be streamed once, so build a fresh response per request.
function fakeSuccess() {
  return NextResponse.json(
    {
      success: true,
      message: "Your enquiry has been sent successfully. We'll get back to you soon!",
    },
    { status: 200 }
  );
}

// Bot-generated field values tend to be random alphanumeric strings with
// case switching scattered throughout (e.g. "IOWOvYqIMTZKOGHyD"), unlike
// real names/words which are capitalised only at the start.
function looksLikeRandomString(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.some((word) => {
    if (word.length < 6) return false;
    const rest = word.slice(1);
    const upperCount = (rest.match(/[A-Z]/g) || []).length;
    return upperCount / rest.length > 0.3;
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 contact submissions per day per IP
    const ip = getRateLimitKey(request);
    const isAllowed = checkRateLimit(ip, {
      limit: 3,
      window: 24 * 60 * 60 * 1000, // 24 hours
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many contact requests. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, service, contact, message, website } = body;

    // Honeypot: real users never see or fill this field. Bots that fill
    // every input blindly will trip it. Pretend success so they move on.
    if (typeof website === "string" && website.trim().length > 0) {
      return fakeSuccess();
    }

    // Validation
    if (!name || !service || !contact || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Bots that skip the honeypot still tend to fill fields with random
    // generated strings rather than real text.
    if (looksLikeRandomString(name) || looksLikeRandomString(service)) {
      return fakeSuccess();
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

    // Get admin emails from environment or use defaults
    const adminEmails = (process.env.CONTACT_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0) || ["info@ntsltd.co.uk"];

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
