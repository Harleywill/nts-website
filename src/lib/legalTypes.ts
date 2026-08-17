// Shared shape for legal-document content (Terms of Service, Privacy Policy,
// and any future legal page) - used by the web pages and by the PDF
// generator (scripts/generate_terms_pdf.py / generate_privacy_pdf.py) so
// both stay in sync from the same JSON source.

export interface LegalListItem {
  text: string;
  sublist?: string[];
}

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: (string | LegalListItem)[];
}
