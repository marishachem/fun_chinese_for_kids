const KEY = 'fun_chinese_stickers_v1';
const GRIDS_PER_STICKER = 3;  // complete all cells of 3 strokes/characters → 1 sticker
const STICKERS_TO_UNLOCK = 6;

export const STICKER_IMAGES = [
  '/stickers/elsa.png',
  '/stickers/Anna.png',
  '/stickers/aurora.png',
  '/stickers/moana.png',
  '/stickers/mulan.png',
  '/stickers/rapunzel.png',
  '/stickers/jasmine.png',
  '/stickers/mermaid.png',
  '/stickers/cindirella.png',
  '/stickers/snowwhite.png',
  '/stickers/alice.png',
  '/stickers/anna1.png',
  '/stickers/dindin.png',
  '/stickers/frog.png',
  '/stickers/indian.png',
  '/stickers/mari cat.png',
  '/stickers/mermaid1.png',
  '/stickers/arrow.png',
];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { grids: 0, stickers: [] }; }
  catch { return { grids: 0, stickers: [] }; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

// Call when ALL practice cells of one stroke/character grid are filled.
// Returns new sticker image path if one was just earned, otherwise null.
export function recordCompletedGrid() {
  const data = load();
  data.grids = (data.grids || 0) + 1;
  const earned = Math.floor(data.grids / GRIDS_PER_STICKER);
  let newSticker = null;
  while (data.stickers.length < earned) {
    newSticker = STICKER_IMAGES[Math.floor(Math.random() * STICKER_IMAGES.length)];
    data.stickers.push(newSticker);
  }
  save(data);
  return newSticker;
}

export function getStickerData() {
  return load();
}

export function getStickerCount() {
  return load().stickers.length;
}

export function hasEnoughStickers() {
  return getStickerCount() >= STICKERS_TO_UNLOCK;
}

export { STICKERS_TO_UNLOCK, GRIDS_PER_STICKER };
