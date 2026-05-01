import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email to admin(s)
    const adminEmailResult = await resend.emails.send({
      from: "noreply@ntsltd.onresend.com",
      to: ["info@ntsltd.com", "hjakewilliams@gmail.com"],
      subject: `New Contact Form Submission - ${name}`,
      html: `
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
      `,
    });

    if (adminEmailResult.error) {
      console.error("Failed to send admin email:", adminEmailResult.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    const isEmail = emailRegex.test(contact);

    if (isEmail) {
      const confirmationEmailResult = await resend.emails.send({
        from: "noreply@ntsltd.com",
        to: contact,
        subject: "Thank you for your enquiry - NTS Ltd",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a2f6e;">Thank You for Your Enquiry</h2>

            <p>Hi ${name},</p>

            <p>We've received your enquiry about our ${service} service. Thank you for getting in touch!</p>

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
        `,
      });

      if (confirmationEmailResult.error) {
        console.error("Failed to send confirmation email:", confirmationEmailResult.error);
        // Don't fail the request if confirmation email fails, admin email was sent
      }
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
