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

// ---------------------------------------------------------------------------
// Shared branding + layout
// ---------------------------------------------------------------------------

const SITE_URL = "https://nevilletuckerservices.co.uk";
const LOGO_URL = `${SITE_URL}/images/ntsLogo-old.png`;
const NAVY = "#1a2f6e";
const GREEN = "#4caf50";
const FROM_ADDRESS = "NTS Ltd <noreply@nevilletuckerservices.co.uk>";

/**
 * Wraps email body content in the shared NTS branded shell:
 * green top bar, white header with logo, content area, navy footer.
 */
function renderEmail(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f2f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5;">
        <tr>
          <td align="center" style="padding: 24px 12px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

              <!-- Brand accent bar -->
              <tr>
                <td style="height: 6px; background-color: ${GREEN}; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>

              <!-- Logo header -->
              <tr>
                <td align="center" style="padding: 28px 30px 24px 30px; background-color: #ffffff; border-bottom: 1px solid #e8eaed;">
                  <a href="${SITE_URL}" style="text-decoration: none;">
                    <img src="${LOGO_URL}" alt="NTS Ltd - Mechanical Services" width="180" style="display: block; width: 180px; max-width: 100%; height: auto; border: 0;">
                  </a>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 36px 30px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: ${NAVY}; padding: 28px 30px; text-align: center;">
                  <p style="color: #ffffff; margin: 0 0 6px 0; font-size: 15px; font-weight: bold; font-family: Arial, sans-serif;">NTS Ltd</p>
                  <p style="color: #b8c0d8; margin: 0 0 14px 0; font-size: 12px; font-family: Arial, sans-serif;">Mechanical &amp; Electrical Services | Hull, UK | Gas Safe Registered</p>
                  <p style="margin: 0 0 14px 0; font-size: 13px; font-family: Arial, sans-serif;">
                    <a href="tel:01482838080" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">01482 838080</a>
                    <span style="color: #5a6788;">&nbsp;|&nbsp;</span>
                    <a href="mailto:info@nt.services" style="color: ${GREEN}; text-decoration: none;">info@nt.services</a>
                    <span style="color: #5a6788;">&nbsp;|&nbsp;</span>
                    <a href="${SITE_URL}" style="color: ${GREEN}; text-decoration: none;">nevilletuckerservices.co.uk</a>
                  </p>
                  <p style="color: #7a86a8; margin: 0; font-size: 11px; font-family: Arial, sans-serif;">
                    &copy; ${new Date().getFullYear()} NTS Ltd. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/** Section heading used at the top of each email. */
function heading(title: string, subtitle?: string): string {
  return `
    <h2 style="color: ${NAVY}; margin: 0 0 ${subtitle ? "8px" : "24px"} 0; font-size: 23px; font-family: Arial, sans-serif;">${title}</h2>
    ${subtitle ? `<p style="color: ${GREEN}; margin: 0 0 24px 0; font-size: 15px; font-weight: bold; font-family: Arial, sans-serif;">${subtitle}</p>` : ""}
  `;
}

/** Green-accented details box for key/value information. */
function detailsBox(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (row, i) => `
        <p style="margin: 0 ${i < rows.length - 1 ? "0 14px" : ""} 0; color: #555555; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.5;">
          <strong style="color: ${NAVY};">${row.label}:</strong><br>${row.value}
        </p>`
    )
    .join("");
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9f7; border: 1px solid #e3ece3; border-left: 4px solid ${GREEN}; border-radius: 4px; margin: 22px 0;">
      <tr><td style="padding: 20px;">${rowsHtml}</td></tr>
    </table>
  `;
}

/** Navy reference-number banner for application confirmations. */
function referenceBanner(reference: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${NAVY}; border-radius: 6px; margin: 24px 0;">
      <tr>
        <td style="padding: 26px; text-align: center;">
          <p style="color: #b8c0d8; margin: 0 0 8px 0; font-size: 12px; letter-spacing: 1px; font-family: Arial, sans-serif;">APPLICATION REFERENCE</p>
          <p style="color: ${GREEN}; margin: 0; font-size: 26px; font-weight: bold; font-family: 'Courier New', monospace;">${reference}</p>
        </td>
      </tr>
    </table>
  `;
}

/** Green call-to-action button. */
function ctaButton(href: string, label: string): string {
  return `
    <div style="text-align: center; margin: 28px 0;">
      <a href="${href}" style="display: inline-block; background-color: ${GREEN}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 15px; font-family: Arial, sans-serif;">${label}</a>
    </div>
  `;
}

