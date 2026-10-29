const KEY = 'fun_chinese_stickers_v1';
const CELLS_PER_STICKER = 5;
const STICKERS_TO_UNLOCK = 5;

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
  try { return JSON.parse(localStorage.getItem(KEY)) || { cells: 0, stickers: [] }; }
  catch { return { cells: 0, stickers: [] }; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

// Call when a writing cell is completed. Returns new sticker image path if one was just earned.
export function recordWritingCell() {
  const data = load();
  data.cells = (data.cells || 0) + 1;
  const earned = Math.floor(data.cells / CELLS_PER_STICKER);
  let newSticker = null;
  while (data.stickers.length < earned) {
    newSticker = STICKER_IMAGES[Math.floor(Math.random() * STICKER_IMAGES.length)];
    data.stickers.push(newSticker);
  }
  save(data);
  return newSticker; // null if no new sticker, or the image path of the new sticker
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

export { STICKERS_TO_UNLOCK, CELLS_PER_STICKER };
