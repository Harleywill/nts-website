import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY || "",
  },
});

// Simple in-memory rate limiting: 5 requests per 15 minutes per IP
const requestLog = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = requestLog.get(ip);

  if (!record || now > record.resetTime) {
    requestLog.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return { allowed: true };
  }

  if (record.count >= 5) {
    const remainingTime = Math.ceil((record.resetTime - now) / 60 / 1000);
    return {
      allowed: false,
      message: `Too many requests. Please try again in ${remainingTime} minutes.`,
    };
  }

  record.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        { status: 429 } // Too Many Requests
      );
    }

    const body = await request.json();
    const { name, email, phone, service, company, message } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Save to database
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          service: service || null,
          message: message || "",
        },
      });
    } catch (dbError) {
      console.error("Database error saving contact submission:", dbError);
      // Continue even if database save fails - still send email
    }

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2f6e;">New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}

        <h3 style="color: #1a2f6e; margin-top: 20px;">Message:</h3>
        <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message}
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email from your website contact form.
        </p>
      </div>
    `;

    // Send email to admin(s)
    await transporter.sendMail({
      from: "noreply@ntsltd.com",
      to: "info@ntsltd.com",
      replyTo: email,
      subject: `New Contact Form Submission - ${name}`,
      html: adminHtml,
    });

    // Send confirmation email to customer
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2f6e;">Thank You for Your Enquiry</h2>

        <p>Hi ${name},</p>

        <p>We've received your enquiry. Thank you for getting in touch!</p>

        <p>Our team will review your message and get back to you as soon as possible. If you have any urgent requests, please feel free to call us at <strong>01482 838080</strong>.</p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <h3 style="color: #1a2f6e; margin-top: 0;">Quick Links:</h3>
          <ul style="color: #333;">
            <li><a href="https://ntsltd.com" style="color: #4caf50; text-decoration: none;">Visit Our Website</a></li>
            <li><a href="https://ntsltd.com/services" style="color: #4caf50; text-decoration: none;">View Our Services</a></li>
            <li><a href="https://ntsltd.com/contact" style="color: #4caf50; text-decoration: none;">Contact Us</a></li>
          </ul>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Best regards,<br>
          <strong>NTS Ltd Team</strong><br>
          Hull, UK<br>
          Phone: 01482 838080
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: "noreply@ntsltd.com",
      to: email,
      subject: "Thank you for your enquiry - NTS Ltd",
      html: customerHtml,
    });

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
