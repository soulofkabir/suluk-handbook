# Suluk Digital Handbook — Comprehensive Project Guide

> **Single Source of Truth** for architecture, workflows, file inventory, and operational procedures.
> Last updated: 2026-04-13

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Folder Structure](#3-folder-structure)
4. [The Handbook App (index.html)](#4-the-handbook-app)
5. [Data Files Reference](#5-data-files-reference)
6. [Cloudflare Stack](#6-cloudflare-stack)
7. [Corpus & RAG Pipeline](#7-corpus--rag-pipeline)
8. [Scripts Reference](#8-scripts-reference)
9. [Development Workflow](#9-development-workflow)
10. [Pipeline: Adding a New Book (Concentration to Realization)](#10-pipeline-adding-a-new-book)
11. [Feature Inventory](#11-feature-inventory)
12. [Phase History](#12-phase-history)
13. [Pending & Future Work](#13-pending--future-work)
14. [Troubleshooting](#14-troubleshooting)
15. [Quick Reference Card](#15-quick-reference-card)

---

## 1. Project Overview

**What:** A self-contained digital companion for the Suluk Academy, a multi-year Sufi studies program led by Pir Zia Inayat Khan. The app provides access to 333 teachings from the Book of Concentration, an audio library of class recordings, a glossary, practice tracker, personal notes/bookmarks, an AI Study Companion powered by RAG search over a 26,000+ chunk corpus, Kabir's personal writings, and a homework reader.

**Who:** Built by Kabir (Ramesh) as a personal learning tool, with plans to expand through the full Suluk curriculum (Contemplation, Meditation, Realization).

**Where:**
- **Live site:** https://soulofkabir.github.io/suluk-handbook/
- **GitHub repo:** https://github.com/soulofkabir/suluk-handbook
- **Worker repo:** https://github.com/soulofkabir/suluk-worker
- **Local project:** `/Users/heartmath/Documents/Suluk_Project/`

---

## 2. Architecture

```
+-------------------------------------------+
|          GitHub Pages (Static)            |
|  soulofkabir.github.io/suluk-handbook/    |
|                                           |
|  index.html ─── Single-file app           |
|  (5,600 lines: HTML + CSS + JS)           |
|                                           |
|  data/ ─── JSON content + page images     |
+-------------------+-----------------------+
                    |
        +-----------+-----------+
        |                       |
+-------v--------+    +--------v---------+
| Cloudflare R2  |    | Cloudflare Worker|
| suluk-audio    |    | suluk-worker     |
| (public bucket)|    |                  |
|                |    | Routes:          |
| /C1/ .. /C20/  |    |  /chat           |
| /prayers/      |    |  /rag-chat       |
| 222 audio clips|    |  /rag-ingest     |
+----------------+    |  /rag-search     |
                      |  /upload, /file  |
                      |  /backup-data    |
                      +--------+---------+
                               |
                    +----------+----------+
                    |                     |
             +------v------+    +--------v--------+
             | Workers AI  |    | Vectorize Index |
             | BGE-base    |    | suluk-knowledge |
             | (embeddings)|    | 768-dim, cosine |
             +--------------+    | ~22,200 vectors |
                                +-----------------+
                                       |
                              +--------v--------+
                              | Gemini 2.5 Flash|
                              | (chat answers)  |
                              +-----------------+
```

### Design Principles
- **Single-file app:** All HTML, CSS, and JS live in `index.html`. No build tools, no frameworks.
- **Static hosting:** GitHub Pages serves everything. No server-side rendering.
- **Cloudflare for backend:** R2 for audio, Workers for API, Vectorize for semantic search, Workers AI for embeddings.
- **User data in localStorage:** Bookmarks, notes, highlights, practice log, homework progress — all stored client-side under `suluk_user_data`.
- **Cloud sync available:** Optional backup/restore to Cloudflare R2 via the Worker.

---

## 3. Folder Structure

### Main Project: `/Users/heartmath/Documents/Suluk_Project/`

```
Suluk_Project/
|
|-- suluk-handbook/          # THE APP — GitHub Pages repo
|   |-- index.html           # Single-file app (5,600 lines)
|   |-- PROGRESS.md          # Development history & phase tracker
|   |-- manifest.json        # PWA manifest
|   |-- sw.js                # Service worker (caching & offline)
|   |-- service-worker.js    # Legacy service worker
|   |-- .gitignore
|   |-- assets/
|   |   |-- images/          # Cover image, icons, portraits
|   |-- data/
|   |   |-- handbook_concentration.json    # 333 teachings (the core content)
|   |   |-- audio_manifest.json            # 224 audio clips across 21 classes
|   |   |-- glossary.json                  # 40 Sufi terms with definitions
|   |   |-- cross_reference_data.json      # Teaching cross-references
|   |   |-- user_data.json                 # Default user data template
|   |   |-- homework/
|   |   |   |-- homework_content.json      # 10 reading assignments metadata
|   |   |   |-- images/                    # 128 page images for homework reader
|   |   |-- writings/
|   |       |-- kabir_writings.json        # 70 Reflections entries
|   |       |-- kabir_other.json           # Other writings (6 collections)
|   |       |-- images/                    # 127 page images for writings viewer
|   |       |-- *.pdf, *.pptx, *.docx      # Source documents
|   |-- scripts/
|       |-- (utility scripts)
|
|-- suluk-worker/            # CLOUDFLARE WORKER — API backend
|   |-- src/index.js         # Worker source (all routes)
|   |-- wrangler.toml        # Cloudflare config (R2, AI, Vectorize bindings)
|   |-- package.json
|
|-- toronto_corpus/          # DOWNLOADED PDFs (Toronto Sufi Order)
|   |-- message_volumes/     # 15 PDFs: HIK Message Vols 1-14 + Sayings
|   |-- books/               # 2 PDFs: Toward The One, Keeping in Touch
|   |-- newsletters/         # 29 PDFs: Pir Vilayat newsletters (mostly scanned)
|
|-- Classes/                 # SOURCE MATERIAL (organized by book)
|   |-- Concentration/
|   |   |-- Audio_Library/   # Raw class audio files
|   |   |-- Handbook/        # Handbook source documents
|   |   |-- Section_I/       # Part I teaching materials
|   |   |-- Section_II/      # Part II teaching materials
|   |   |-- Journey_With_The_Guide/
|   |   |-- Transcript_Audit_Reports/
|   |-- Contemplation/
|   |   |-- Section_I/       # Part I materials (NEXT TO BUILD)
|   |   |-- Section_II/
|   |-- Meditation/
|   |   |-- Section_I/
|   |   |-- Section_II/
|   |-- Realization/
|       |-- Section_I/
|       |-- Section_II/
|
|-- Review/                  # INCOMING MATERIALS (22 items)
|   |-- (PDFs, DOCXs, audio files to be processed)
|
|-- Docs/                    # Miscellaneous project documents
|-- Images/                  # Project images
|-- Scripts/                 # Standalone utility scripts
|-- Suluk_Auto_Transcribe/   # Audio transcription tools
|
|-- .claude/                 # Claude Code project config
    |-- launch.json          # Local dev server config (python3 on port 7777)
```

### Pipeline Workspace: `/Users/heartmath/Documents/PDF_to_MD/`

```
PDF_to_MD/
|
|-- hik_corpus/
|   |-- raw_pdfs/            # Source PDFs (HIK Complete Works, etc.)
|   |-- processed/           # Chunked JSONL files ready for ingest
|       |-- hik/             # Namespace: hik (27 books)
|       |-- sufi-library/    # Namespace: sufi-library (10 books)
|       |-- toronto_chunks.jsonl  # Toronto corpus (4,151 chunks)
|       |-- _ingested_ids.txt     # Checkpoint: 19,705 ingested vector IDs
|
|-- *.py                     # 14 Python scripts (see Scripts Reference)
|-- venv/                    # Python virtual environment
|-- output/                  # Misc extraction output
```

---

## 4. The Handbook App

### `index.html` — 5,601 lines

The entire app is in this one file. Major sections:

| Lines (approx) | Section |
|----------------|---------|
| 1-200 | HTML head, meta tags, PWA manifest |
| 200-1200 | CSS — full design system ("Crisp Pearl & True Bronze") |
| 1200-1600 | Global JS variables, data loading, initialization |
| 1600-2200 | Teaching view, navigation, reading flow |
| 2200-2600 | Full Book mode (333 teachings in book layout) |
| 2600-3000 | Bookmarks, highlights, notes, journal |
| 3000-3200 | Audio Library + player |
| 3200-3500 | Audio playback engine |
| 3500-3800 | Search engine |
| 3800-4000 | Glossary, Practice Tracker |
| 4000-4200 | Reading Stats, Learning Timeline |
| 4200-4500 | Links page, Related Teachings |
| 4500-4700 | Kabir's Writings (6 tile gallery + page viewer) |
| 4700-4900 | Homework (10 assignments + reader) |
| 4900-5100 | AI Study Companion (chat + RAG) |
| 5100-5300 | My Library, cloud sync, settings |
| 5300-5500 | Utility functions, admin mode |
| 5500-5601 | Initialization, event listeners, startup |

### Design System: "Crisp Pearl & True Bronze"
- **Background:** `#FAF8F5` (warm pearl)
- **Text:** `#302B27` (espresso)
- **Accent:** `#B8860B` (dark goldenrod / true bronze)
- **Fonts:** Nunito (headings), Source Sans 3 (body)
- **Inspiration:** The original Suluk Handbook PDF aesthetic

### Admin Mode
- Type `suluk` anywhere to toggle admin mode
- Reveals: Study Companion, Kabir's Writings, Links, Homework, My Library
- Stored in localStorage as `suluk_admin_mode`

---

## 5. Data Files Reference

### `handbook_concentration.json`
- **333 teachings** organized by Part (I, II, III), Chapter, and Teaching number
- Each teaching: `{id, part, chapter, chapter_title, session, instructor, title, body, ...}`
- Instructors: Pir Zia Inayat Khan, Urs Qutbuddin Schellenberg, Guide Mansur

### `audio_manifest.json`
- **224 clips** across **21 classes** (C1-C20 + P1 Prayers)
- Each clip: `{segment, title, filename, category, start_time, end_time, url}`
- Categories: prayer, teaching, practice, meditation
- Audio hosted on R2: `https://pub-655e0e7533694c53a63276368afd5e43.r2.dev/{classId}/{filename}`
- P1 Prayers: 3 .m4a files under `prayers/` prefix

### `glossary.json`
- 40 Sufi terms with definitions, Arabic/Persian origins
- Used for inline tooltips and glossary page

### `homework_content.json`
- 10 reading assignments with metadata:
  - `readingId` — unique key (e.g., `concentration_i_part_i`)
  - `title`, `subtitle`, `pageCount`
  - `pages[]` — array of page image paths
- Auto-populated into user's homework on first load via `seedHomeworkAssignments()`

### `kabir_writings.json` + `kabir_other.json`
- `kabir_writings.json`: 70 Reflections entries (text-based)
- `kabir_other.json`: 6 collections displayed as page-image decks:
  - Crimson Heart (12 pages), Light Dreaming (7 pages)
  - The Journey of Light (custom), Reflections PDF (70 pages)
  - Suluk Ascent (20 pages), Purification Breaths (18 pages)

---

## 6. Cloudflare Stack

### R2 Bucket: `suluk-audio` (Public)
- **URL:** `https://pub-655e0e7533694c53a63276368afd5e43.r2.dev`
- **Contents:**
  - `/C1/` through `/C20/` — 221 class audio clips (.mp3)
  - `/prayers/` — 3 prayer recordings (.m4a)
- **Management:** `npx wrangler r2 object put/get/list suluk-audio/...`

### R2 Bucket: `suluk-personal` (Private)
- Personal file uploads and data backups
- Accessed through Worker auth routes

### Worker: `suluk-worker`
- **URL:** `https://suluk-worker.soulofkabir.workers.dev`
- **Auth:** Bearer token in `env.AUTH_TOKEN`
- **Routes:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat` | No | Proxy to Gemini 2.5 Flash for general chat |
| POST | `/rag-chat` | Yes | RAG chat: vector search + Gemini answer |
| POST | `/rag-ingest` | Yes | Embed chunks via Workers AI + upsert to Vectorize |
| POST | `/rag-search` | Yes | Raw vector search (returns top-k chunks) |
| POST | `/upload` | Yes | Upload file to R2 |
| GET | `/file/:key` | Yes | Stream file from R2 |
| DELETE | `/file/:key` | Yes | Delete file from R2 |
| GET | `/files` | Yes | List all files |
| POST | `/backup-data` | Yes | Store localStorage backup |
| GET | `/backup-data` | Yes | Retrieve latest backup |

### Vectorize Index: `suluk-knowledge`
- **Dimensions:** 768 (BGE-base-en-v1.5)
- **Metric:** Cosine similarity
- **Current vectors:** ~22,200 (with ~2,500 pending)
- **Namespaces:**

| Namespace | Source | Chunks | Status |
|-----------|--------|--------|--------|
| `hik` | 27 HIK Complete Works PDFs | ~12,155 | Ingested |
| `sufi-library` | 10 supplementary Sufi books | ~3,100 | Ingested |
| `hik-online` | hazrat-inayat-khan.org Study DB | ~4,561 | Ingested |
| `ruhaniat` | Ruhaniat Esoteric Papers | ~4,378 | Ingested |
| `sufi-canada` | Sufi Movement Canada site | 38 | Ingested |
| `sufi-message` | A Sufi Message site + PDFs | 66 | Ingested |
| `hik-message` | 14 HIK Message Volumes + Sayings | 3,285 | 1,651 ingested, 1,634 pending |
| `pir-vilayat` | Toward The One + Keeping in Touch | 866 | Partially ingested |

### Workers AI
- **Model:** `@cf/baai/bge-base-en-v1.5` (embedding)
- **Neuron quota:** 10,000/day (free tier) — resets daily
- **Used by:** `/rag-ingest` (batch embed) and `/rag-search` (query embed)

### Gemini API
- **Model:** Gemini 2.5 Flash
- **Key stored as:** `env.GEMINI_API_KEY` (Cloudflare secret)
- **Used by:** `/chat` and `/rag-chat` routes

---

## 7. Corpus & RAG Pipeline

### How the Study Companion Works

```
User Question
     |
     v
[Worker /rag-chat]
     |
     +--> Embed query via Workers AI (BGE-base)
     |
     +--> Vector search in suluk-knowledge
     |    (top-k chunks, filtered by namespace)
     |
     +--> Build prompt: system context + retrieved chunks + question
     |
     +--> Send to Gemini 2.5 Flash
     |
     v
Answer with citations
```

### Ingesting New Content

```
Source PDF/HTML
     |
     v
[Python script] ── Extract text (pdftotext / BeautifulSoup)
     |
     v
[Chunker] ── Paragraph-aware, ~500 words/chunk, max 2200 chars
     |
     v
[JSONL file] ── {chunk_id, text, metadata{namespace, book, author, ...}}
     |
     v
[ingest_*.py] ── POST batches of 50 to /rag-ingest
     |
     v
[Worker] ── Embed via Workers AI → Upsert to Vectorize
     |
     v
[Checkpoint] ── Append chunk IDs to _ingested_ids.txt
```

### Chunk ID Format
```
{namespace}::{slug}::ch{NNNN}::ck{NNNN}
```
Examples:
- `hik::complete-works-1922-vol-i-jan-aug::ch0005::ck0012`
- `hik-message::the-message-vol-4-healing-mental-purification::ch0003::ck0007`
- `pir-vilayat::toward-the-one::ch0010::ck0003`

### Checkpoint File
- **Path:** `/Users/heartmath/Documents/PDF_to_MD/hik_corpus/processed/_ingested_ids.txt`
- **Format:** One vector ID per line
- **Current count:** ~19,705 IDs
- **Used with:** `--skip-existing` flag to resume interrupted ingests

---

## 8. Scripts Reference

All scripts in `/Users/heartmath/Documents/PDF_to_MD/`:

| Script | Purpose | Usage |
|--------|---------|-------|
| `hik_parser.py` | Parse HIK Complete Works PDFs with TOC extraction | `python3 hik_parser.py <pdf>` |
| `toc_extractor.py` | Extract table of contents from PDF structure | `python3 toc_extractor.py <pdf>` |
| `rescue_pdftotext_book.py` | Extract text from PDFs (incl. Caesar-cipher decoded fonts) | `python3 rescue_pdftotext_book.py <pdf> [--decode-font] [--offset N]` |
| `identify_pdfs.py` | Identify and classify PDF files | `python3 identify_pdfs.py <dir>` |
| `rename_pdfs.py` | Standardize PDF filenames | `python3 rename_pdfs.py` |
| `diagnose_fonts.py` | Diagnose font encoding in PDFs | `python3 diagnose_fonts.py <pdf>` |
| `ingest_to_vectorize.py` | Main ingest orchestrator (walks namespaced directories) | `SULUK_AUTH_TOKEN=<token> python3 ingest_to_vectorize.py [--skip-existing]` |
| `ingest_toronto.py` | Toronto corpus ingest (flat JSONL) | `SULUK_AUTH_TOKEN=<token> python3 ingest_toronto.py [--skip-existing]` |
| `process_toronto.py` | Extract + chunk Toronto PDFs into JSONL | `python3 process_toronto.py` |
| `scrape_hik_official.py` | Scrape hazrat-inayat-khan.org Study Database | `python3 scrape_hik_official.py` |
| `scrape_ruhaniat_pdfs.py` | Scrape Ruhaniat Esoteric Papers Library | `python3 scrape_ruhaniat_pdfs.py` |
| `scrape_suficanada.py` | Scrape Sufi Movement Canada website | `python3 scrape_suficanada.py` |
| `scrape_sufimessage.py` | Scrape A Sufi Message website + PDFs | `python3 scrape_sufimessage.py` |
| `scrape_wahiduddin.py` | Scrape Wahiduddin's Encyclopaedia of Encyclopaedias | `python3 scrape_wahiduddin.py` |

### Key Parameters
- **Chunk size:** 500 words target (`TARGET_CHUNK_WORDS`)
- **Max text chars:** 2,200 (BGE-base 512-token window)
- **Batch size:** 50 chunks per API call
- **Auth token env var:** `SULUK_AUTH_TOKEN`

---

## 9. Development Workflow

### Local Preview
```bash
cd /Users/heartmath/Documents/Suluk_Project/suluk-handbook
python3.14 -m http.server 7777
# Open http://localhost:7777
```
Or via Claude Code preview (configured in `.claude/launch.json`).

### Edit → Commit → Push
```bash
cd /Users/heartmath/Documents/Suluk_Project/suluk-handbook

# Edit index.html directly
# Preview locally

# Commit
git add index.html data/
git commit -m "Description of changes"

# Push (requires PAT for soulofkabir org)
git remote set-url origin https://soulofkabir:<PAT>@github.com/soulofkabir/suluk-handbook.git
git push origin main
git remote set-url origin https://github.com/soulofkabir/suluk-handbook.git  # clean PAT
```

**Note:** The repo is owned by `soulofkabir` but local git credentials are for `rameshguda`. A GitHub Personal Access Token (PAT) is required for push. Always clean the PAT from the remote URL after pushing.

### Deploy Worker
```bash
cd /Users/heartmath/Documents/Suluk_Project/suluk-worker
npx wrangler deploy
```

### Manage Worker Secrets
```bash
npx wrangler secret put AUTH_TOKEN     # Set ingest auth token
npx wrangler secret put GEMINI_API_KEY # Set Gemini API key
npx wrangler secret list               # List all secrets
```

### Upload Audio to R2
```bash
npx wrangler r2 object put "suluk-audio/<path>/<filename>" \
  --file="/path/to/local/file" \
  --content-type="audio/mpeg" \
  --remote
```

---

## 10. Pipeline: Adding a New Book

The Suluk curriculum has 4 books. Concentration is complete. Here's the pipeline for Contemplation (and subsequent books):

### Step 1: Prepare Source Materials
- Collect teaching materials from `Classes/Contemplation/Section_I/` and `Section_II/`
- Organize audio recordings
- Gather any new homework/practice documents

### Step 2: Create the Content JSON
- Create `data/handbook_contemplation.json` following the same schema as `handbook_concentration.json`
- Each teaching needs: `{id, part, chapter, chapter_title, session, instructor, title, body}`
- 333 teachings per book (same structure)

### Step 3: Add Book Selector to the App
- The "Four Books" buttons at the bottom of the sidebar already exist: `Conc.`, `Cont.`, `Med.`, `Real.`
- Wire each button to load the corresponding JSON file
- Update `loadHandbook()` to accept a book parameter

### Step 4: Process Audio
- Segment class recordings into clips (same as Concentration pipeline)
- Upload to R2 under new class prefixes (e.g., `CT1/`, `CT2/`, etc.)
- Add entries to `audio_manifest.json`

### Step 5: Expand the Corpus
- Extract text from any new PDFs/documents
- Chunk with the standard pipeline (~500 words, paragraph-aware)
- Ingest into Vectorize under an appropriate namespace
- The Study Companion automatically searches all namespaces

### Step 6: Update Homework
- Add new reading assignments to `homework_content.json`
- Convert PDFs/DOCXs to page images: `pdftoppm -jpeg -r 150 input.pdf prefix`
- For DOCX: first convert to PDF: `soffice --headless --convert-to pdf input.docx`

---

## 11. Feature Inventory

### Core Reading
- 333 teachings with full navigation (prev/next, chapter browser)
- Full Book mode (continuous scroll through all teachings)
- Cover page with Mount Qaf imagery
- PDF download of original handbook

### Audio
- 224 clips across 21 classes (C1-C20 + Prayers)
- Persistent bottom audio bar with play/pause/skip
- Clips categorized: prayer, teaching, practice, meditation
- Expandable class cards with clip lists

### Personal Learning
- Bookmarks (star any teaching)
- Highlights (select text to highlight)
- Notes (per-teaching notes)
- Journal (date-stamped entries)
- Practice Tracker (log daily practice with streak tracking)
- Reading Stats (completion %, time spent)
- Learning Timeline (chronological activity feed)
- Recently Viewed (last 20 teachings)

### Discovery
- Full-text search with topic/instructor filters
- Glossary with 40 Sufi terms
- Cross-references between related teachings

### Workspace (Admin)
- **AI Study Companion** — RAG-powered chat over 26,000+ chunk corpus
  - Namespace dropdown to filter by source
  - Citation links back to source documents
- **Kabir's Writings** — 6-tile gallery:
  - Reflections (70 entries, text + page images)
  - Crimson Heart (12-page visual meditation)
  - Light Dreaming (7 pages)
  - The Journey of Light (essay)
  - The Ascent of Mount Qaf (20 pages)
  - Purification Breaths (18 pages)
- **Homework** — 10 pre-populated reading assignments with in-app reader
  - Read button opens full-page image viewer
  - Mark Complete tracking
- **Links** — curated external resources
- **My Library** — personal file uploads to R2
- **Sync & Settings** — cross-device data sync via Worker

### Infrastructure
- PWA with service worker (offline capable)
- Cloud sync (backup/restore localStorage to R2)
- Admin mode (type `suluk` to reveal Workspace section)

---

## 12. Phase History

| Phase | Description | Commits | Status |
|-------|-------------|---------|--------|
| A | Foundation — cover page, shell, night mode | `5c7794f` | Done |
| B | Core Reading — all 333 teachings | `7e8b017` | Done |
| C | Personal Layer — bookmarks, highlights, notes | `220c93c` | Done |
| D | Audio Integration — library, player, R2 hosting | `7ec895f`..`f8ed56c` | Done |
| E | Search, Glossary, Practice Tracker | `ddb9db5` | Done |
| F | PWA & Offline — service worker, caching | `bfff292` | Done |
| G1 | Skip Cover & PDF Download | `79e9165`, `761a626` | Done |
| G2 | Links & Homework tracker | `d672876` | Done |
| G3 | Personal Content Library & Cloud Sync | `9284c54`..`275016c` | Done |
| G4 | AI Study Companion (Gemini 2.5 Pro) | `5cf9c4e` | Done |
| G5 | UI Polish — portraits, stats, timeline | `43b9153` | Done |
| H | Kabir's Writings (gallery + AI integration) | `b80b42e`..`bc87521` | Done |
| I | Unified RAG Backend — 6 namespace corpus, 22k+ chunks | `0393f8c`..`cec690b` | Done |
| - | Review Folder Integration — homework reader, audio prayers | `809dd4f` | Done |
| - | Toronto Corpus — 14 Message Volumes + books (4,151 chunks) | In progress | 40% ingested |

**Total commits:** 60

---

## 13. Pending & Future Work

### Immediate (Next Session)
- [ ] Resume Toronto ingest: 2,500 chunks remaining (run `ingest_toronto.py --skip-existing` when neurons reset)
- [ ] Re-ingest 894 checkpoint-gap chunks from earlier (data in Vectorize but missing from checkpoint)
- [ ] End-to-end smoke test of Study Companion with new namespaces

### Short-Term
- [ ] Scrape Toronto HTML teaching pages (~25 pages of HIK/Pir Vilayat/Pir Zia quotes)
- [ ] OCR the 28 scanned Toronto newsletters (optional — `tesseract` or similar)
- [ ] Explore Pir Vilayat Archive (pirvilayatarchive.org) via Chrome — currently 403-blocked
- [ ] Assess Idries Shah Foundation free books for corpus

### Medium-Term: Book 2 — Contemplation
- [ ] Gather Contemplation teaching materials from `Classes/Contemplation/`
- [ ] Create `handbook_contemplation.json` (333 teachings)
- [ ] Segment and upload Contemplation audio
- [ ] Wire book selector buttons in sidebar
- [ ] Add Contemplation homework assignments

### Long-Term
- [ ] Books 3 & 4: Meditation, Realization (same pipeline)
- [ ] Practice Guide section — step-by-step breath instructions (Purification Breaths, Alternative Breath)
- [ ] Pir Vilayat Archive corpus (once accessible)
- [ ] Multi-user support / login system
- [ ] Mobile app (or enhanced PWA)

---

## 14. Troubleshooting

### Git push 403
The repo is owned by `soulofkabir` but local git uses `rameshguda` credentials. Use a PAT:
```bash
git remote set-url origin https://soulofkabir:<PAT>@github.com/soulofkabir/suluk-handbook.git
git push origin main
git remote set-url origin https://github.com/soulofkabir/suluk-handbook.git  # ALWAYS clean after
```

### Neurons exhausted (Workers AI error 4006)
- Free tier: 10,000 neurons/day
- Each embedding batch of 50 chunks ~ uses neurons
- Resets at midnight UTC
- Use `--skip-existing` to resume ingests across days

### 503 errors during ingest
- Workers AI rate limiting — wait and retry
- The ingest scripts have built-in retry (3 attempts with exponential backoff)
- Use `--skip-existing` to safely resume

### pdftotext returns empty
- The PDF is likely image-based (scanned)
- Use OCR: `tesseract` or the `--decode-font` mode in `rescue_pdftotext_book.py` for Caesar-cipher encoded fonts

### LibreOffice not found
- `soffice` is at `/opt/homebrew/bin/soffice` (Homebrew install)
- Use: `soffice --headless --convert-to pdf input.docx`

### PDF to page images
```bash
pdftoppm -jpeg -r 150 input.pdf output_prefix
# Produces: output_prefix-1.jpg, output_prefix-2.jpg, ...
```

---

## 15. Quick Reference Card

### URLs
| Resource | URL |
|----------|-----|
| Live app | https://soulofkabir.github.io/suluk-handbook/ |
| Worker API | https://suluk-worker.soulofkabir.workers.dev |
| R2 audio | https://pub-655e0e7533694c53a63276368afd5e43.r2.dev |
| GitHub (handbook) | https://github.com/soulofkabir/suluk-handbook |
| GitHub (worker) | https://github.com/soulofkabir/suluk-worker |

### Key Commands
```bash
# Local preview
python3.14 -m http.server 7777 --directory suluk-handbook

# Deploy worker
cd suluk-worker && npx wrangler deploy

# Upload audio to R2
npx wrangler r2 object put "suluk-audio/path/file.mp3" --file="local.mp3" --remote

# Ingest corpus chunks
cd /Users/heartmath/Documents/PDF_to_MD
SULUK_AUTH_TOKEN=<token> python3 ingest_toronto.py --skip-existing

# Process new PDFs
python3 process_toronto.py  # or use rescue_pdftotext_book.py for individual books

# Convert DOCX to PDF
soffice --headless --convert-to pdf input.docx

# Convert PDF to page images
pdftoppm -jpeg -r 150 input.pdf prefix
```

### File Counts
| Item | Count |
|------|-------|
| index.html lines | 5,601 |
| Teachings | 333 |
| Audio clips | 224 (21 classes) |
| Glossary terms | 40 |
| Homework assignments | 10 |
| Kabir's Writings collections | 6 |
| Page images (total) | 255 |
| Corpus chunks (ingested) | ~22,200 |
| Corpus chunks (pending) | ~2,500 |
| Git commits | 60 |
| Python pipeline scripts | 14 |

---

*This document should be updated after each major phase or feature addition. Keep it in the project root at `/Users/heartmath/Documents/Suluk_Project/SULUK_PROJECT_GUIDE.md`.*
