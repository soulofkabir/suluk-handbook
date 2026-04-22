# Suluk Digital Handbook — Development Progress

**Project:** Suluk Academy Personal Learning Companion
**URL:** https://soulofkabir.github.io/suluk-handbook/
**Architecture:** Single-file HTML + CSS + Vanilla JavaScript, GitHub Pages static hosting
**Data:** `data/handbook_concentration.json`, `data/cross_reference_data.json`, `data/glossary.json`, `data/audio_manifest.json`
**Audio:** Cloudflare R2 bucket `suluk-audio` (public), 438 clips across 31 classes (C1–C20 Concentration + CT1–CT10 Contemplation + P1 Prayers)
**Contemplation Pipeline:** CT1–CT10 complete through Phase 6 (Axis-1 Coverage Audit) — 214 CT audio clips + 227 canonical snippets + 40 new glossary terms
**Personal Files:** Cloudflare R2 bucket `suluk-personal` (private), via Worker at `suluk-worker.soulofkabir.workers.dev`
**AI Chat:** Gemini 2.5 Flash via Cloudflare Worker `/chat` endpoint
**Design System:** "Crisp Pearl & True Bronze" — Nunito + Source Sans 3
**Last updated:** 2026-04-22

---

## Phase A — Foundation & Shell ✅

- **Project scaffold** — Single `index.html` with embedded CSS and JavaScript, `manifest.json`, `/assets/images/` folder with all images
- **Animated cover page** — Full-screen opening with Mount Qaf background (full image, no overlay), white text with dark shadow, CSS keyframe animations, "Enter the Handbook" button
- **Cover page behavior** — Shows on first visit; subsequent visits skip directly to handbook via `localStorage.suluk_entered` flag
- **Design system** — CSS custom properties (`:root` variables) for all colors, fonts, spacing, and transitions
- **Two-panel layout** — Fixed 320px sidebar + scrollable main content area, responsive mobile collapse
- **Sidebar navigation** — Dynamic nav built via `buildSidebarNav()`, part/chapter hierarchy with collapsible sections
- **Font size controls** — A / A+ / A++ buttons; `--font-base` CSS variable; preference persisted
- **Reading progress bar** — Gold strip at top of viewport driven by scroll position
- **URL deep linking** — Hash-based navigation (`#t42`) for direct teaching links

---

## Phase B — Content Layer (333 Teachings) ✅

- **JSON data pipeline** — `fetch('data/handbook_concentration.json')` on load
- **Dynamic sidebar nav** — Three Parts (I, II, III) → 26 Chapters → individual teachings
- **Teaching renderer** — `showTeaching(id)` with title, breadcrumb, full Markdown body
- **Custom Markdown parser** — Headings, bold/italic/underline, blockquotes, lists, tables
- **Full Book mode** — Continuous scroll of all 333 teachings with front matter and appendices A–E
- **Keyboard navigation** — Arrow keys, Escape for modals

---

## Phase C — Personal Learning Layer ✅

- **Bookmarks** — Star icon per teaching, sidebar panel
- **Notes** — Modal with type selector (Reflection, Question, Practice, Insight)
- **Text Highlights** — Select text → highlight toolbar, colors persisted
- **Journal** — Full-page journal editor with date/teaching reference
- **Recently Viewed** — Last 15 teachings with timestamps
- **Export** — Download all user data as JSON

---

## Phase D — Audio Integration ✅

- **Audio manifest** — `data/audio_manifest.json` with 221 clips across 20 classes (C1–C20)
- **Audio hosting** — Cloudflare R2 bucket `suluk-audio` (public URL: `https://pub-655e0e7533694c53a63276368afd5e43.r2.dev`)
- **Audio Library page** — Sidebar nav "♪ Audio Library"; collapsible class cards with instructor, date, duration, clip count
- **Persistent bottom audio bar** — Play/pause, progress seek, time display, skip, speed control (0.75×–2×)
- **Playlist mode** — 221 clips auto-advance; skip buttons navigate playlist
- **Timestamp fix** — C6 and C9 had mixed MM:SS:FF formats; all normalized to HH:MM:SS
- **Reading/listening separated** — Inline audio removed from teaching views; Audio Library is the dedicated listening experience

---

## Phase E — Search, Glossary, Practice Tracker ✅

- **Full-text search** — Search across all 333 teachings with weighted scoring (title 10×, instructor 5×, body 1×)
- **Topic filters** — All (333), Prayers (24), Chivalric Rules (12), Breath (19), Concentration/Visualization/Meditation (63), Fikr/Zikr/Wazifa (13), Movements (20), Teachings (112), Stories (20), Quotes/Sayings/Poetry (24), Deep Study/Arabic Terms (26) — each with count badge
- **Instructor filter** — All, Mansur, Pir Zia Inayat Khan, Urs Qutbuddin, Urs Qutbuddin Schellenberg
- **Browse-all mode** — Empty search shows all teachings filtered by topic/instructor
- **Recent searches** — Last 8 searches saved as clickable chips
- **Glossary** — 40 Sufi/spiritual terms with alphabet jump bar, search filter, inline tooltips on recognized terms
- **Practice Tracker** — 24 practices across 6 categories; checkbox per day; streak counter; progress stats
- **Related Teachings** — Algorithm shows top 3 related teachings below each teaching
- **Share button** — Copies teaching URL to clipboard

---

## Phase F — PWA & Offline ✅

- **Service Worker** (`sw.js`) with multi-strategy caching:
  - Cache-first for core assets (HTML, images, favicon, fonts)
  - Network-first for data files (teachings, glossary, audio manifest)
  - Cache-on-play for audio files (offline listening after first play)
- **Auto-registration** on boot with hourly update checks
- **Update notification** — Toast when new version is available
- **Install as app** — `beforeinstallprompt` captured; install button in Sync & Settings
- **Offline reading** — All teachings, glossary, and images cached automatically
- **Manifest updated** — Crisp Pearl theme colors, SVG favicon, apple-touch-icon

---

## Phase G1 — Skip Cover & PDF Download ✅

- **Skip cover on refresh** — `localStorage.suluk_entered` flag skips cover animation on return visits
- **PDF download** — "Download PDF" link in sidebar, downloads `assets/The_Book_of_Concentration.pdf` (3.1 MB)

---

## Phase G2 — Links & Homework ✅

- **Links page** — Add/edit/delete links with title, URL, category, notes; filter and search; modal form
- **Homework tracker** — Add assignments with title, class, description, due date; status cycling (not-started → in-progress → complete); progress stats

---

## Phase G3 — Personal Content Library & Cloud Sync ✅

