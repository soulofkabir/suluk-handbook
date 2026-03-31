# Suluk Digital Handbook — Development Progress

**Project:** Suluk Academy Personal Learning Companion
**URL:** https://soulofkabir.github.io/suluk-handbook/
**Architecture:** Single-file HTML + CSS + Vanilla JavaScript, GitHub Pages static hosting
**Data:** `data/handbook_concentration.json`, `data/cross_reference_data.json`
**Audio:** Cloudflare R2 bucket `suluk-audio` (public), 221 clips across 20 classes
**Personal Files:** Cloudflare R2 bucket `suluk-personal` (private), via Worker at `suluk-worker.soulofkabir.workers.dev`
**Design System:** "Crisp Pearl & True Bronze" — Nunito + Source Sans 3

---

## Phase A — Foundation & Shell ✅

- **Project scaffold** — Single `index.html` with embedded CSS and JavaScript, `manifest.json`, `service-worker.js` for PWA structure, `/assets/images/` folder with all images
- **Animated cover page** — Full-screen opening with Mount Qaf background, CSS keyframe animations, title/subtitle fade-in, "Enter the Handbook" button
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
- **Recently Viewed** — Last 20 teachings with timestamps
- **Export** — Download all user data as JSON

---

## Phase D — Audio Integration ✅

- **Audio manifest** — `data/audio_manifest.json` with 221 clips across 20 classes (C1–C20)
- **Audio hosting** — Cloudflare R2 bucket `suluk-audio` (public URL: `https://pub-655e0e7533694c53a63276368afd5e43.r2.dev`)
- **Audio Library page** — Sidebar nav "♪ Audio Library"; collapsible class cards with instructor, date, duration, clip count
- **Persistent bottom audio bar** — Play/pause, progress seek, time display, skip, speed control (0.75×–2×)
- **Playlist mode** — 221 clips auto-advance; skip buttons navigate playlist
- **Timestamp fix** — C6 and C9 had mixed MM:SS:FF formats causing wrong durations (6463 min, 6932 min); all normalized to HH:MM:SS
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

## Phase G1 — Skip Cover & PDF Download ✅

- **Skip cover on refresh** — `localStorage.suluk_entered` flag skips cover animation on return visits
- **PDF download** — "Download PDF" link in sidebar, downloads `assets/The_Book_of_Concentration.pdf` (3.1 MB)

---

## Phase G2 — Links & Homework ✅

- **Links page** — Add/edit/delete links with title, URL, category, notes; filter and search; modal form
- **Homework tracker** — Add assignments with title, class, description, due date; status cycling (not-started → in-progress → complete); progress stats

---

## Phase G3 — Personal Content Library ✅

- **Cloudflare Worker** — `suluk-worker` at `https://suluk-worker.soulofkabir.workers.dev`; handles upload, download, delete, list, backup; bearer token auth; CORS for GitHub Pages + localhost
- **Private R2 bucket** — `suluk-personal` for personal file storage
- **Library UI** — Sidebar nav "My Library"; drag-and-drop + browse upload; category organization (Books, Notes, Presentations, Images, Homework, Other); grid view with thumbnails; file preview modal; download, edit, delete; cloud sync
- **Cross-device sync** — Auto-syncs from cloud on page open to pick up files from other devices
- **Setup flow** — First-time setup for Worker URL and auth token; Test Connection validates; Settings gear to update/disconnect
- **Worker source:** `/Users/heartmath/Documents/Suluk_Project/suluk-worker/`

---

## Design System — "Crisp Pearl & True Bronze" ✅

- **Palette:**
  - Background: Crisp Pearl `#FCFBF8` — off-white, prevents screen glare
  - Sidebar: `#F7F5F1`
  - Body text: Espresso `#302B27` — warm dark brown, softer than black
  - Headers/Accents: Bronze Gold `#8C6222` — earthy gold
  - Muted text: `#7A756E`
  - Rules/Borders: Warm Taupe `#D4CFC6`
- **Fonts:** Nunito (headings/UI/display) + Source Sans 3 (body text)
- **Accessibility:** Designed for dyslexia/ASD (age 50+) — medium contrast, `line-height: 1.8`, no dark mode
- **Night mode removed:** All CSS rules, JS functions, keyboard shortcut, toggle button deleted
- **Cover page:** Crisp Pearl background with translucent overlay on Mount Qaf image, bronze gold title
- **Sidebar nav:** Bold (700) Espresso text, bronze gold active state

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
| `6c23376` | Clean up debug logging, update PROGRESS.md with G1-G3 |
| `377027f` | Fix library navigation bug, add auto-sync from cloud |
| `8031424` | Enhanced Search: topic filters, instructor filter, browse-all, recent searches |
| `b9545a0` | Fix audio manifest timestamps: normalize C6/C9 MM:SS:FF format |
| `4ca02c6` | Collapsible teaching audio section with smart clip matching |
| `6c631cf` | New design system: Crisp Pearl & True Bronze, Nunito + Source Sans 3 |
| `ab6eeab` | Separate reading and listening: remove inline audio from teaching view |
| `dccc76f` | Bold sidebar nav text in Espresso #302B27 |

---

## Pending / Future Phases

### Phase G4 — AI Study Companion (Not Yet Started)
- Add `/ai-chat` endpoint to Cloudflare Worker proxying to Claude API
- Chat UI in handbook for asking questions about teachings
- Context-aware: sends current teaching text as context

### Phase G5 — UI Polish (Ongoing)
- Reading statistics (teachings read, time spent)
- Learning timeline visualization
- Instructor portrait integration
- Favicon (currently 404)
- Fix deprecated `<meta name="apple-mobile-web-app-capable">` → `mobile-web-app-capable`

### Phase F — PWA & Offline (Not Yet Started)
- PWA offline mode (service worker caching)
- Background sync for user data
- App install prompt

### Known Minor Issues
- `favicon.ico` returns 404 — need to add a favicon
- `<meta name="apple-mobile-web-app-capable">` is deprecated — should use `mobile-web-app-capable`
- Part III teachings have no `class_id` (no audio mapping) — these are from Pir Vilayat, audio not available
