// Typed access to the Privacy Policy content.
//
// The content itself lives in src/data/privacy.json - the single source of
// truth shared by the /privacy web page AND the attached PDF. When you edit
// the JSON, regenerate the PDF: `python3 scripts/generate_privacy_pdf.py`.

import privacyData from "@/data/privacy.json";
import type { LegalSection } from "./legalTypes";

export const PRIVACY_LAST_UPDATED: string = privacyData.lastUpdated;
export const PRIVACY_INTRO: string = privacyData.intro;
export const PRIVACY_SECTIONS: LegalSection[] = privacyData.sections;
