// Client-side conversion tracking for ad platforms.
//
// Fires the same lead event into every installed tracker:
//  - GA4 ("generate_lead" — Google Ads imports this as a conversion)
//  - GTM dataLayer (for any tags managed in GTM)
//  - Meta Pixel ("Lead" — used by Facebook Ads for optimisation/retargeting)
//
// Trackers that aren't loaded on the page are silently skipped, so this is
// safe to call before ad accounts exist.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export type LeadSource =
  | "contact_form"
  | "contact_page_form"
  | "quick_enquiry"
  | "newsletter"
  | "lead_magnet";

export function trackLead(source: LeadSource, service?: string) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", "generate_lead", {
      lead_source: source,
      service: service || "unspecified",
    });

    window.dataLayer?.push({
      event: "lead",
      lead_source: source,
      service: service || "unspecified",
    });

    window.fbq?.("track", "Lead", {
      content_name: source,
      content_category: service || "unspecified",
    });
  } catch {
    // Tracking must never break the user-facing flow.
  }
}
