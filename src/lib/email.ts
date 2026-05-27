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
        from: "noreply@nevilletuckerservices.co.uk",
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
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </p>
        `,
      }),
      // Send confirmation to user if email provided
      contact.includes("@")
        ? resend.emails.send({
            from: "noreply@nevilletuckerservices.co.uk",
            to: contact,
            subject: "Thank you for your enquiry - NTS Ltd",
            html: `
              <h2>Thank You for Your Enquiry</h2>
              <p>Hi ${name},</p>
              <p>We've received your enquiry about our ${service} service. Thank you for getting in touch!</p>
              <p>Our team will review your message and get back to you as soon as possible. If you have any urgent requests, please feel free to call us at <strong>01482 838080</strong>.</p>
              <p>Best regards,<br>NTS Ltd Team<br>Hull, UK</p>
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