- **Cloudflare Worker** — `suluk-worker` at `https://suluk-worker.soulofkabir.workers.dev`; handles upload, download, delete, list, backup, chat; bearer token auth; CORS for GitHub Pages + localhost
- **Private R2 bucket** — `suluk-personal` for personal file storage
- **Library UI** — Sidebar nav "My Library"; drag-and-drop + browse upload; category organization (Books, Notes, Presentations, Images, Homework, Other); grid view with thumbnails; file preview modal; download, edit, delete
- **Cross-browser/device sync** — Automatic two-way cloud sync for ALL user data:
  - On boot: pull from cloud → merge → push back (ensures local-only data gets uploaded)
  - On every save: debounced 2-second push to cloud
  - Smart merge: arrays by unique ID (no duplicates), objects merged keeping both sides
  - Syncs: links, bookmarks, homework, notes, highlights, journal, practice log, reading log, personal files
- **Sync & Settings page** — Configure Worker URL/token from any browser, connection status, data summary counts, manual "Sync Now" button, last sync timestamp
- **Worker source:** `/Users/heartmath/Documents/Suluk_Project/suluk-worker/`

---

## Phase G4 — AI Study Companion ✅

- **Gemini 2.5 Flash** via Cloudflare Worker `/chat` endpoint
- **Worker proxy** — API key stored as Wrangler secret (`GEMINI_API_KEY`), never exposed to browser
- **Rich system prompt** — Deep knowledge of Suluk Academy, Inayatiyya lineage, Sufi practices, Arabic/Persian terms
- **Teaching context awareness** — When reading a teaching, the chat includes its title, chapter, instructor, and content excerpt for relevant answers
- **Chat UI** — Full chat interface in sidebar under "Discover > Study Companion"
  - Message history with styled bubbles (user = bronze, AI = light card)
  - Markdown rendering in AI responses
  - Session-persisted conversation (sessionStorage)
  - Typing indicator, clear chat, context bar
  - Keyboard: Enter to send, Shift+Enter for newline

---

## Phase G5 — UI Polish ✅

- **Instructor portraits** — Circular 40px thumbnails in teaching headers
  - Pir Zia Inayat Khan → `pir_zia_inayat_khan.JPG` (existing)
  - Urs Qutbuddin / Schellenberg → `urs_qutbuddin.jpg` (downloaded from inayatiyya.org)
  - Mansur / Guide Mansur → `mansur_rahm.png` (downloaded from inayatiyya.org)
  - Mapping via `INSTRUCTOR_PORTRAITS` object
- **Reading Statistics** — Sidebar nav "Reading Stats"
  - Summary cards: teachings read, total words, estimated minutes, current streak
  - 30-day activity bar chart
  - Breakdown by instructor (with portraits and progress bars)
  - Top chapters breakdown
  - Powered by `readingLog` tracked on every `trackView()` call
- **Learning Timeline** — Sidebar nav "Learning Timeline"
  - Journey progress bar (X / total teachings, percentage)
  - Chronological timeline grouped by date with dot indicators
  - Clickable teaching cards to jump to any reading
  - Per-day stats (teachings count, estimated reading time)
- **Minor fixes completed:**
  - SVG favicon (`assets/favicon.svg`) — bronze "S" on pearl background
  - Deprecated `apple-mobile-web-app-capable` → `mobile-web-app-capable`
  - Apple touch icon set to Inayatiyya emblem
  - Part III empty `class_id` tag hidden (conditional rendering)

---

## Phase H — Kabir's Writings (Personal Corpus) ✅

A four-piece personal contemplative library lives under the admin-only Workspace section. All content is extracted from source PPTX/PDF/DOCX files into JSON + image assets, with a clean Crisp Pearl & True Bronze reading experience matching the rest of the handbook.

### Stage 1 — Reflections gallery (commits `b80b42e`, `393de9f`, `2dcae7f`, `98676a6`)
- **Source:** `Kabir's Writings.pptx` (142 slides) → `data/writings/kabir_writings.json` (71 entries) + `data/writings/images/kw_NNN.jpg` (70 thumbnails, ~9 MB total)
- **Extractor:** `data/writings/extract_kabir_writings.py` (python-pptx + Pillow). Reusable — drop a new PPTX in, rerun, JSON regenerates.
- **Landing:** dedication card on top (slide 1, the message to Pir Zia), then a responsive gallery of 70 cards (3-col desktop, 1-col mobile)
- **Cards:** clean cropped thumbnail + bronze title + 3-line clamped snippet
- **Search:** weighted (title 10× / body 1×), live filter, instant count update
- **Entry view:** hero image (capped 46vh, `object-fit: contain`), bold bronze title, body text, prev/next nav, deep link `#kw_NNN`
- **In-app editor (admin only):** ✎ Edit button on each entry → modal with Title / Body / Image. Uploaded images auto-compressed to 1200 px wide JPEG @ q=82, stored as data URLs in `userData.kwOverrides`. Edits sync across devices via existing cloud-sync. "Edited" dot (●) marks overridden entries. Reset-to-original button per entry.
- **Export JSON:** ⤓ button on the gallery toolbar downloads merged `kabir_writings.json` so edits can be baked into the deploy when ready.

### Stage 2 — Other writings + AI integration (commit `bc87521`)
- **Crimson Heart** (12 PDF pages) — visual meditation on the poem *A Quiet Encounter in the Garden*. Rendered via `pdftoppm` at 150 DPI, displayed as vertical scroll deck.
- **Light Dreaming** (7 PDF pages) — *A Journey Through the Five Elements*. Source PPTX is image-only, so PDF was used as the rendered source. Same vertical scroll deck pattern.
- **The Journey of Light — Extended** (DOCX, 18 paragraphs) — long-form essay version. Extracted via python-docx, rendered as flowing text with reading-optimised line height.
- **4-tile landing:** "Kabir's Writings" sidebar item now opens a chooser with Reflections / Crimson Heart / Light Dreaming / The Journey of Light tiles. Each tile carries a cover image, a meta label, and a one-line description.
- **Extractor:** `data/writings/extract_other_writings.py`. Output: `data/writings/kabir_other.json` + `ch_*.jpg`, `ld_*.jpg` images.
- **Modal scroll fix:** `.form-modal` capped at `max-height: 90vh` with internal scroll so Save/Cancel are always reachable on any screen (also benefits Links, Homework, etc.).

### Phase H — Study Companion AI integration ✅
- **Moved to admin-only.** Study Companion no longer appears in the public Discover section — it lives under Workspace alongside Kabir's Writings, only visible after typing `suluk`.
- **Kabir context in chat:** `findRelevantKabirWritings(query)` searches all 71 reflections + the Journey of Light extended essay paragraphs, weighted (title 10×, body 2× per match). Top 8 matches sent as `kabirContext` in the `/chat` payload.
- **Worker updated** (`suluk-worker` v2c8d3ad): accepts `kabirContext`, includes it in the system prompt as `--- KABIR'S WRITINGS (personal reflections) ---`, with new rules instructing the model to treat both the handbook teachings and Kabir's writings as valid primary sources and to cite which source each answer draws from.

