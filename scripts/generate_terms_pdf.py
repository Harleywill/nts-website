#!/usr/bin/env python3
"""Generate the branded Terms of Service PDF from src/data/terms.json.

Single source of truth: src/data/terms.json (shared with the /terms web page).
Regenerate after editing the terms:

    pip install fpdf2 pillow
    python3 scripts/generate_terms_pdf.py

Output: public/documents/nts-terms-of-service.pdf
"""

import os
from legal_pdf_lib import ROOT, build_legal_pdf

DATA = os.path.join(ROOT, "src", "data", "terms.json")
OUT = os.path.join(ROOT, "public", "documents", "nts-terms-of-service.pdf")

if __name__ == "__main__":
    build_legal_pdf(DATA, "Terms of Service", OUT)
