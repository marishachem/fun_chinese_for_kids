# 🐼 Fun Chinese for Kids

An interactive web app for children aged **6–8** to learn Mandarin Chinese through play, drawing, and exploration.

🌐 **Live app:** https://fun-chinese-for-kids.web.app

---

## What's inside

### 🗺️ Map Journey
A story-map with **20 magical locations** (Dream Meadow → Dragon Palace). Each location unlocks when you learn enough words **and** earn 6 stickers. Characters get gradually harder as you progress — the first 6 steps use only easy characters (difficulty 1), then medium characters (difficulty 2) are slowly introduced, reaching ~90% harder vocab by the final steps.

### 📚 Flashcards
Tap a card to flip and reveal the character's meaning, pinyin, and emoji. Organized into **24 categories**: animals, body, clothes, colors, directions, emotions, food, fruits, home, kitchen, music, nature, numbers, people, places, school, shapes, sports, time, toys, transport, verbs, weather, adjectives.

### ✏️ Copybook
Practice writing characters stroke-by-stroke. Uses **hanzi-writer quiz mode** — the app checks each stroke you draw in real time. Fill the 8×6 grid; completing a full grid earns a sticker. Individual cells can be redone with the ↺ button.

### 🖌️ Stroke Guide
Learn the **23 fundamental Chinese brush strokes** with calligraphic SVG illustrations and guided practice grids (same hanzi-writer quiz mode). Knowing strokes helps you write any character.

### 🔤 Pinyin
- **Tones** — hear and compare the 4 tones with real audio (mā má mǎ mà)
- **Initials** — all consonant onsets with toned audio examples
- **Finals** — all vowel endings with toned audio examples
- 1,464 syllable audio files (all valid initial+final combinations × 4 tones), stored locally — no CDN dependency

### ⭐ Stickers
Earn princess stickers by completing practice grids. Tap any sticker to zoom in. 6 stickers unlock the next map location (both word count *and* stickers are required).

---

## Characters

**331 unique characters** across 24 categories. Each has:
- `char` — the Chinese character
- `pinyin` — romanized pronunciation
- `tone` — tone number (1–4)
- `meaning` — English meaning
- `emoji` — visual hint
- `category` — one of 24 learning groups
- `difficulty` — `1` (simple, few strokes, HSK 1–2) or `2` (medium, more strokes, HSK 2–3)

The array is ordered so map steps naturally gate difficulty: steps 1–6 are 100% difficulty-1, then d2 is introduced gradually, reaching ~90% by step 13+.

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 (Create React App) |
| Stroke recognition | [hanzi-writer](https://hanziwriter.org) v3.7.3 — quiz mode |
| Cloud sync | Firebase Firestore + Anonymous Auth |
| Hosting | Firebase Hosting |
| Progress storage | `localStorage` (offline) + Firestore (cloud) |
| Audio | Local MP3 files (public/audio/) |

---

## Getting started

```bash
# 1. Clone the repo
git clone <repo-url>
cd fun_chinese_for_kids

# 2. Install dependencies
npm install

# 3. Set up Firebase credentials — copy .env.example and fill in your values
cp .env.example .env.local
# Edit .env.local with your Firebase project credentials

# 4. Start the dev server
npm start

# 5. Build + deploy to Firebase
npm run build
npx firebase-tools deploy --only hosting
```

### Firebase setup
Create a Firebase project, enable **Firestore** and **Anonymous Authentication**, then copy your web app config into `.env.local`.

---

## Project structure

```
src/
  components/
    Map.js            — Journey map with 20 locations, sticker boards, difficulty bars
    Flashcards.js     — Category-filtered card flip game
    Copybook.js       — Character practice grid (hanzi-writer quiz)
    StrokeGuide.js    — Stroke library with SVG illustrations + practice
    Pinyin.js         — Tones / Initials / Finals audio tabs
    HanziQuizCanvas.js — Reusable stroke-by-stroke quiz component
    DrawingCanvas.js  — Freehand drawing canvas (legacy, copybook backup)
    LocationLearn.js  — Per-location word learning flow
  data/
    characters.js     — 331 characters with difficulty, category, pinyin
    strokes.js        — 23 stroke definitions with SVG paths
  utils/
    progress.js       — LOCATIONS array, markLearned, localStorage + Firestore sync
    stickers.js       — Sticker earn/save logic
    db.js             — Firestore read/write helpers
  App.js              — Routing between screens (History API)
  App.css             — All styles (single file, CSS custom props for theming)
public/
  audio/              — 1,464 syllable MP3s + tone demo files
  images/             — Stickers, illustrations, location artwork
  images/locations/   — 11 watercolor location images (loc01–loc11.png/jpg)
```

---

## How to use with kids

1. **Start on the Map** — pick "Learn words" at Dream Meadow (the first location).
2. **Learn 15 words** at that location via flashcard-style presentation.
3. **Practice writing** in Copybook or Stroke Guide — complete 3-cell grids to earn stickers.
4. **Earn 6 stickers** to unlock the next location.
5. **Review** completed locations anytime via the ✨ Review button.
6. Use **Pinyin** to reinforce pronunciation before/after new characters.

**Tips for 6–8 year olds:**
- Do 1 location per session (15 words + some writing practice = ~20 min)
- The Stroke Guide works best *before* Copybook — kids who know the strokes write much better
- Stickers are highly motivating — don't skip the writing practice!

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full history of changes.
