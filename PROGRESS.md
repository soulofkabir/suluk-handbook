# Suluk Digital Handbook — Development Progress

**Project:** Suluk Academy Personal Learning Companion
**URL:** https://soulofkabir.github.io/suluk-handbook/
**Architecture:** Single-file HTML + CSS + Vanilla JavaScript, GitHub Pages static hosting
**Data:** `data/handbook_concentration.json`, `data/cross_reference_data.json`

---

## Phase A — Foundation & Shell

**Goal:** Establish the project skeleton, animated cover, and core UI chrome.

### Completed

- **Project scaffold** — Single `index.html` with embedded CSS and JavaScript, `manifest.json`, `service-worker.js` for PWA structure, `/assets/images/` folder with all images from old handbook
- **Animated cover page** — Full-screen opening screen with background image (`mount_qaf.JPG`), CSS keyframe animations (`fadeUp`, `fadeIn`, `bgReveal`), title/subtitle fade-in, "Enter the Handbook" button
- **Design system** — CSS custom properties (`:root` variables) for all colors, fonts, spacing, and transitions; EB Garamond + Cormorant Garamond serif fonts via Google Fonts
- **Two-panel layout** — Fixed 320px sidebar + scrollable main content area, responsive mobile collapse
- **Sidebar navigation** — Header with handbook title, nav list built dynamically via `buildSidebarNav()`, part/chapter hierarchy with collapsible sections
- **Night / Day mode toggle** — Moon/sun icon button in header; `body.night-mode` class toggles all color variables; preference saved to `localStorage`
- **Font size controls** — A− / A+ buttons; `--font-base` CSS variable adjusted 14px–24px range; preference persisted
- **Reading progress bar** — Thin gold strip at top of viewport, width driven by scroll position
- **URL deep linking** — Hash-based navigation (`#t42`) so any teaching can be bookmarked directly; `history.replaceState` keeps URL clean while reading

---

## Phase B — Content Layer (333 Teachings)

**Goal:** Load and render the full handbook content dynamically from JSON.

### Completed

- **JSON data pipeline** — `fetch('data/handbook_concentration.json')` on load; data structure: `{ parts: [{ title, chapters: [{ title, snippets: [{ id, title, body }] }] }] }`
- **Dynamic sidebar nav** — Three Parts (I, II, III) → 26 Chapters → individual teachings; Part toggles collapse/expand; active state tracking with gold left-border highlight
- **Teaching renderer** — `showTeaching(id)` displays title, chapter/part breadcrumb, body text with full Markdown rendering; smooth scroll to top on navigation
- **Custom Markdown parser** — `parseMarkdown()` handles headings (H1–H4), bold/italic/underline inline styles, blockquotes, ordered/unordered lists, horizontal rules, tables; `buildTable()` for pipe-separated tables
- **Chapter view** — `showChapter(partIdx, chapterIdx)` renders chapter title + all snippets in sequence as continuous reading
- **Part view** — `showPart(partIdx)` renders part intro + all chapters
- **Keyboard navigation** — Left/right arrow keys move between teachings; `Escape` closes modals
- **Recently Viewed auto-tracking** — Every `showTeaching()` call logs to `suluk_user_data.recentlyViewed` in `localStorage` (capped at 20 entries with timestamps)

---

## Phase C — Personal Learning Layer

**Goal:** Let the reader annotate, save, and export their engagement with the text.

### Completed

- **Bookmarks** — Star icon on every teaching; `suluk_user_data.bookmarks` array stores `{ id, title, chapterTitle, date }`; bookmarks panel in sidebar lists all saved items with click-to-navigate and delete; bookmark count badge on nav item
- **Notes** — Note icon on every teaching; modal with textarea + note type selector (Reflection, Question, Practice, Insight); notes stored with teaching reference, chapter, date; notes panel lists all notes with full metadata
- **Text Highlights** — Select any passage and press the highlight toolbar that appears; highlights saved as `{ teachingId, text, color, date }` in `localStorage`; yellow marks re-applied on re-render
- **Journal** — Dedicated journal section in sidebar; full-page journal entry editor with date stamp and current teaching reference pre-filled; entries listed chronologically
- **Recently Viewed panel** — Sidebar nav item "Recently Viewed" shows last 20 teachings with timestamps and direct navigation
- **Export** — "Export My Data" button in sidebar; generates JSON file containing all bookmarks, notes, highlights, and journal entries; downloads as `suluk-handbook-data.json`
- **Data persistence** — All user data in single `suluk_user_data` object in `localStorage`; survives page refresh, browser restart

---

## Color & Visual Theme Overhaul

**Goal:** Match the exact cream/indigo/gold palette and typography of the original Book of Concentration handbook.

### Completed

- **Palette extracted from original HTML** — Read the full 10,555-line source of `The_Book_of_Concentration.html` to obtain exact hex values used throughout
- **Light mode color variables updated:**
  ```
  --bg: #FDFCF9        (warm cream page background)
  --primary: #1A1A4E   (deep indigo for headings)
  --accent: #C4A35A    (gold for active states and highlights)
  --dark-gold: #8B7335 (deeper gold for decorative rules)
  --text: #2A2A2A      (near-black body text)
  --muted: #5C5C5C     (secondary text)
  --rule: #D4C9A8      (warm divider lines)
  --rose: #8B3A62      (rose for special callouts)
  ```
