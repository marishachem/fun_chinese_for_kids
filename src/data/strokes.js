// char      — Unicode character shown on the card
// path      — SVG path override (viewBox 0 0 60 60) used instead of char when the font renders it wrong
// traceChar — character for the notebook grid (must be in hanzi-writer's dataset)
// arrowRot  — degrees to rotate the bracket-arrow SVG (0=→, 90=↓, 135=↙, 45=↘, -45=↗)
export const STROKES = [
  {
    id: 1, name: 'héng', chinese: '横',
    char: '一', traceChar: '一',
    arrowRot: 0,
    howToDraw: 'From left to right — like the stroke in 一',
    example: { char: '一', pinyin: 'yī', meaning: 'one', tone: 1 },
  },
  {
    id: 2, name: 'shù', chinese: '竖',
    char: '丨', traceChar: '丨',
    arrowRot: 90,
    howToDraw: 'From top to bottom — like the 2nd stroke of 十',
    example: { char: '十', pinyin: 'shí', meaning: 'ten', tone: 2 },
  },
  {
    id: 3, name: 'piě', chinese: '撇',
    img: '/strokes/pie.png',
    char: '丿', traceChar: '丿',
    arrowRot: 135,
    howToDraw: 'From left, top to bottom-left — like the 1st stroke of 八',
    example: { char: '八', pinyin: 'bā', meaning: 'eight', tone: 1 },
  },
  {
    id: 4, name: 'nà', chinese: '捺',
    img: '/strokes/na.png',   // calligraphic image — SVG path can't show the broad pressed end
    char: '入', traceChar: '入',
    arrowRot: 45,
    howToDraw: 'From top, press down to the right — like the 2nd stroke of 八',
    example: { char: '八', pinyin: 'bā', meaning: 'eight', tone: 1 },
  },
  {
    id: 5, name: 'diǎn', chinese: '点',
    char: '丶', traceChar: '丶',
    arrowRot: 45,
    howToDraw: 'Press down and lift quickly — like a raindrop',
    example: { char: '主', pinyin: 'zhǔ', meaning: 'master', tone: 3 },
  },
  {
    id: 6, name: 'tí', chinese: '提',
    char: '乛', traceChar: '乛',
    arrowRot: -45,
    howToDraw: 'From bottom-left to top-right — a quick upward flick',
    example: { char: '地', pinyin: 'dì', meaning: 'earth', tone: 4 },
  },
  {
    id: 7, name: 'shù gōu', chinese: '竖钩',
    char: '亅', traceChar: '亅',
    arrowRot: 90,
    howToDraw: 'From top to bottom, then hook right — like the middle stroke of 小',
    example: { char: '小', pinyin: 'xiǎo', meaning: 'small', tone: 3 },
  },
  {
    id: 8, name: 'héng zhé', chinese: '横折',
    char: '𠃑', traceChar: '口',
    arrowRot: 0,
    howToDraw: 'Right then turn down — like the 1st stroke of 口',
    example: { char: '口', pinyin: 'kǒu', meaning: 'mouth', tone: 3 },
  },
  {
    id: 9, name: 'héng gōu', chinese: '横钩',
    char: '𠄎', traceChar: '了',
    arrowRot: 0,
    howToDraw: 'Right then hook down-left at the end',
    example: { char: '字', pinyin: 'zì', meaning: 'character', tone: 4 },
  },
  {
    id: 10, name: 'wān gōu', chinese: '弯钩',
    char: '𠃌', traceChar: '子',
    arrowRot: 90,
    howToDraw: 'Curve down like a bow, then hook right at the bottom',
    example: { char: '子', pinyin: 'zǐ', meaning: 'child', tone: 3 },
  },
];
