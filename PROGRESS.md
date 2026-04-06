# Suluk Digital Handbook — Development Progress

**Project:** Suluk Academy Personal Learning Companion
**URL:** https://soulofkabir.github.io/suluk-handbook/
**Architecture:** Single-file HTML + CSS + Vanilla JavaScript, GitHub Pages static hosting
**Data:** `data/handbook_concentration.json`, `data/cross_reference_data.json`, `data/glossary.json`, `data/audio_manifest.json`
**Audio:** Cloudflare R2 bucket `suluk-audio` (public), 221 clips across 20 classes
**Personal Files:** Cloudflare R2 bucket `suluk-personal` (private), via Worker at `suluk-worker.soulofkabir.workers.dev`
**AI Chat:** Gemini 2.5 Flash via Cloudflare Worker `/chat` endpoint
**Design System:** "Crisp Pearl & True Bronze" — Nunito + Source Sans 3

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

## Git Commits (Recent)

| Commit | Description |
|---|---|
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

### Discover
- ◈ Study Companion (AI chat)
- ♪ Audio Library
- ⊙ Search
- ◉ Glossary
- ◎ Practice Tracker
- ▦ Reading Stats
- ◷ Learning Timeline

### Personal
- ☆ Bookmarks
- ✎ Notes
- ◈ Highlights
- ○ Recently Viewed

### Workspace
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
        ├── assets/images/ (Mount Qaf, instructor portraits, prayer images)
        ├── assets/favicon.svg
        ├── sw.js (Service Worker for offline caching)
        ├── manifest.json (PWA manifest)
        └── localStorage (user data, prefs, worker config)

Cloudflare Worker (suluk-worker.soulofkabir.workers.dev)
  ├── POST /upload        → R2 suluk-personal
  ├── GET  /files         → list R2 objects
  ├── GET  /file/:key     → stream from R2
  ├── DELETE /file/:key   → delete from R2
  ├── POST /backup-data   → save user data JSON to R2
  ├── GET  /backup-data   → retrieve user data backup
  └── POST /chat          → proxy to Gemini 2.5 Flash API

Cloudflare R2
  ├── suluk-audio (public)    — 221 audio clips
  └── suluk-personal (private) — files + backups
```

---

## Known Minor Issues

- Part III teachings have no `class_id` (no audio mapping) — these are from Pir Vilayat, audio not available
- Gemini 2.5 Pro quota exceeded on free tier; using 2.5 Flash instead (works well)

---

## All Phases Complete ✅

No pending phases. Future enhancements could include:
- Additional books (Contemplation, Meditation, Realization) when content is available
- Reading time tracking (time spent per teaching, not just word count estimate)
- Spaced repetition for key teachings
- Community features (shared notes/bookmarks)