- **Sidebar light-mode overrides** — `body:not(.night-mode)` CSS block applies solid (non-transparent) colors so sidebar is crisp and readable:
  - Background: `#F5F3EE` (slightly warm off-white)
  - Right border: `1px solid #D4C9A8` (rule color, not gold)
  - Header bottom border: `2px solid #C4A35A` (gold accent)
  - Nav text: solid `#2A2A2A`
  - Active nav item: `#1A1A4E` with `rgba(26,26,78,0.06)` background tint
  - Part toggle headings: bold `#1A1A4E`
- **Typography** — EB Garamond 18px base, Cormorant Garamond for display headings; line height 1.8; content max-width 840px
- **Night mode preserved** — All overrides scoped to `body:not(.night-mode)` so dark mode is unaffected

---

## Full Book — Continuous Scroll Mode

**Goal:** Render the entire handbook as one long scrollable page, matching the structure and content of the original printed/web book.

### Completed

- **Sidebar nav entry** — "☰ Read Full Book" added to sidebar navigation list
- **Full Book CSS** — Dedicated CSS classes for every section: `.fb-title-page`, `.fb-dedication`, `.fb-toc`, `.fb-toc-chapter`, `.fb-appendix`, `.fb-pqr-*`, `.fb-xref-*`, `.fb-schedule-table`, `.fb-prayer-img`, `.fb-colophon`, etc.
- **Sticky back bar** — Fixed bar at top with "← Back to Handbook" button so reader can exit at any time

### Sections Rendered

**Front Matter**
- **Title Page** — Handbook title, subtitle, author (Pir Zia Inayat-Khan), organization (Inayatiyya Suluk Academy), decorative rule
- **Dedication** — Full dedication text as in original
- **Table of Contents** — Built dynamically from `handbookData`; three Parts with all chapter titles; each entry is a clickable anchor link that jumps to that section within the full book

**Introduction**
- Full introduction text (static, matches original)

**Main Content — 333 Teachings**
- All three Parts with decorative part dividers
- All 26 chapters with chapter headings
- All 333 individual teachings rendered with Markdown
- Chapter and part anchors for TOC deep links

**Appendices**

| Appendix | Title | Implementation |
|---|---|---|
| A | Class Schedule | Static 20-session table with dates and teaching topics |
| B | Cross-Reference Index | Async `fetch('data/cross_reference_data.json')`; renders topic clusters → entries → snippet citations |
| C | Practice Quick-Reference | 80 named practices in 6 categories; two-column card layout |
| D | Colophon | Publication information, copyright, acknowledgements |
| E | Prayer Movement Images | `saum_movements_1/2/3.png`, `salat_movements_1/2.png` with captions |

---

## Data Files

| File | Source | Purpose |
|---|---|---|
| `data/handbook_concentration.json` | Converted from old handbook | All 333 teachings, structured by Part/Chapter/Snippet |
| `data/cross_reference_data.json` | Copied from Suluk_Project source | Appendix B cross-reference topic index |
| `data/audio_manifest.json` | Built from 20 local segments.json files | 221 audio clips across 20 classes, with Cloudflare R2 URLs |
| `data/glossary.json` | Created manually | 40 Sufi/spiritual terms with origins and definitions |
| `assets/images/` | Copied from Suluk_Project/Images | All artwork: cover image, instructor portraits, prayer movement diagrams |

---

## Phase D — Audio Integration (Completed 2026-03-31)

**Goal:** Stream class audio recordings inline with teachings and via a dedicated Audio Library.

### Completed

- **Audio manifest** — `data/audio_manifest.json` with 221 clips across 20 classes (C1–C20), metadata includes segment number, title, filename, category, start/end times
- **Audio hosting** — All 219 MP3s uploaded to Cloudflare R2 bucket `suluk-audio` (public URL: `https://pub-655e0e7533694c53a63276368afd5e43.r2.dev`). 2 clips missing from source (C6_06, C9_04)
- **Audio Library page** — Sidebar nav entry "♪ Audio Library"; collapsible class cards showing instructor, date, duration, clip count; click-to-play individual clips
- **Persistent bottom audio bar** — Fixed bar with play/pause, progress seek, time display, skip forward/back, speed control (0.75×–2×), close button
- **Inline teaching audio** — Each teaching shows its class's audio clips below the body text
- **Playlist mode** — Flat playlist built from all 221 clips; auto-advances to next clip on end; skip buttons navigate the playlist
- **Error handling** — Toast messages for missing audio, play failures; graceful fallback for 2 missing clips

### Audio Hosting Journey
- Initially tried Google Drive (`uc?export=download` URLs) — files were public but Drive blocks streaming from third-party sites via referrer checks
- Extracted 219 file IDs via Google Apps Script → Google Sheet → CSV
- Switched to **Cloudflare R2** — direct `audio/mpeg` responses, no redirects, proper CORS, free 10GB tier

---

