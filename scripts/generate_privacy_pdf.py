#!/usr/bin/env python3
"""Generate the branded Privacy Policy PDF from src/data/privacy.json.

Single source of truth: src/data/privacy.json (shared with the /privacy web
page). Regenerate after editing the policy:

    pip install fpdf2 pillow
    python3 scripts/generate_privacy_pdf.py

Output: public/documents/nts-privacy-policy.pdf
"""

import os
from legal_pdf_lib import ROOT, build_legal_pdf

DATA = os.path.join(ROOT, "src", "data", "privacy.json")
OUT = os.path.join(ROOT, "public", "documents", "nts-privacy-policy.pdf")

if __name__ == "__main__":
    build_legal_pdf(DATA, "Privacy Policy", OUT)
