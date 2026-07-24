import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRateLimitKey, checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailHeader = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a2f6e;">
    <tr>
      <td style="padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: Arial, sans-serif;">NTS Ltd</h1>
        <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px; font-family: Arial, sans-serif;">Mechanical & Electrical Services</p>
      </td>
    </tr>
  </table>
`;

const emailFooter = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0d1530; margin-top: 30px;">
    <tr>
      <td style="padding: 25px 20px; text-align: center;">
        <p style="color: #b0b0b0; margin: 0 0 10px 0; font-size: 13px; font-family: Arial, sans-serif;">
          NTS Ltd | Hull, UK<br>
          <a href="tel:01482838080" style="color: #4caf50; text-decoration: none; font-weight: bold;">01482 838080</a> |
          <a href="mailto:info@nt.services" style="color: #4caf50; text-decoration: none;">info@nt.services</a></p>
        <p style="color: #888888; margin: 10px 0 0 0; font-size: 11px; font-family: Arial, sans-serif;">
          © 2026 NTS Ltd. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
`;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 signups per hour per IP
    const ip = getRateLimitKey(request);
    const isAllowed = checkRateLimit(`newsletter:${ip}`, {
      limit: 10,
      window: 60 * 60 * 1000, // 1 hour
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many signup requests. Please try again later." },
        { status: 429 } // 429 = Too Many Requests
      );
    }

    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send welcome email via Resend
    await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS ?? "noreply@ntslimited.org",
      to: email,
      subject: "Welcome to NTS Ltd Newsletter",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  ${emailHeader}
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1a2f6e; margin: 0 0 10px 0; font-size: 24px;">Welcome!</h2>
                      <p style="color: #4caf50; margin: 0 0 25px 0; font-size: 16px; font-weight: bold;">You're subscribed to our newsletter</p>

                      <p style="color: #333333; margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                        Thank you for subscribing to NTS Ltd's newsletter. You'll now receive regular updates about:
                      </p>

                      <ul style="color: #333333; margin: 0 0 25px 0; padding-left: 20px; font-size: 15px; line-height: 1.8;">
                        <li style="margin-bottom: 10px;">Latest HVAC and mechanical services updates</li>
                        <li style="margin-bottom: 10px;">Energy efficiency tips and cost-saving guides</li>
                        <li style="margin-bottom: 10px;">Exclusive offers and seasonal promotions</li>
                        <li style="margin-bottom: 10px;">Industry news and expert advice</li>
                      </ul>

                      <p style="color: #333333; margin: 0 0 25px 0; font-size: 15px; line-height: 1.6;">
                        If you have any questions or need immediate assistance, don't hesitate to contact us:
                      </p>

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://ntslimited.org/contact" style="display: inline-block; background-color: #4caf50; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px;">Contact Us</a>
                      </div>

                      <p style="color: #888888; font-size: 13px; margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        You're receiving this email because you subscribed from: <strong>${source || "website"}</strong>
                      </p>
                    </td>
                  </tr>
                  ${emailFooter}
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully. Check your email for confirmation." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
