# Changelog

All notable changes are recorded here automatically on every push.

---

## 2026-11-03

- Add browser back/forward button support via History API
- Fix: catch Firebase auth error, fall back to localStorage gracefully

## 2026-11-02

- Add Firebase: anonymous auth + Firestore cloud sync for progress and stickers

## 2026-10-30

- Cleanup: remove unused audio/initials, duplicate location PNGs, old stroke PNGs/dev files, unused images
- Add fairy castle watercolor image for step 5 (Bunny Forest)
- Audio: add 1,464 syllable audio files (all valid initial+final combinations × 4 tones) — stored locally
- Finals: show toned forms on buttons instead of numbers (ā á ǎ à)
- Initials: expand to all valid syllables with toned buttons (bā bá bǎ bà), Chinese-only group labels
- Finals: add W syllables (wu wa wai wan wang wei wen weng wo) and Y syllables (yu yuan yue yun)
- Finals: remove ong (no standalone Mandarin form)
- Finals: download 124 audio files locally — no CDN dependency
- Finals: add all 4 tone buttons per chip
- Map: show sticker board on every location card, not just current
- Step 4 (Magic Forest): replace loc04.png with fairy kitchen watercolor
- Add piědiǎn (撇点): sweep-left-flick-right stroke, example 女 nǚ
- Héngzhéwāngōu: fix stroke shape (full 乙-shape with fold-top)
- Add héngzhéwāngōu (横折弯钩): right-fold-curve-hook stroke, example 九 jiǔ
- Replace wāngōu with shùzhézhégōu: complex fold-fold-hook stroke, example 马 mǎ
- Add shùwāngōu (竖弯钩): down-curve-right-hook-up stroke, example 七 qī
- Replace shùgōu with shùwān: down-then-curve-right stroke, example 四 sì
- Héngzhé: fix stroke shape — sharp right-angle
- Stroke Guide: highlight target stroke in example character
- Diǎn: enlarge viewBox so dot renders small
- Stroke Guide: replace PNG/geometric-path with calligraphic SVG strokes

## 2026-10-29

- Héngzhé: fix example to 马 mǎ (horse), add L-shape SVG path
- Stroke Guide cells: show SVG path as guide instead of character when available
- Hénggōu: fix example to 子 zǐ, add SVG hook path
- Tone strip: use real ma1–ma4 audio; 'hear all four' plays in sequence
- Tone cards: real audio for ā/á/ǎ/à from YoYo Chinese
- Shù stroke: use calligraphic image
- Héng stroke: use calligraphic image
- Tí stroke: use calligraphic image (rising wedge)
- Fix tí stroke: SVG rising diagonal path, example changed to 我 (wǒ)
- Step 3: moonlit fairy river image + rename to 月光仙河 / Moonlight Fairy River
- Add Finals Exercise tab to Pinyin with real audio
- Remove 'sounds' category characters (replaced with clearer ones)
- Require 6 stickers per step to unlock next map location
- Rename step 2 to Lotus Fairy Pond (莲花仙境)
- Map card image fills full width with object-fit: cover
- Replace Unicorn Prairie (step 2) image with fairy on lotus
- Stickers awarded per completed grid: fill all cells of 3 strokes/chars = 1 sticker
- Stroke guide: reduce practice grid to 2 rows
- Tap sticker to zoom — lightbox modal
- Bigger sticker slots on map card (44 → 72 px)
- Random sticker selection; sticker images repeat after cycling through all 18
- Sticker system + Map location learning flow

## 2026-10-28

- Drawing canvas for copybook & stroke guide with localStorage persistence
- Stroke Guide redesign + floral background
- Copybook: trace directly inside the grid cell
- Redesign Copybook to match physical strokebook: fading reference row + 8×6 practice grid
- Rebuild Stroke Guide: 23 compound strokes with SVG shape drawings on each card
- Add Stroke Guide mode with 28 strokes, animated watch + tracing copybook per stroke
- Replace hue-rotate with location-colored glow (skin and dress unchanged)
- Replace straight map path with alternating curved SVG bezier lines
- Make Elsa bigger and shift her dress color per map location
- Add Review mode: replay completed location words from the map
- Replace family character emoji with custom Chinese illustrations (妈, 爸, 人)
- Replace number hand emoji with cartoon illustrations (3–7)

## 2026-10-27

- Replace final location with ice castle image and rename to 冰雪城堡 / Ice Castle
- Add full interactive Chinese learning app for kids 6–8
- Initialize project using Create React App