## Phase E — Practice & Intelligence (Completed 2026-03-31)

**Goal:** Add search, glossary, practice tracking, related teachings, and sharing.

### Completed

- **Full-text search** — Search across all 333 teachings; title matches weighted 10× vs body; filter by Part (I/II/III); results show title, chapter, and highlighted matching text
- **Glossary** — 40 Sufi/spiritual terms in `data/glossary.json`; dedicated glossary page with alphabet jump bar and search filter; inline tooltips on recognized terms within teaching text (uses TreeWalker/NodeFilter.SHOW_TEXT for injection)
- **Practice Tracker** — 24 practices across 6 categories; checkbox completion per day; streak counter; progress stats; data persisted in `localStorage` under `suluk_user_data.practiceLog`
- **Related Teachings** — Algorithm scores by same chapter (+5), same part (+2), title word overlap (+3); shows top 3 related teachings below each teaching
- **Share button** — Copies teaching title + direct URL to clipboard via navigator.clipboard API

---

## Git Commits (Chronological)

| Commit | Description |
|---|---|
| Initial | Project scaffold, cover page, shell |
| Phase A | Sidebar, layout, night mode, font controls |
| Phase B | JSON data loading, teaching renderer, Markdown parser |
| Phase C | Bookmarks, notes, highlights, journal, export |
| Color overhaul | Light sidebar matching old handbook palette (multiple iterations) |
| Full Book v1 | Continuous scroll mode (teachings only) |
| Full Book complete | All front matter + appendices A–E added; cross-reference JSON copied |
| `c907922` | Color theme overhaul rework — match old handbook exactly |
| `ddb9db5` | Phase E: Search, Glossary, Practice Tracker, Related, Share |
| `7ec895f` | Phase D: Audio Library, inline player, persistent bottom bar |
| `eacf8da` | Populate audio manifest with 219 Google Drive URLs |
| `086f10b` | Fix audio: build playlist on manifest load, add error handling |
| `f8ed56c` | Switch audio hosting from Google Drive to Cloudflare R2 |
| `79e9165` | Phase G1: Skip cover on refresh |
| `761a626` | Add PDF download link to sidebar |
| `d672876` | Phase G2: Links page and Homework tracker |
| `c514e04` | Inayatiyya-inspired color scheme: white bg, golden accents, no dark mode |
| `9284c54` | Phase G3: Personal Content Library UI |
| `6620361` | Fix escHtml bug in library |

---

## Phase G1 — Skip Cover & Compare Portals ✅

- **Skip cover on refresh** — `localStorage.suluk_entered` flag set on first entry; `DOMContentLoaded` checks flag and skips cover animation, shows app directly
- **PDF download** — Added "Download PDF" link in sidebar under Daily section, downloads `assets/The_Book_of_Concentration.pdf` (3.1 MB)
- **Portal comparison** — Verified digital handbook surpasses old `The_Book_of_Concentration.html` in all features (audio, search, bookmarks, notes, glossary, practice tracker, night mode)

---

## Phase G2 — Links & Homework ✅

- **Links page** — Sidebar nav "Links" under Workspace section; add/edit/delete links with title, URL, category, notes; filter by category; search; modal form overlay; data stored in `localStorage` under `userData.links`
- **Homework tracker** — Sidebar nav "Homework"; add assignments with title, class, description, due date; status cycling (not-started → in-progress → complete); progress stats bar; edit/delete; data in `userData.homework`

---

## Accessibility Color Scheme Overhaul ✅

- **Design inspiration:** Inayatiyya.org — pure white background, golden accent `#C69214`, EB Garamond font
- **Accessibility:** Designed for dyslexia/ASD — medium contrast, `line-height: 1.8`, no dark mode
- **Cover page:** White background with light translucent overlay on Mount Qaf image, golden title text
- **Night mode removed:** All CSS rules (~195 lines removed), JS functions, keyboard shortcut, toggle button
- **Sidebar:** `#FAFAFA` background, golden section labels, `#E3E5EB` border rules

---

## Phase G3 — Personal Content Library ✅

- **Cloudflare Worker** — `suluk-worker` deployed at `https://suluk-worker.soulofkabir.workers.dev`; handles upload, download, delete, list, backup; bearer token auth; CORS for GitHub Pages + localhost
- **Private R2 bucket** — `suluk-personal` for file storage (separate from public `suluk-audio`)
- **Library UI** — Sidebar nav "My Library" under Workspace; drag-and-drop + browse upload; category organization (Books, Notes, Presentations, Images, Homework, Other); grid view with thumbnails; file preview modal (images inline, PDFs in iframe, text rendered); download, edit, delete per file; cloud sync button; settings with connect/disconnect
- **Setup flow** — First-time setup prompts for Worker URL and auth token; Test Connection button validates credentials; config stored in `localStorage`
- **Worker source:** `/Users/heartmath/Documents/Suluk_Project/suluk-worker/`

---

## Phase F — Polish & PWA (Not Yet Started)

- Reading statistics (teachings read, time spent)
- Learning timeline visualization
- PWA offline mode (service worker caching)
- GitHub sync for user data backup
- Instructor portrait integration
