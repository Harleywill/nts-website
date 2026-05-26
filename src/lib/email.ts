import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAILS = [
  "info@ntsltd.com",
  "hjakewilliams@gmail.com",
];

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
        from: "careers@ntsltd.com",
        to: ADMIN_EMAILS,
        subject: `New Job Application - ${jobTitle}`,
        html: `
          <h2>New Application Received</h2>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          <p><strong>Applicant:</strong> ${applicantName}</p>
          <p><strong>Reference:</strong> ${applicationReference}</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/careers/applications" style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              View Application
            </a>
          </p>
        `,
      }),
      // Send confirmation to applicant
      resend.emails.send({
        from: "careers@ntsltd.com",
        to: applicantEmail,
        subject: "Application Received - NTS Ltd",
        html: `
          <h2>Thank You for Applying</h2>
          <p>Dear ${applicantName},</p>
          <p>We have received your application for the <strong>${jobTitle}</strong> position.</p>
          <p>Your application reference is: <strong>${applicationReference}</strong></p>
          <p>We will review your application and contact you soon if we would like to proceed.</p>
          <p>Best regards,<br>NTS Ltd</p>
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