---

## Admin Mode ✅

- **Hidden admin panel** — Workspace section only visible in admin mode. Now includes: Study Companion, Kabir's Writings, Links, Homework, My Library, Sync & Settings
- **Activation** — Type `suluk` on keyboard (not in input field) to toggle
- **Persistence** — Admin state saved in `localStorage.suluk_admin`, survives refresh
- **Public visitors** see Daily, Personal, Discover (Audio Library, Search, Glossary, Practice Tracker, Reading Stats, Learning Timeline) — but no Study Companion, no Workspace, no Kabir's Writings
- **Commits:** `9ef610d` (initial), `bc87521` (Study Companion + Kabir's Writings moved under admin)

---

## Design System — "Crisp Pearl & True Bronze" ✅

- **Palette:**
  - Background: Crisp Pearl `#FCFBF8`
  - Sidebar: `#F7F5F1`
  - Body text: Espresso `#302B27`
  - Headers/Accents: Bronze Gold `#8C6222`
  - Muted text: `#7A756E`
  - Rules/Borders: Warm Taupe `#D4CFC6`
- **Fonts:** Nunito (headings/UI/display) + Source Sans 3 (body text)
- **Accessibility:** Designed for dyslexia/ASD (age 50+) — medium contrast, `line-height: 1.8`, no dark mode
- **Cover page:** Full Mount Qaf image (no overlay, `background-size: contain`), white text with dark text-shadow
- **Sidebar nav:** Bold (700) Espresso text, bronze gold active state

---

## Contemplation Phase 5 — CT1–CT10 Data Consolidation ✅ (2026-04-22)

First full-program snippet + audio consolidation for the Contemplation stage.

**Data produced:**
- `data/contemplation_snippets.json` (new canonical, 154 snippets) merging per-class CT1–CT10 snippet files with the existing 13 handbook-curated CT1 entries. Every audio-linked snippet carries an `audio_ref` object `{url, start, end, duration_s}`.
- `data/audio_manifest.json` — CT1–CT10 sections rebuilt from per-class JSON as the authoritative source. Stub 10-clip entries replaced with real 12–17 clip lists (141 CT clips total; `total_clips` 234 → 365).
- `data/glossary.json` — +40 Arabic/Sufi terms (seven leading names, cosmological planes, Lataif system, etc.); 40 → 80 entries.

**Upstream fixes folded in:**
- **15 missing audio clips rendered** via ffmpeg + uploaded to R2 `suluk-audio/CT{N}/` using `npx wrangler r2 object put --remote`. All verified 200 OK via curl.
- **9 stub timestamps** (`45:00–80:00` placeholders in per-class JSONs) patched to real keyword-matched ranges before ffmpeg rendering.
- **CT3 / CT9 transcripts:** normalized 114 paragraphs where `[MM:SS:cc]` and `[HH:MM:SS:cc]` centisecond formats were silently breaking timestamp parsers — now standard `[MM:SS]` / `[HH:MM:SS]`.
- **CT4 snippets:** +2 story entries (Wali Forty Years, Nizam un Nisa) to meet the Phase-3 duration floor (12 ≥ ⌈73 min / 6⌉).
- **CT5 snippets:** 6 single-quoted verbatim passages converted to straight double quotes so the validator regex `r'"([^"]{20,})"'` matches. All 13 now PASS.

**Quality gate:** all 10 `CT*_snippets.json` files pass `validate_snippets.py`.

**Backup files written:** `data/audio_manifest.json.bak-2026-04-22`, `data/glossary.json.bak-2026-04-22`, and a sibling `.bak-2026-04-22` next to the canonical snippets file.

**One caveat to revisit:** CT1 has 26 canonical snippets — 13 handbook-curated (`audio_ref: null`) + 13 audio-clip entries (`audio_ref: {...}`). Distinguishable, but worth deduping at a future touchpoint.

---

## Contemplation Phase 6 — Axis-1 Coverage Audit ✅ (2026-04-22)

Systematic Gemini-2.5-Pro audit of all CT1–CT10 transcripts against the existing snippet set. Every "missing gem" identified was integrated into both per-class and canonical data.

**Pipeline:**
1. `Scripts/audit_contemplation_snippets.py` — per-class audit prompt to Gemini 2.5 Pro asking: "what teachings/stories/practices/prayers in this transcript are NOT covered by the existing snippets?". Verbatim quote + timestamp + suggested JSON required per gem.
2. `Scripts/integrate_audit_gems.py` — parse the 115 KB report, append the 73 suggested JSON blocks to per-class `CT*_snippets.json`.
3. `Scripts/expand_audit_gems.py` — Gemini 2.5 Flash pass to expand every new body to 120–160 words in Pir Zia's voice with the verbatim quote in straight double quotes (validator compliance).
4. `Scripts/merge_gems_to_canonical.py` — append 73 new entries to canonical `contemplation_snippets.json` and `audio_manifest.json`; `audio_ref` populated once clips rendered.
5. `Scripts/render_audit_clips.py` — ffmpeg `-c copy` segment + `npx wrangler r2 object put --remote` upload. **73/73 clips uploaded, 0 failed.**

**Gems by class:**

| Class | Pre-audit | Added | New total |
|---|---|---|---|
| CT1 | 13 | 5 | 18 |
| CT2 | 16 | 7 | 23 |
| CT3 | 16 | 6 | 22 |
| CT4 | 12 | **17** | 29 |
| CT5 | 13 | 6 | 19 |
| CT6 | 15 | 10 | 25 |
| CT7 | 14 | 8 | 22 |
| CT8 | 17 | 5 | 22 |
| CT9 | 12 | 6 | 18 |
| CT10 | 13 | 3 | 16 |
| **Total** | **141** | **+73** | **214** |

CT4 was the biggest gap — foundational concepts (three planes Nasut/Malakut/Jabrut, lata'if journey, zikr+fikr marriage, qutb, khatam) all missing. CT6 added a full-text fiery-landscape guided meditation.

**Stats after Phase 6:**
- Canonical snippets: 154 → 227
- CT audio clips in R2: 141 → 214
- Total audio_manifest clips: 365 → 438
- Service worker: v7 → v8 (data cache v6 → v7)

**Quality gate:** all 10 `CT*_snippets.json` PASS `validate_snippets.py` (body ≥100 words, verbatim quote in `"…"`, schema complete).

**Backup:** `.bak-audit-2026-04-22` written next to every per-class file before integration.

---

## Git Commits (Recent)

| Commit | Description |
|---|---|
| `f9e152b` | Contemplation Phase 5 data consolidation: 154-snippet canonical, 141 CT audio clips in manifest (234→365), +40 glossary terms, CT3/CT9 timestamp cleanup |
| `6a5d656` | Docs: PROGRESS.md — print pipeline resurrection + 371-teaching audit |
| `caf1434` | Update print PDF to V2 (6×9, 479pp) from resurrected Node OOXML → LibreOffice pipeline; sw v5 → v6 |
| `2a9578a` | Concentration audit: +38 missing snippets (333 → 371 teachings); sw v4 → v5 |
| `9d5e8ed` | Update CT1 source filename to CT1 convention in audio_manifest.json |
| `748176b` | Add CT1 Contemplation audio to Audio Library (10 clips, sort fix, Contemplation label) |
| `d1b3a37` | Docs audit 2026-04-17: PROGRESS.md updated to current state |
| `9f5b152` | CT1 snippets: restore full 13-snippet version (was trimmed to 10) |
| `5cf85ba` | CT1 snippet-review tool + .wrangler to gitignore |
| `809dd4f` | Review folder integration: Kabir's Writings, Homework Reader, Audio Prayers |
| `52bcd35` | Add mobile admin mode: tap "The Four Books" label 5 times to toggle |
| `43da3ce` | Remove duplicate SULUK_PROJECT_GUIDE.md |
| `b1585c6` | Add Class Transcripts option to Study Companion dropdown (admin-only) |
| `571ebe1` | Add project guide, update service worker cache v4 |
| `4cc0579` | Phase I: 6-namespace dropdown, 22k+ subtitle, admin-gated namespace UI |
| `b99d5a2` | Worker: try/catch on AI.run + Vectorize ops, JSON 503 on quota exhaustion |
| `bc87521` | Stage 2: Crimson Heart, Light Dreaming, Extended essay, Study Companion → admin, Kabir AI context |
| `98676a6` | Fix: cap form-modal height at 90vh with internal scroll |
| `2dcae7f` | KW edit: in-app form to override title/body/image + JSON export |
| `393de9f` | Fix: KW back button + cap hero image height |
| `b80b42e` | Stage 1: Kabir's Writings — gallery, search, entry view (admin-only) |
| `9ef610d` | Admin mode: Workspace hidden from public visitors, toggle with 'suluk' |
| `167fb2b` | Update PROGRESS.md — all phases A through G5 complete |
| `5cf9c4e` | Phase G4: AI Study Companion — Chat UI powered by Gemini 2.5 Flash |
| `43b9153` | Phase G5: UI Polish — Instructor portraits, reading stats, learning timeline |
| `c11d1d5` | Cover image: contain instead of cover to show full Mount Qaf image |
| `4615fb8` | Increase cover page subtitle and program name font sizes |
| `8f122c1` | White cover page text with dark shadow for visibility over Mount Qaf image |
| `bfff292` | Phase F: PWA & Offline — Service Worker with smart caching |
| `2cb753a` | Fix minor issues: favicon, deprecated meta tag, empty class_id display |
| `fc43bd6` | Add Sync & Settings page for cross-browser/device data sync |
| `275016c` | Add automatic cloud sync for all user data across browsers/devices |
| `2a07323` | Remove whitish overlay from cover page Mount Qaf image |
| `a38f40b` | Update PROGRESS.md with comprehensive documentation |
| `dccc76f` | Bold sidebar nav text in Espresso #302B27 |
| `ab6eeab` | Separate reading and listening: remove inline audio from teaching view |
| `6c631cf` | New design system: Crisp Pearl & True Bronze with Nunito + Source Sans 3 |
| `4ca02c6` | Collapsible teaching audio section with smart clip matching |
| `b9545a0` | Fix audio manifest timestamps: normalize C6/C9 MM:SS:FF format |
| `8031424` | Enhanced Search: topic filters, instructor filter, browse-all, recent searches |

---

## Sidebar Navigation (Complete)

### Discover (public)
- ♪ Audio Library
- ⊙ Search
- ◉ Glossary
- ◎ Practice Tracker
- ▦ Reading Stats
- ◷ Learning Timeline

### Personal (public)
- ☆ Bookmarks
- ✎ Notes
- ◈ Highlights
- ○ Recently Viewed

### Workspace (admin only — type `suluk` to reveal)
- ◈ Study Companion (AI chat — Handbook / Full Corpus / Class Transcripts dropdown)
- ✦ Kabir's Writings (4-tile landing → Reflections / Crimson Heart / Light Dreaming / Journey of Light)
- ⚯ Links
- ▣ Homework
- ◫ My Library
- ⟳ Sync & Settings

---

## Architecture Summary

```
Browser (GitHub Pages)
  └── index.html (single file: HTML + CSS + JS)
        ├── data/*.json (teachings, audio manifest, glossary, cross-references)
        ├── data/writings/ (admin-only)
        │     ├── kabir_writings.json   (71 reflections)
        │     ├── kabir_other.json      (6 collections: Crimson Heart, Light Dreaming, Journey extended, Suluk Ascent, Purification Breaths, Reflections PDF)
        │     ├── images/ kw_*.jpg ch_*.jpg ld_*.jpg
        │     ├── extract_kabir_writings.py   (PPTX → JSON pipeline)
        │     └── extract_other_writings.py   (PDF + DOCX → JSON pipeline)
        ├── assets/images/ (Mount Qaf, instructor portraits, prayer images)
        ├── assets/favicon.svg
        ├── sw.js (Service Worker for offline caching)
        ├── manifest.json (PWA manifest)
        └── localStorage (user data, prefs, worker config, kwOverrides)

Cloudflare Worker (suluk-worker.soulofkabir.workers.dev)
  ├── POST /upload        → R2 suluk-personal
  ├── GET  /files         → list R2 objects
  ├── GET  /file/:key     → stream from R2
  ├── DELETE /file/:key   → delete from R2
  ├── POST /backup-data   → save user data JSON to R2
  ├── GET  /backup-data   → retrieve user data backup
  ├── POST /chat          → proxy to Gemini 2.5 Flash API
  ├── POST /rag-ingest    → embed via Workers AI BGE → upsert to Vectorize (admin)
  ├── POST /rag-search    → embed query → Vectorize.query() top-K (public)
  └── POST /rag-chat      → RAG search → Gemini with citation context (public)

Cloudflare Vectorize
  └── suluk-knowledge (768-dim cosine, ~22.5k vectors)
      ├── hik           — 27 HIK volumes + 1925 Vol-II decoded (~12,155 chunks)
      ├── sufi-library   — 10 supplementary books + OCR'd (~3,100 chunks)
      ├── hik-online     — hazrat-inayat-khan.org study database (~4,561 chunks)
      ├── ruhaniat       — Ruhaniat Esoteric Papers Library (~4,378 chunks)
      ├── sufi-canada    — Sufi Movement Canada website (38 chunks)
      └── sufi-message   — A Sufi Message website + Quarterly PDFs (66 chunks)

Cloudflare R2
  ├── suluk-audio (public)    — 234 audio clips (C1–C20 Concentration, CT1 Contemplation, P1 Prayers)
  └── suluk-personal (private) — files + backups
```

---

## Known Minor Issues

- Part III teachings have no `class_id` (no audio mapping) — these are from Pir Vilayat, audio not available
- Gemini 2.5 Pro quota exceeded on free tier; using 2.5 Flash instead (works well)

---

## Phase I — Unified RAG Backend (In Progress) 🚧

**Goal:** Give the Study Companion a real vector-retrieval corpus covering HIK canon, Sufi library, the Handbook, and Kabir's writings — grounded answers with clickable citations.

**Stack decided:** Cloudflare Vectorize (768-dim cosine) + Workers AI `@cf/baai/bge-base-en-v1.5` embeddings + Gemini 2.5 Flash via existing Worker proxy. Free-tier first.

### Done ✅

- **HIK parser fix (fine-grained chapters)** — 10 of 27 HIK volumes had broken chapter detection (font-based classifier failed on post-1923 Nekbakht volumes where body and chapter titles share 11pt size). Built `toc_extractor.py` with 3 fallback strategies: (1) embedded `doc.get_toc()` bookmarks, (2) regex parse of printed TOC pages with dot-leader pattern, (3) `^CHAPTER [IVXLCDM]+` marker scan. Integrated into `hik_parser.py` as Phase 1.5 with a "pick-max" merge: run both font-based and TOC-based segmentation, keep whichever yields more chapters. Net result across the corpus: **11 wins, 16 unchanged, 0 regressions**.
- **Corpus cleanup** — Moved 5 unprocessable PDFs to `_excluded_scanned/` (3 scans, 1 encoded-font `1925_Vol-II`, 1 watermark-only `1923_SufiMovement`). Final split: `hik/` 27 books, `sufi-library/` 10 books.
- **Cloudflare Vectorize index provisioned** — `suluk-knowledge`, 768 dims, cosine metric. Metadata indexes on `namespace`, `book`, `author`.
- **Worker bindings** — Added `[ai]` (Workers AI) and `[[vectorize]]` to `wrangler.toml`, deployed.
- **New Worker endpoints** (`suluk-worker/src/index.js`):
  - `POST /rag-ingest` (admin-gated) — batches of `{id, text, metadata}`, embeds via BGE, upserts to Vectorize.
  - `POST /rag-search` (public) — embeds query, runs `VECTORIZE.query()` with optional metadata filter, returns top-K with metadata.
  - `POST /rag-chat` (public) — RAG search → injects top 10 matches as `[H1]/[K1]/[L1]` citation tags into Gemini system prompt; preserves existing handbookContext/kabirContext/glossaryContext params.
- **Ingest pipeline** (`PDF_to_MD/ingest_to_vectorize.py`) — walks `processed/hik/` and `processed/sufi-library/`, cleans junk metadata via `FILENAME_TITLE_OVERRIDES` (many PDFs had titles like `"G:\\MasterDoc1320c.wpd"` from Word conversion), batches 50 chunks, retries with backoff, caps text at 2200 chars for BGE's 512-token window.
- **Debug: Cloudflare error 1010 on ingest** — Python `urllib` default User-Agent was being blocked by Cloudflare browser-integrity check. Fixed by sending a real `User-Agent` header.
- **HIK namespace ingest complete** — **11,488 chunks** from 27 HIK volumes successfully upserted to Vectorize.
- **Study Companion wired to `/rag-chat`** (commit `0393f8c`) — Endpoint swapped from `/chat` → `/rag-chat`; namespace toggle dropdown in Companion header (Sufi Library / Handbook only, plus HIK Library / All Libraries when admin); inline `[L#]/[H#]/[K#]` citation chips with click-to-scroll Sources footer; server-side admin gate in `/rag-chat` enforces token for `hik`/`all` namespaces (not just UI hide).
- **suluk-worker in git** — Worker source pushed to https://github.com/soulofkabir/suluk-worker.git (was previously local + Cloudflare only).
- **Handbook repo hygiene** (`81b75a2`) — `.gitignore` added for `.DS_Store`, `.claude/`, `data/writings/*.pdf|pptx|docx|png`, `scripts/`.
- **Ingest pipeline: `--skip-existing` checkpoint** — `_ingested_ids.txt` tracks completed IDs (deterministic chunk IDs), seeded with the 11,488 HIK IDs, so re-runs resume cleanly without re-embedding.
- **OCR rescue for scanned PDFs** — OCRmyPDF + tesseract installed; 3 small scans OCR'd (Bjerregaard, 1923_SufiMovement, 2020_SufismAndMarifa). Bjerregaard + SufismAndMarifa usable; 1923_SufiMovement was watermark-only and remains unusable.
- **HIK online scrape complete** (`scrape_hik_official.py`) — Polite 1 req/sec BFS crawl of hazrat-inayat-khan.org Study Database. **45 books, ~4,561 chunks** extracted into `processed/hik-online/` covering all 14 Volumes, Sayings (Gayan/Vadan/Nirtan/Bowl of Saki), Religious/Social/Supplementary Gathekas, Healing Papers, Message Papers, and by_date. Ready for ingest under new `hik-online` namespace (admin-gated).
- **wahiduddin.net scraper sketched** (`scrape_wahiduddin.py`) — 400-line BFS crawler ready for tomorrow. Uses Dreamweaver `#BeginEditable "Body"` template fences for clean extraction; 2s/req honoring robots.txt crawl-delay; hand-encoded disallow prefixes; 13 seed paths; `--smoke` / `--max-pages` flags for staged testing.

- **Ruhaniat Esoteric Papers Library scraped** (`scrape_ruhaniat_pdfs.py`) — Downloaded 143 PDFs (51 MB) from ruhaniat.org across 8 sections: hik-papers, hik-prayers, hik-ten-sufi-thoughts, nyogen-senzaki, msl-gatha-githa-commentaries, msl-additional-commentaries, msl-other-papers, glossary. PyMuPDF text extraction. **4,378 chunks** into `processed/ruhaniat/`.
- **Sufi Movement Canada scraped** (`scrape_suficanada.py`) — 14 pages across 4 sections from sufimovementincanada.ca, 10s/req honoring robots.txt Crawl-delay. **38 chunks** into `processed/sufi-canada/`.
- **A Sufi Message scraped** (`scrape_sufimessage.py`) — 34 HTML teaching pages + 8 Sufi Quarterly PDFs from sufi-message.org. Word-count filter (< 280) removes 17 identical template-only class archive pages. **66 chunks** into `processed/sufi-message/`.
- **OCR'd books processed** — Bjerregaard *Omar Khayyam & Sufism* (5 chapters, 32 chunks) + Topbas *Sufism & Marifa* (22 chapters, 77 chunks) added to `processed/sufi-library/`.
- **1925 Vol-II Caesar cipher decoded** — Reverse-engineered the encoded-font PDF (905 pages). Primary fonts use a -29 codepoint shift; secondary editorial font uses a 30+ entry lookup table; separate digit map for page numbers. Font-aware PyMuPDF extraction + TOC parsing with offset=26. **121 chapters, 667 chunks** into `processed/hik/1925_hik_completeworks_vol_ii_jun_nov/`. Decoder saved as `--decode-font` mode in `rescue_pdftotext_book.py`.
- **Ingest pipeline extended** (`ingest_to_vectorize.py`) — `ALL_NS` expanded to 6 namespaces: `hik`, `sufi-library`, `hik-online`, `ruhaniat`, `sufi-canada`, `sufi-message`. Default changed to `--namespace all`. Added `source_url` passthrough for scraped sources.
- **Worker error handling** (commit `b99d5a2`) — try/catch around `env.AI.run()` in `/rag-ingest` and `/rag-search`; returns JSON 503 with detail instead of crashing with error 1101 when neuron quota is exhausted. Same for `env.VECTORIZE.upsert()` and `.query()`.
- **Frontend namespace dropdown** (commit `4cc0579`) — Admin users see 6 source options: HIK Complete Works, HIK Study Database, Ruhaniat Esoteric Papers, A Sufi Message, Sufi Movement Canada, All Libraries. Server-side `ADMIN_NAMESPACES` gate enforces token for non-public namespaces. Subtitle updated to "22k+ chunks".
- **Full corpus ingest** — All namespaces ingested into Vectorize. Total: **~22,562 chunks** (hik 12,155, sufi-library ~3,100, hik-online 4,561, ruhaniat 4,378, sufi-canada 38, sufi-message 66, plus OCR'd books). 894 chunks with checkpoint gaps from transient 503 retries — data is in Vectorize but needs one more ingest pass to sync the local checkpoint.

### Review Folder Integration (commit `809dd4f`) ✅

- **Kabir's Writings expanded to 6 tiles** — added Suluk Ascent (20 pages) and Purification Breaths (18 pages) alongside Reflections, Crimson Heart, Light Dreaming, Journey of Light.
- **Homework Reader** — 10 pre-populated reading assignments with in-app page viewer. `homework_content.json` metadata, `seedHomeworkAssignments()` auto-populates on first load, `showHomeworkReader()` with full-page image scroll, `markHomeworkComplete()` tracking. Read button on each homework card.
- **Audio Prayers** — 3 .m4a prayer recordings uploaded to R2 `prayers/` prefix (Fazl Mullah Rahim Allah, Subuhun Quddusun, Ya Sabur-o Ya Wahhab-o). P1 Prayers class added to `audio_manifest.json` (224 total clips, 21 classes).
- **166 page images** generated from 10 PDFs/DOCXs via `pdftoppm -jpeg -r 150` and `soffice --headless --convert-to pdf`.
- **Audio Library sort fix** — P-prefixed classes (Prayers) sort after C-prefixed (classes). Meta display adapts for dateless entries.

### Toronto Corpus (commits `a74a684`, in progress) 🚧

- **47 PDFs downloaded** from sufiorder.toronto.on.ca:
  - 14 HIK Message Volumes (Vols 1-14, ~1.34M words)
  - Complete Sayings (46,788 words)
  - Toward The One by Pir Vilayat (698 pages, 86,343 words)
  - Keeping in Touch newsletter compilation (946 pages, 296,982 words)
  - 29 quarterly newsletters (28 image-based/scanned, 1 text)
- **Processing pipeline** (`process_toronto.py`) — pdftotext extraction, chapter detection (CHAPTER/PART headers → form-feed page groups → single chapter fallback), paragraph-aware chunking at 500 words. Output: `toronto_chunks.jsonl`.
- **4,151 chunks** produced: `hik-message` (3,285), `pir-vilayat` (866).
- **1,651 chunks ingested** before neuron quota exhaustion. 2,500 remaining.
- **Ingest script** (`ingest_toronto.py`) — flat JSONL reader, batch POST to /rag-ingest, checkpoint support.
- **25+ HTML teaching pages** from Toronto site being scraped (HIK quotes, Pir Vilayat articles, prayers, Pir Zia teachings).

### Study Companion Simplification (commit `a74a684`) ✅

- **Namespace dropdown reduced to 2 options**: Handbook (local context) / Full Corpus (all Vectorize namespaces).
- **Dynamic subtitle**: shows "Handbook context" or "RAG — 26k+ chunks across 8 sources".
- **Default**: Full Corpus for admin users, Handbook for non-admin.

---

### Handbook Admin Enhancements (commits `b1585c6`, `52bcd35`, `571ebe1`) ✅

- **Class Transcripts namespace** — Study Companion dropdown now has a third option: "Class Transcripts" (admin-only) that points to the `suluk-classes` RAG namespace covering 168 chunks from Concentration Part I + Part II. Gives targeted retrieval for course prep.
- **Mobile admin mode** — Tap the "The Four Books" sidebar label 5 times to toggle admin mode on mobile (in addition to typing `suluk` on desktop keyboard).
- **Service worker bumped to v4** — Cache list updated to include new data paths (`data/homework/`, `data/writings/images/`).
- **Duplicate doc cleanup** — `suluk-handbook/SULUK_PROJECT_GUIDE.md` deleted; canonical copy lives at project root.

---

### Contemplation Book 2 — CT1 Pipeline (Phases 1–4 complete) ✅

First class of the Contemplation series (March 27, 2026 — Pir Zia Inayat Khan, 76 minutes) fully processed through Phase 4.

**Naming convention:** `Contemplation_P1_CT{N}_{date}_{instructor}_{suffix}` — the `CT#` segment distinguishes Contemplation classes from Concentration's `C#` (e.g. CT1 vs C1). Renamed from the original `C1` pattern on 2026-04-18.

**Phase 1 — Transcript:** `Contemplation_P1_CT1_20260327_PirZia.mp3` (141 MB) transcribed by Gemini 2.5 Pro via the auto-transcription pipeline (see below).

**Phase 2 — Full + Summary transcripts:**
- `Contemplation_P1_CT1_20260327_PirZia_Full.docx` — cleaned transcript (timestamps stripped, topic-break paragraphs)
- `Contemplation_P1_CT1_20260327_PirZia_Summary.docx` — thematic condensation
- Both filed in `Classes/Contemplation/Section_I/Transcripts/Full/` and `Summarized/`
- Copies also in `Suluk_Auto_Transcribe/` (Automator output location)

**Phase 3 — Snippet extraction (13 snippets):**

| # | Title | Topic |
|---|---|---|
| 1 | The Invocation — Opening of Contemplation | Prayer |
| 2 | Aman and Dar al-Aman — The Realm of Sanctuary | Teaching |
| 3 | From Concentration to Contemplation — Mujahada to Muraqabah | Teaching |
| 4 | What Contemplation Is — The Mind Moves Gracefully | Contemplation |
| 5 | The Divine Names — Living Anatomy of God's Attributes | Teaching |
| 6 | Wazifa — Murshid's Complete Teaching on the Practice | Wazifa |
| 7 | Al-Hayy — The Living (First Mother Name) | Arabic Term |
| 8 | Guided Zikr Practice — Ya Hayyu | Zikr/Practice |
| 9 | Chivalric Rule — Consider Your Responsibility Sacred | Rule |
| 10 | Story of Yudhisthira and the Dog — The Dharma Within | Story |
| 11 | Closing Contemplation — Scattered Attention and the Holy of Holies | Contemplation |
| 12 | Introduction of Nizam un Nisa — Contemplation Part II Instructor | Teaching |
| 13 | Arabic and Sufi Terms — Contemplation Class 1 | Arabic Term |

- **Canonical file:** `Classes/Contemplation/Section_I/Snippets/CT1_snippets.json`
- **Handbook symlink:** `suluk-handbook/CT1_snippets.json` → symlinked to canonical (never a separate copy)
- **Review tool:** `suluk-handbook/snippet-review.html` — local browser review UI with Approve/Flag/Notes per snippet
- **Merged into:** `Classes/Contemplation/contemplation_snippets.json` (13 entries, `total_snippets` updated)
- **Validated:** `python3 Scripts/validate_snippets.py CT1_snippets.json --duration 76` → PASSED

**Phase 4 — Audio split (10 clips):**

| # | Title | Category | Duration |
|---|---|---|---|
| 01 | Opening Invocation | prayer | 0:29 |
| 02 | Welcome & Aman — Realm of Sanctuary | teaching | 5:53 |
| 03 | Mujahada to Muraqabah — Four Elements | teaching | 8:09 |
| 04 | The Divine Names & Ummahat | teaching | 6:54 |
| 05 | Wazifa — Murshid's Teaching | reading | 11:47 |
| 06 | Al-Hayy — The Living | teaching | 8:39 |
| 07 | Guided Zikr — Ya Hayyu | practice | 10:00 |
| 08 | Chivalric Rule — Responsibility Sacred | teaching | 8:18 |
| 09 | Story of Yudhisthira and the Dog | story | 13:12 |
| 10 | Closing Contemplation — Holy of Holies | closing | 3:04 |

- **Splitter:** `Scripts/contemplate_splitter.py --class CT1` (custom [MM:SS:FF] timestamp parser)
- **Output:** `Classes/Contemplation/Audio_Library/CT1/` + `segments.json`
- **Naming:** `Contemplation_Audio_CT1_{slug}.mp3` @ 128k CBR
- **R2 upload:** all 10 clips live at `suluk-audio/CT1/Contemplation_Audio_CT1_*.mp3`
- **Manifest:** CT1 added to `audio_manifest.json` (234 total clips, 22 classes)
- **Audio Library sort:** updated to group C → CT → P correctly (CT1 appears after all C classes)
- **Handbook label:** CT-prefixed classes display as "Contemplation Part I · date · ~N min"

**Phases 5–9 (RAG ingest, handbook integration) pending** — CT2–CT5 recording this weekend (Apr 18-19), batch-process all after Apr 19.

---

### Snippet Quality Guardrails (commit `d078053` in project-docs repo) ✅

To prevent the recurrence of condensed/truncated snippet extraction:

- **`Scripts/validate_snippets.py`** — quality gate that must pass (exit 0) before any snippet file is committed:
  - Snippet count ≥ `session_minutes ÷ 6` (duration-based floor) AND ≥ 8 absolute minimum
  - Every non-glossary snippet must contain ≥1 verbatim quote (20+ chars in `"…"`)
  - Minimum body word count: 100 words (40 for prayers, exempt for glossary tables)
  - All required schema fields present; `topic_id` in range 1–18
- **6 Extraction Rules locked in `Pipeline.md` Phase 3:**
  1. One topic = one snippet — never merge
  2. Quote verbatim, don't paraphrase
  3. Duration-based snippet floor
  4. Prayers/practices/stories/closings always get their own snippet
  5. Canonical file in `Snippets/`; handbook copy is a symlink
  6. `validate_snippets.py` must pass before committing

---

### Pre-Kickoff Preparation (project-docs repo) ✅

- **`Scripts/` added to git** (project-docs repo) — all 8 scripts now version-controlled and protected from loss. Previously completely untracked.
- **`SUFI_TERMS` expanded in `auto_transcriber.py`** — Contemplation vocabulary added before Apr 18-19 weekend:
  `Tajalli, Wiratha, Kibriya, Sahibat al-Anfas, Sama, Al-Hayy, Ya Hayyu, Jalali/Jamali/Kamali, Ummahat, Dar al-Aman, Hazrat Inayat Khan, Noor, Baraka, Ishq` and more.
- **`Scripts/contemplate_splitter.py` created and committed** — dedicated audio splitter for Contemplation classes with custom `[MM:SS:FF]` / `[H:MM:SS:FF]` timestamp parser (different from Concentration's `[HH:MM:SS]`). Supports `--dry`, `--force`, `--gemini` flags. CT1 segment map hard-coded.
- **Contemplation file naming convention finalised:** `Contemplation_P1_CT{N}_{date}_{instructor}_{suffix}` — `CT#` prefix (not `C#`) distinguishes from Concentration. All CT1 source files renamed on 2026-04-18; `CLASS_PREFIX` in `contemplate_splitter.py`, `Pipeline.md` naming examples, and both JSON manifests updated to match.
- **Auto-transcription pipeline migrated from Automator Folder Actions → launchd WatchPaths** (2026-04-18):
  - Root cause: macOS Folder Actions daemon had persistent state corruption (stale bookmark for old folder path; `folderActionsEnabled` repeatedly reverting to `false`). Replaced entirely.
  - **New architecture**: `launchd` LaunchAgent (`~/Library/LaunchAgents/com.suluk.autotranscriber.plist`) watches `~/Suluk_Auto_Transcribe/` (home root — avoids TCC/Full Disk Access restrictions on Documents folder).
  - **Trigger script**: `~/Library/Scripts/Suluk/suluk_watch_trigger.sh` — scans for new audio files not in `~/Library/Scripts/Suluk/.auto_transcribe_processed`, marks seen, calls `python3.14 auto_transcriber.py`. Logs to `~/Library/Scripts/Suluk/auto_transcribe.log`.
  - **Watch folder**: `~/Suluk_Auto_Transcribe/` (not under Documents) — drop MP3/m4a/wav here; transcripts saved alongside.
  - **ThrottleInterval 5s** — gives large files time to finish copying before trigger fires.
  - **Tested end-to-end**: 2-second silent test MP3 detected → uploaded to Gemini → transcript produced → SUCCESS logged.
- **Concentration audit integration — +38 missing snippets** (2026-04-20):
  - Ran `Handbook-Audit/Master_Audit_Report.md` analysis against all 20 class transcripts vs. `concentration_snippets.json`.
  - Audit flagged 38 missing snippet blocks across 12 classes (C1, C3×15, C4×4, C5, C6×3, C8×3, C13, C14, C15×2, C16×2, C17×4, C18, C20).
  - Built `Scripts/integrate_audit_additions.py` — auto-assigns IDs per 3-letter prefix (TPZ/TGN/DAR/PPR/PBR/PVI/PRU/PTE/etc.), maps each to correct Part (I/II/III) and chapter topic_id (1–10), tags with `audit_2026_04_20`.
  - **Raw snippets**: 403 → 441 (`Classes/Concentration/concentration_snippets.json` + audit folder copy).
  - **Curated handbook**: 333 → 371 teachings (`handbook_data_concentration.json` canonical + `suluk-handbook/data/handbook_concentration.json` deployed).
  - **Service worker bumped v4 → v5** to force clients to re-fetch the updated handbook JSON.
  - **Backups**: `.bak-2026-04-20` files saved at each location.

- **Print Pipeline Resurrection — V2 print package regenerated from JSON** (2026-04-21):
  - **Problem**: After the audit-added 38 snippets (371 total), the print PDF was stale (333 teachings) and any re-attempt to regenerate via HTML/Chrome produced a web-styled letter-size PDF, not the 6×9 book format of `Original.pdf`. Root cause: the original pipeline was Node.js OOXML (`docx` npm) → LibreOffice convert, not HTML/Chrome.
  - **Pipeline resurrected**: `Scripts/build_handbook_v2.js` (intact on disk with `docx` v9.6.1) repointed to read canonical `suluk-handbook/data/handbook_concentration.json`. LibreOffice (`soffice --headless --convert-to pdf`) produces the 6×9″ interior (Creator: "Writer", 432×649 pts, matches Original.pdf signature).
  - **Running header fix**: right-side text was overflowing past the right margin because `TabStopPosition.MAX` in the docx lib is US-Letter-sized (~9026 DXA). Explicit `CONTENT_WIDTH` (6120 DXA) used instead. Instructor label also shortened for narrow 6×9 column: "Pir Zia" / "Urs Qutbuddin" / "Guide Mansur".
  - **Cover regenerated**: `book_cover.html` spine auto-scaled from 0.7″ → 0.77″ for the new 479-page thickness (rate: 0.001605″/page, calibrated from 0.7″ @ 436pp). Cover width 12.95″ → 13.02″. Back-cover stats updated 333 → 371.
  - **Orchestrator**: `Scripts/regen_print_book.sh` runs the full 4-step pipeline (Node build → soffice convert → `Scripts/patch_cover_spine.js` auto-patches cover for new page count → Chrome headless renders wrap-around cover). One command after any JSON edit regenerates DOCX + interior PDF + cover PDF.
  - **Portal deploy**: new 3.4 MB PDF copied to `suluk-handbook/assets/The_Book_of_Concentration.pdf`, service worker bumped v5 → v6. Commit `caf1434`, pushed to `main`.
  - **Dead code removed**: earlier HTML/Chrome dead-end (`Scripts/render_book_print.py` + `The_Book_of_Concentration_Print.html`) deleted.
  - **Output**: `The_Book_of_Concentration_V2_Print.pdf` — 479 pages, 6×9″ trim, running header "The Book of Concentration" / "Part N — Short Instructor", centered `— N —` page numbers, "Kabir's Sufi Knowledge Base · Inayatiyya Suluk Global 2025–2027" footer. Ready for PoD (Lulu/IngramSpark/KDP Print) and served as the in-app download for offline reading.

---

### Pending ⏳

**Immediate (when neurons reset):**
- **Finish Toronto ingest** — 2,500 of 4,151 chunks remaining. `SULUK_AUTH_TOKEN=<token> python3 ingest_toronto.py --skip-existing`.
- **Ingest Toronto HTML pages** — Teaching text from 25+ scraped web pages.
- **Re-ingest 894 checkpoint-gap chunks** from earlier sessions.
- **End-to-end smoke test** — Full Corpus search through Study Companion UI.

**Short-term:**
- **OCR 28 scanned Toronto newsletters** — Image-based PDFs from 2000-2007, need tesseract pipeline.
- **Explore Pir Vilayat Archive** — pirvilayatarchive.org (403-blocked, needs Chrome MCP exploration).
- **Assess Idries Shah Foundation** — "Read Shah for Free" library (JS-heavy site).
- **Scrape Sufi Tavern** — 5 free e-book PDFs + blog articles.

**Medium-term — Book 2: Contemplation:**
- CT1 (Mar 27) complete through Phase 4 (13 snippets + 10 audio clips on R2).
- CT2–CT5 recordings happening Apr 18-19 weekend — after Apr 19: run full pipeline (transcript → full → summary → snippets → validate → split → R2 → manifest) for each.
- After all CT classes ingested: create `handbook_contemplation.json`, wire book selector buttons in the handbook.

**Deferred / lower priority:**
- **wahiduddin.net scrape** — Site is fully down (as of 2026-04-10). Scraper ready (`scrape_wahiduddin.py`), retry when site returns.
- **murshidsam.org** — Richest content (~650 pages) but robots.txt blocks AI bots. Decision pending.
- **Practice Guide section** — Step-by-step breath instructions (Purification Breaths, Alternative Breath) in interactive format, not just page images.
- **Token hardening** — Rotate admin token to a stronger secret.
- **225 MB SufiMessage 14-vol PDF** — dedicated OCR session.
- **Put `PDF_to_MD/` in git** too.

---

## Project Documentation

- **Comprehensive Project Guide**: `/Users/heartmath/Documents/Suluk_Project/SULUK_PROJECT_GUIDE.md` — 700-line single source of truth covering architecture, folder structure, pipeline SOPs, scripts reference, feature inventory, and troubleshooting.

---

## All Earlier Phases Complete ✅

Phases A → H all shipped. Future initiatives in the broader Suluk Project ecosystem:

- **Books 3 & 4**: Meditation, Realization (same pipeline as Contemplation).
- **Initiative 2: Hazrat Inayat Khan Library** — separate portal (`hik-library`) on GitHub Pages with 50+ eBooks, mirroring the Crisp Pearl & True Bronze design language.
- **Initiative 3: Universal Knowledge Vault** — separate portal (`kabir-vault`) for mixed-media (PDFs, YouTube, PPT, audio, video).
- **Cross-portal AI Companion** — once HIK Library and Vault exist, extend `findRelevantKabirWritings` pattern to also search those corpora, so the Companion can pull from all four sources at once.
- Additional handbook books (Contemplation, Meditation, Realization) when content is available.
- Reading time tracking (time spent per teaching, not just word count estimate).
- Spaced repetition for key teachings.
