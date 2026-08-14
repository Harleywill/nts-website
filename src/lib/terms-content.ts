// Typed access to the Terms of Service content.
//
// The content itself lives in src/data/terms.json - the single source of
// truth shared by the /terms web page AND the attached PDF. When you edit
// the JSON, regenerate the PDF: `python3 scripts/generate_terms_pdf.py`.

import termsData from "@/data/terms.json";

export interface TermsSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export const TERMS_LAST_UPDATED: string = termsData.lastUpdated;
export const TERMS_INTRO: string = termsData.intro;
export const TERMS_SECTIONS: TermsSection[] = termsData.sections;
