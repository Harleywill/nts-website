import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email addresses for contact form notifications
// Configure via CONTACT_ADMIN_EMAILS environment variable (comma-separated)
// Default addresses are used if env var is not set
const contactEmailsEnv = (process.env.CONTACT_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter((email) => email.length > 0);

const CONTACT_ADMIN_EMAILS = contactEmailsEnv.length > 0 ? contactEmailsEnv : [
  "info@nt.services",  // Main contact email
];

// Admin email addresses for job applications
// Configure via CAREERS_ADMIN_EMAILS environment variable (comma-separated)
const careersEmailsEnv = (process.env.CAREERS_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter((email) => email.length > 0);

const CAREERS_ADMIN_EMAILS = careersEmailsEnv.length > 0 ? careersEmailsEnv : [
  "info@nt.services",  // Same as contact email
];

console.log("Email Configuration:");
console.log("- Contact Form Admin Emails:", CONTACT_ADMIN_EMAILS);
console.log("- Careers Admin Emails:", CAREERS_ADMIN_EMAILS);

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
          <a href="mailto:info@nt.services" style="color: #4caf50; text-decoration: none;">info@nt.services</a>
        </p>
        <p style="color: #888888; margin: 10px 0 0 0; font-size: 11px; font-family: Arial, sans-serif;">
          © 2026 NTS Ltd. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
`;

export async function sendApplicationNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationReference: string
) {
  try {
    // Send notification to admin emails
    await Promise.all([
      resend.emails.send({
        from: "noreply@nevilletuckerservices.co.uk",
        to: CAREERS_ADMIN_EMAILS,
        subject: `New Job Application - ${jobTitle}`,
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
                        <h2 style="color: #1a2f6e; margin: 0 0 25px 0; font-size: 24px;">New Job Application</h2>
                        <p style="color: #333333; margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">A new application has been submitted for review.</p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-left: 4px solid #4caf50; margin: 25px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">Job Position:</strong><br>${jobTitle}</p>
                              <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">Applicant Name:</strong><br>${applicantName}</p>
                              <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">Reference Number:</strong><br><code style="background-color: #e8f5e9; padding: 5px 10px; border-radius: 3px; color: #2e7d32; font-weight: bold;">${applicationReference}</code></p>
                              <p style="margin: 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">Applicant Email:</strong><br>${applicantEmail}</p>
                            </td>
                          </tr>
                        </table>

                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/careers/applications" style="display: inline-block; background-color: #4caf50; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px;">View Application in Admin Panel</a>
                        </div>

                        <p style="color: #888888; font-size: 13px; margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                          Please log in to your admin panel to review the full application details and CV.
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
      }),
      // Send confirmation to applicant
      resend.emails.send({
        from: "noreply@nevilletuckerservices.co.uk",
        to: applicantEmail,
        subject: "Application Received - NTS Ltd",
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
                        <h2 style="color: #1a2f6e; margin: 0 0 10px 0; font-size: 24px;">Thank You for Applying</h2>
                        <p style="color: #4caf50; margin: 0 0 25px 0; font-size: 16px; font-weight: bold;">We've received your application</p>

                        <p style="color: #333333; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">Dear ${applicantName},</p>

                        <p style="color: #333333; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">
                          Thank you for your interest in the <strong>${jobTitle}</strong> position at NTS Ltd. We're excited to learn more about you!
                        </p>

                        <p style="color: #333333; margin: 0 0 25px 0; font-size: 15px; line-height: 1.6;">
                          We have successfully received your application. Below is your reference number for future correspondence:
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a2f6e 0%, #2d4a8f 100%); border-radius: 6px; margin: 25px 0;">
                          <tr>
                            <td style="padding: 30px; text-align: center;">
                              <p style="color: #e0e0e0; margin: 0 0 10px 0; font-size: 13px;">APPLICATION REFERENCE</p>
                              <p style="color: #4caf50; margin: 0; font-size: 28px; font-weight: bold; font-family: 'Courier New', monospace;">${applicationReference}</p>
                            </td>
                          </tr>
                        </table>

                        <h3 style="color: #1a2f6e; margin: 30px 0 15px 0; font-size: 16px;">What Happens Next?</h3>
                        <ol style="color: #333333; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                          <li style="margin-bottom: 10px;">Our recruitment team will review your application carefully</li>
                          <li style="margin-bottom: 10px;">We aim to respond within 5-7 business days</li>
                          <li style="margin-bottom: 10px;">If your profile matches our requirements, we'll be in touch to arrange an interview</li>
                        </ol>

                        <p style="color: #333333; margin: 25px 0 0 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #4caf50; border-radius: 3px; font-size: 14px; line-height: 1.6;">
                          If you have any questions in the meantime, please don't hesitate to reach out to us at <a href="mailto:info@nt.services" style="color: #4caf50; text-decoration: none; font-weight: bold;">info@nt.services</a> or call <a href="tel:01482838080" style="color: #4caf50; text-decoration: none; font-weight: bold;">01482 838080</a>.
                        </p>

                        <p style="color: #333333; margin: 25px 0 0 0; font-size: 15px; line-height: 1.6;">
                          Best regards,<br>
                          <strong>The NTS Ltd Team</strong>
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
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error sending application emails:", error);
    // Don't throw - application was created successfully, just email failed
    return { success: false, error };
  }
}

export async function sendApplicationConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  applicationReference: string,
  applicationId: string
) {
  try {
    const cvDownloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications/${applicationId}/cv`;

    await resend.emails.send({
      from: "noreply@nevilletuckerservices.co.uk",
      to: applicantEmail,
      subject: `Application Received - ${jobTitle}`,
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
                      <h2 style="color: #1a2f6e; margin: 0 0 25px 0; font-size: 24px;">Application Received</h2>
                      <p style="color: #333333; margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">Hi ${applicantName},</p>

                      <p style="color: #333333; margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">Thank you for applying for the <strong>${jobTitle}</strong> position at NTS Ltd. We've received your application and will review it carefully.</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-left: 4px solid #4caf50; margin: 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">Your Reference Number:</strong><br><code style="background-color: #e8f5e9; padding: 5px 10px; border-radius: 3px; color: #2e7d32; font-weight: bold;">${applicationReference}</code></p>
                            <p style="margin: 0; color: #666666; font-size: 13px;"><strong style="color: #1a2f6e;">What happens next?</strong><br>Our recruitment team will review your application and get back to you within 5-7 business days with an update.</p>
                          </td>
                        </tr>
                      </table>

                      <p style="color: #333333; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">If you need to make any changes to your application, please contact us at careers@nevilletuckerservices.co.uk with your reference number.</p>

                      <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <p style="color: #1e40af; margin: 0; font-size: 13px;"><strong>Need your CV?</strong> You can download your submitted CV here: <a href="${cvDownloadUrl}" style="color: #3b82f6; text-decoration: underline;">Download CV</a></p>
                      </div>

                      <p style="color: #666666; margin: 20px 0 0 0; font-size: 13px; line-height: 1.6;">Best regards,<br><strong>The NTS Ltd Team</strong></p>
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
  } catch (error) {
    console.error("Failed to send application confirmation email:", error);
    // Don't throw - email failure shouldn't break the application submission
  }
}

export async function sendContactNotification(
  name: string,
  contact: string,
  service: string,
  message: string
) {
  try {
    await Promise.all([
      // Send notification to admin emails
      resend.emails.send({
        from: "noreply@nevilletuckerservices.co.uk",
        to: CONTACT_ADMIN_EMAILS,
        subject: `New Contact Form Submission - ${name}`,
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
                        <h2 style="color: #1a2f6e; margin: 0 0 25px 0; font-size: 24px;">New Contact Form Submission</h2>

                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-left: 4px solid #4caf50; margin: 0 0 25px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px;"><strong style="color: #1a2f6e;">Name:</strong> ${name}</p>
                              <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px;"><strong style="color: #1a2f6e;">Service Enquiry:</strong> ${service}</p>
                              <p style="margin: 0; color: #666666; font-size: 14px;"><strong style="color: #1a2f6e;">Contact:</strong> ${contact}</p>
                            </td>
                          </tr>
                        </table>

                        <h3 style="color: #1a2f6e; margin: 25px 0 15px 0; font-size: 16px;">Message:</h3>
                        <div style="background-color: #f0f7ff; border: 1px solid #d0e8ff; border-left: 4px solid #2196F3; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
                          <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                        </div>

                        <div style="background-color: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 4px; padding: 15px 20px; margin: 25px 0;">
                          <p style="color: #2e7d32; margin: 0; font-size: 13px; font-weight: bold;">💡 Tip: Log into your admin panel to reply to this enquiry</p>
                        </div>
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
      }),
      // Send confirmation to user if email provided
      contact.includes("@")
        ? resend.emails.send({
            from: "noreply@nevilletuckerservices.co.uk",
            to: contact,
            subject: "Thank you for your enquiry - NTS Ltd",
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
                            <h2 style="color: #1a2f6e; margin: 0 0 10px 0; font-size: 24px;">Thank You for Contacting Us</h2>
                            <p style="color: #4caf50; margin: 0 0 25px 0; font-size: 16px; font-weight: bold;">We've received your enquiry</p>

                            <p style="color: #333333; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">Hi ${name},</p>

                            <p style="color: #333333; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">
                              Thank you for getting in touch with NTS Ltd. We've received your enquiry about our <strong>${service}</strong> service and appreciate your interest.
                            </p>

                            <p style="color: #333333; margin: 0 0 25px 0; font-size: 15px; line-height: 1.6;">
                              Our team will review your message carefully and get back to you as soon as possible with the information you need.
                            </p>

                            <div style="background-color: #f9f9f9; border-left: 4px solid #4caf50; padding: 20px; margin: 25px 0; border-radius: 3px;">
                              <h3 style="color: #1a2f6e; margin: 0 0 10px 0; font-size: 14px;">Need to Reach Us Sooner?</h3>
                              <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.6;">
                                If you need immediate assistance, please feel free to call us at <a href="tel:01482838080" style="color: #4caf50; text-decoration: none; font-weight: bold;">01482 838080</a>
                              </p>
                            </div>

                            <h3 style="color: #1a2f6e; margin: 25px 0 15px 0; font-size: 14px;">Our Services Include:</h3>
                            <ul style="color: #333333; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                              <li>Plumbing & Heating</li>
                              <li>Ventilation Solutions</li>
                              <li>Domestic & Commercial Servicing</li>
                              <li>Air Conditioning Installation & Maintenance</li>
                              <li>System Commissioning</li>
                            </ul>

                            <p style="color: #333333; margin: 25px 0 0 0; font-size: 15px; line-height: 1.6;">
                              Best regards,<br>
                              <strong>The NTS Ltd Team</strong><br>
                              <span style="color: #888888; font-size: 13px;">Hull, UK | Gas Safe Registered</span>
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
          })
        : Promise.resolve(),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error sending contact notification emails:", error);
    throw error;
  }
}
