import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY || "",
  },
});

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

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2f6e;">New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Contact:</strong> ${contact}</p>

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

    // Check if contact is an email
    const isEmail = emailRegex.test(contact);

    // Send email to admin(s) - using verified email for Resend test domain
    await transporter.sendMail({
      from: "onboarding@resend.dev",
      to: "hjakewilliams@gmail.com",
      replyTo: contact,
      subject: `New Contact Form Submission - ${name}`,
      html: `${adminHtml}<p style="color: #999; font-size: 11px; margin-top: 20px;">From: ${contact}</p>`,
    });

    // Send confirmation email to customer if email was provided
    if (isEmail) {
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a2f6e;">Thank You for Your Enquiry</h2>

          <p>Hi ${name},</p>

          <p>We've received your enquiry about our ${service} service. Thank you for getting in touch!</p>

          <p>Our team will review your message and get back to you as soon as possible. If you have any urgent requests, please feel free to call us at <strong>01482 838080</strong>.</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h3 style="color: #1a2f6e; margin-top: 0;">Quick Links:</h3>
            <ul style="color: #333;">
              <li><a href="https://nevilletuckerservices.co.uk" style="color: #4caf50; text-decoration: none;">Visit Our Website</a></li>
              <li><a href="https://nevilletuckerservices.co.uk/services" style="color: #4caf50; text-decoration: none;">View Our Services</a></li>
              <li><a href="https://nevilletuckerservices.co.uk/contact" style="color: #4caf50; text-decoration: none;">Contact Us</a></li>
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
        from: "onboarding@resend.dev",
        to: contact,
        subject: "Thank you for your enquiry - NTS Ltd",
        html: customerHtml,
      });
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
