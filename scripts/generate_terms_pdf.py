#!/usr/bin/env python3
"""Generate the branded Terms of Service PDF from src/data/terms.json.

Single source of truth: src/data/terms.json (shared with the /terms web page).
Regenerate after editing the terms:

    pip install fpdf2 pillow
    python3 scripts/generate_terms_pdf.py

Output: public/documents/nts-terms-of-service.pdf
"""

import json
import os
from fpdf import FPDF
from PIL import Image

NAVY = (26, 47, 110)     # #1a2f6e
GREEN = (76, 175, 80)    # #4caf50
DARK = (51, 51, 51)      # body text
MUTED = (120, 120, 120)  # secondary text

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data", "terms.json")
OUT_DIR = os.path.join(ROOT, "public", "documents")
OUT = os.path.join(OUT_DIR, "nts-terms-of-service.pdf")

# Core PDF fonts are latin-1 only; map the few typographic characters we use.
REPLACEMENTS = {
    "—": "-",   # em dash
    "–": "-",   # en dash
    "‘": "'", "’": "'",  # curly single quotes
    "“": '"', "”": '"',  # curly double quotes
    " ": " ",  # non-breaking space
}


def clean(text: str) -> str:
    for a, b in REPLACEMENTS.items():
        text = text.replace(a, b)
    return text.encode("latin-1", "replace").decode("latin-1")


def logo_for_navy_background(path: str, wordmark_x_start: int = 240) -> Image.Image:
    """Recolour the logo's navy 'NTS' wordmark to white so it reads on a
    navy background. The multicoloured globe icon (left of x=240 in the
    source image) shares that same navy in its top stripe, so the swap is
    done geometrically (only right of wordmark_x_start) rather than by
    colour alone - the globe is untouched either way."""
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(wordmark_x_start, w):
            r, g, b, a = px[x, y]
            if a > 0 and b > r + 20 and b > g + 20 and r < 110:
                px[x, y] = (255, 255, 255, a)
    return img


class TermsPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_fill_color(*NAVY)
        self.rect(0, 0, self.w, 16, "F")
        self.set_xy(15, 5)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(255, 255, 255)
        self.cell(0, 6, "NTS Ltd - Terms of Service")
        self.ln(16)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(230, 230, 230)
        self.line(15, self.get_y(), self.w - 15, self.get_y())
        self.set_y(-12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 6, clean("NTS Ltd  |  01482 838080  |  info@nt.services  |  ntslimited.org"), align="L")
        self.set_y(-12)
        self.cell(0, 6, f"Page {self.page_no()}", align="R")


def main():
    with open(DATA, encoding="utf-8") as fh:
        data = json.load(fh)

    pdf = TermsPDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.set_margins(18, 18, 18)
    pdf.add_page()

    # Cover band - shorter than the original design (38mm vs 52mm), logo
    # sits inside it top-right with its wordmark recoloured white so it
    # reads against the navy fill (the source file's "NTS" text is navy
    # and would otherwise disappear).
    band_h = 38
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, pdf.w, band_h, "F")
    pdf.set_fill_color(*GREEN)
    pdf.rect(0, band_h, pdf.w, 2, "F")

    logo_path = os.path.join(ROOT, "public", "images", "ntsLogo-old.png")
    if os.path.exists(logo_path):
        logo_h = 13
        logo_w = logo_h * (789 / 237)  # source image aspect ratio
        logo_img = logo_for_navy_background(logo_path)
        pdf.image(logo_img, x=pdf.w - 18 - logo_w, y=(band_h - logo_h) / 2, h=logo_h)

    pdf.set_xy(18, 8)
    pdf.set_font("Helvetica", "B", 17)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 8, "NTS Ltd")
    pdf.set_xy(18, 18)
    pdf.set_font("Helvetica", "", 10.5)
    pdf.set_text_color(200, 208, 224)
    pdf.cell(0, 6, "Terms of Service")
    pdf.set_xy(18, 27)
    pdf.set_font("Helvetica", "", 8)
    pdf.cell(0, 5, clean(f"Last updated: {data['lastUpdated']}"))

    pdf.set_y(band_h + 2 + 12)

    # Intro
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 5.5, clean(data["intro"]))
    pdf.ln(4)

    # Sections
    for i, section in enumerate(data["sections"], start=1):
        if pdf.get_y() > pdf.h - 55:
            pdf.add_page()

        # Numbered heading
        y = pdf.get_y()
        pdf.set_fill_color(*NAVY)
        pdf.rect(18, y, 7, 7, "F")
        pdf.set_xy(18, y)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(7, 7, str(i), align="C")
        pdf.set_xy(28, y)
        pdf.set_font("Helvetica", "B", 13)
        pdf.set_text_color(*NAVY)
        pdf.cell(0, 7, clean(section["heading"]))
        pdf.ln(11)

        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*DARK)
        for para in section.get("paragraphs", []):
            pdf.multi_cell(0, 5.5, clean(para))
            pdf.ln(2)

        for item in section.get("list", []):
            y = pdf.get_y()
            pdf.set_fill_color(*GREEN)
            pdf.ellipse(21, y + 2, 1.6, 1.6, "F")
            pdf.set_xy(26, y)
            pdf.multi_cell(0, 5.5, clean(item))
            pdf.ln(1)

        pdf.ln(4)

    os.makedirs(OUT_DIR, exist_ok=True)
    pdf.output(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