/** Standard paragraph. */
function para(text: string): string {
  return `<p style="color: #333333; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; font-family: Arial, sans-serif;">${text}</p>`;
}

/** Muted small print, separated by a top border. */
function smallPrint(text: string): string {
  return `<p style="color: #888888; font-size: 13px; margin: 26px 0 0 0; padding-top: 18px; border-top: 1px solid #e8eaed; font-family: Arial, sans-serif; line-height: 1.6;">${text}</p>`;
}

const signOff = para(`Best regards,<br><strong>The NTS Ltd Team</strong>`);

// ---------------------------------------------------------------------------
// Emails
// ---------------------------------------------------------------------------

export async function sendApplicationNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationReference: string
) {
  try {
    await Promise.all([
      // Send notification to admin emails
      resend.emails.send({
        from: FROM_ADDRESS,
        to: CAREERS_ADMIN_EMAILS,
        subject: `New Job Application - ${jobTitle}`,
        html: renderEmail(`
          ${heading("New Job Application")}
          ${para("A new application has been submitted for review.")}
          ${detailsBox([
            { label: "Job Position", value: jobTitle },
            { label: "Applicant Name", value: applicantName },
            { label: "Applicant Email", value: applicantEmail },
            { label: "Reference Number", value: `<code style="background-color: #e8f5e9; padding: 4px 10px; border-radius: 3px; color: #2e7d32; font-weight: bold;">${applicationReference}</code>` },
          ])}
          ${ctaButton(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/careers/applications`, "View Application in Admin Panel")}
          ${smallPrint("Please log in to your admin panel to review the full application details and CV.")}
        `),
      }),
      // Send confirmation to applicant
      resend.emails.send({
        from: FROM_ADDRESS,
        to: applicantEmail,
        subject: "Application Received - NTS Ltd",
        html: renderEmail(`
          ${heading("Thank You for Applying", "We've received your application")}
          ${para(`Dear ${applicantName},`)}
          ${para(`Thank you for your interest in the <strong>${jobTitle}</strong> position at NTS Ltd. We're excited to learn more about you!`)}
          ${para("We have successfully received your application. Below is your reference number for future correspondence:")}
          ${referenceBanner(applicationReference)}
          <h3 style="color: ${NAVY}; margin: 28px 0 14px 0; font-size: 16px; font-family: Arial, sans-serif;">What Happens Next?</h3>
          <ol style="color: #333333; margin: 0 0 20px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; font-family: Arial, sans-serif;">
            <li style="margin-bottom: 8px;">Our recruitment team will review your application carefully</li>
            <li style="margin-bottom: 8px;">We aim to respond within 5-7 business days</li>
            <li style="margin-bottom: 8px;">If your profile matches our requirements, we'll be in touch to arrange an interview</li>
          </ol>
          ${para(`If you have any questions in the meantime, please don't hesitate to reach out to us at <a href="mailto:info@nt.services" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">info@nt.services</a> or call <a href="tel:01482838080" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">01482 838080</a>.`)}
          ${signOff}
        `),
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
      from: FROM_ADDRESS,
      to: applicantEmail,
      subject: `Application Received - ${jobTitle}`,
      html: renderEmail(`
        ${heading("Application Received")}
        ${para(`Hi ${applicantName},`)}
        ${para(`Thank you for applying for the <strong>${jobTitle}</strong> position at NTS Ltd. We've received your application and will review it carefully.`)}
        ${referenceBanner(applicationReference)}
        ${detailsBox([
          { label: "What happens next?", value: "Our recruitment team will review your application and get back to you within 5-7 business days with an update." },
        ])}
        ${para(`If you need to make any changes to your application, please contact us at <a href="mailto:info@nt.services" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">info@nt.services</a> with your reference number.`)}
        ${para(`<strong>Need your CV?</strong> You can download your submitted CV here: <a href="${cvDownloadUrl}" style="color: ${GREEN}; text-decoration: underline;">Download CV</a>`)}
        ${signOff}
      `),
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
        from: FROM_ADDRESS,
        to: CONTACT_ADMIN_EMAILS,
        subject: `New Contact Form Submission - ${name}`,
        html: renderEmail(`
          ${heading("New Contact Form Submission")}
          ${detailsBox([
            { label: "Name", value: name },
            { label: "Service Enquiry", value: service },
            { label: "Contact", value: contact },
          ])}
          <h3 style="color: ${NAVY}; margin: 24px 0 12px 0; font-size: 16px; font-family: Arial, sans-serif;">Message:</h3>
          <div style="background-color: #f0f7ff; border: 1px solid #d0e8ff; border-left: 4px solid #2196F3; padding: 18px; border-radius: 4px; margin-bottom: 22px;">
            <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.8; white-space: pre-wrap; font-family: Arial, sans-serif;">${message}</p>
          </div>
          ${smallPrint("💡 Tip: Log into your admin panel to reply to this enquiry")}
        `),
      }),
      // Send confirmation to user if email provided
      contact.includes("@")
        ? resend.emails.send({
            from: FROM_ADDRESS,
            to: contact,
            subject: "Thank you for your enquiry - NTS Ltd",
            html: renderEmail(`
              ${heading("Thank You for Contacting Us", "We've received your enquiry")}
              ${para(`Hi ${name},`)}
              ${para(`Thank you for getting in touch with NTS Ltd. We've received your enquiry about our <strong>${service}</strong> service and appreciate your interest.`)}
              ${para("Our team will review your message carefully and get back to you as soon as possible with the information you need.")}
              ${detailsBox([
                { label: "Need to Reach Us Sooner?", value: `If you need immediate assistance, please feel free to call us at <a href="tel:01482838080" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">01482 838080</a>` },
              ])}
              <h3 style="color: ${NAVY}; margin: 24px 0 12px 0; font-size: 15px; font-family: Arial, sans-serif;">Our Services Include:</h3>
              <ul style="color: #333333; margin: 0 0 20px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; font-family: Arial, sans-serif;">
                <li>Plumbing &amp; Heating</li>
                <li>Ventilation Solutions</li>
                <li>Domestic &amp; Commercial Servicing</li>
                <li>Air Conditioning Installation &amp; Maintenance</li>
                <li>System Commissioning</li>
              </ul>
              ${signOff}
            `),
          })
        : Promise.resolve(),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error sending contact notification emails:", error);
    throw error;
  }
}

export async function sendGeneralApplicationNotification(
  applicantName: string,
  applicantEmail: string,
  applicationReference: string
) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CAREERS_ADMIN_EMAILS,
      subject: `New General Application Submission`,
      html: renderEmail(`
        ${heading("New General Application")}
        ${para("A new general application (talent pool submission) has been received.")}
        ${detailsBox([
          { label: "Applicant Name", value: applicantName },
          { label: "Email", value: applicantEmail },
          { label: "Reference Number", value: `<code style="background-color: #e8f5e9; padding: 4px 10px; border-radius: 3px; color: #2e7d32; font-weight: bold;">${applicationReference}</code>` },
        ])}
        ${ctaButton(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/careers/applications?filter=general`, "View Application in Admin Panel")}
        ${smallPrint("Please log in to your admin panel to review the full application details and CV.")}
      `),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending general application notification:", error);
    throw error;
  }
}

export async function sendGeneralApplicationConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  applicationReference: string,
  applicationId: string
) {
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: applicantEmail,
      subject: "Application Received - NTS Ltd",
      html: renderEmail(`
        ${heading("Thank You for Your Application", "We've received your CV and skills submission")}
        ${para(`Dear ${applicantName},`)}
        ${para("Thank you for your interest in joining NTS Ltd! We appreciate you submitting your CV and skills for our talent pool.")}
        ${para("We have successfully received your application. Below is your reference number for future correspondence:")}
        ${referenceBanner(applicationReference)}
        ${para("<strong>What happens next?</strong>")}
        <ul style="color: #333333; margin: 0 0 22px 0; font-size: 15px; line-height: 1.8; padding-left: 20px; font-family: Arial, sans-serif;">
          <li>We'll review your CV and qualifications</li>
          <li>If your skills match our upcoming opportunities, we'll get in touch within 5 business days</li>
          <li>Your application will remain on file for future positions that match your expertise</li>
        </ul>
        ${para("We're always looking for talented professionals in the HVAC and mechanical services industry. Thank you for considering NTS Ltd!")}
        ${signOff}
        ${smallPrint(`If you have any questions about your application, please reply to this email or contact us at <a href="tel:01482838080" style="color: ${GREEN}; text-decoration: none; font-weight: bold;">01482 838080</a>.`)}
      `),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending general application confirmation email:", error);
    throw error;
  }
}
