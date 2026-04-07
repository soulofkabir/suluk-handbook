#!/usr/bin/env python3
"""
Extract the three other writings into JSON + assets:

  - Crimson Heart Reflections (PDF, 12 pages)
      → render each page as a JPEG → ch_NN.jpg
      → kabir_other.json["crimson_heart"] = { pages: [...] }

  - Light Dreaming / The Journey of Light (PPTX, 7 slides)
      → extract title+body+image per slide → ld_NN.jpg
      → kabir_other.json["light_dreaming"] = { slides: [...] }

  - The Journey of Light – Extended (DOCX)
      → extract paragraphs as flowing text
      → kabir_other.json["journey_extended"] = { title, paragraphs: [...] }

Output: data/writings/kabir_other.json
        data/writings/images/ch_*.jpg, ld_*.jpg
"""
import os, json, io, re, subprocess
from pptx import Presentation
from PIL import Image
from docx import Document

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(ROOT, "images")
OUT_JSON = os.path.join(ROOT, "kabir_other.json")
os.makedirs(IMG_DIR, exist_ok=True)

CH_PDF  = os.path.join(ROOT, "Crimson_Heart_Reflections.pdf")
LD_PDF  = os.path.join(ROOT, "The Journey of Light.pdf")
JE_DOCX = os.path.join(ROOT, "New Dimensions \u2013 The Journey of the Light.docx")

MAX_W = 1400

def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()

def jpg_resize(src_path, dst_path, max_w=MAX_W, q=82):
    im = Image.open(src_path)
    if im.mode != "RGB":
        im = im.convert("RGB")
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    im.save(dst_path, "JPEG", quality=q, optimize=True)

def extract_crimson_heart():
    """Render each PDF page to JPEG via pdftoppm."""
    print("== Crimson Heart ==")
    tmp_prefix = os.path.join(IMG_DIR, "_ch_tmp")
    # 150 DPI is plenty for screen reading
    subprocess.check_call([
        "pdftoppm", "-jpeg", "-r", "150", CH_PDF, tmp_prefix
    ], stdout=subprocess.DEVNULL)
    pages = []
    raw = sorted(f for f in os.listdir(IMG_DIR) if f.startswith("_ch_tmp"))
    for i, f in enumerate(raw, start=1):
        src = os.path.join(IMG_DIR, f)
        dst = os.path.join(IMG_DIR, f"ch_{i:02d}.jpg")
        jpg_resize(src, dst)
        os.remove(src)
        pages.append(f"data/writings/images/ch_{i:02d}.jpg")
        print(f"  page {i:02d}")
    return {
        "title": "Crimson Heart",
        "subtitle": "A Visual Meditation on the Poem",
        "pages": pages,
        "source_pdf": "data/writings/Crimson_Heart_Reflections.pdf",
    }

def extract_light_dreaming():
    """Render Light Dreaming PDF pages to JPEG (rendered slides w/ titles)."""
    print("== Light Dreaming ==")
    # clean up old extracted images
    for f in os.listdir(IMG_DIR):
        if f.startswith("ld_") and f.endswith(".jpg"):
            os.remove(os.path.join(IMG_DIR, f))
    tmp_prefix = os.path.join(IMG_DIR, "_ld_tmp")
    subprocess.check_call([
        "pdftoppm", "-jpeg", "-r", "150", LD_PDF, tmp_prefix
    ], stdout=subprocess.DEVNULL)
    pages = []
    raw = sorted(f for f in os.listdir(IMG_DIR) if f.startswith("_ld_tmp"))
    for i, f in enumerate(raw, start=1):
        src = os.path.join(IMG_DIR, f)
        dst = os.path.join(IMG_DIR, f"ld_{i:02d}.jpg")
        jpg_resize(src, dst)
        os.remove(src)
        pages.append(f"data/writings/images/ld_{i:02d}.jpg")
        print(f"  page {i:02d}")
    return {
        "title": "Light Dreaming",
        "subtitle": "A Journey Through the Five Elements",
        "pages": pages,
        "source_pdf": "data/writings/The Journey of Light.pdf",
    }

def extract_journey_extended():
    """Extract paragraphs from the DOCX as flowing text."""
    print("== Journey of Light (Extended) ==")
    doc = Document(JE_DOCX)
    paras = []
    title = "The Journey of Light — Extended"
    for p in doc.paragraphs:
        t = clean(p.text)
        if not t:
            continue
        # First non-empty line that looks like a heading becomes title
        if not paras and len(t) < 100 and (p.style.name.startswith("Title") or p.style.name.startswith("Heading")):
            title = t
            continue
        paras.append({
            "text": t,
            "style": p.style.name,
        })
    print(f"  {len(paras)} paragraphs")
    return {
        "title": title,
        "paragraphs": paras,
    }

def main():
    out = {}
    out["crimson_heart"]    = extract_crimson_heart()
    out["light_dreaming"]   = extract_light_dreaming()
    out["journey_extended"] = extract_journey_extended()
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"\n✓ wrote {OUT_JSON}")

if __name__ == "__main__":
    main()
