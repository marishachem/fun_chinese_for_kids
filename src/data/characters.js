const characters = [
  // ── people ────────────────────────────────────────────
  { char: '人', pinyin: 'rén',   tone: 2, meaning: 'person',   emoji: '🧑',  category: 'people', image: '/images/person.png' },
  { char: '爸', pinyin: 'bà',    tone: 4, meaning: 'dad',       emoji: '👨',  category: 'people', image: '/images/dad.png' },
  { char: '妈', pinyin: 'mā',    tone: 1, meaning: 'mom',       emoji: '👩',  category: 'people' },
  { char: '我', pinyin: 'wǒ',    tone: 3, meaning: 'I / me',    emoji: '👤',  category: 'people' },

  // ── body ──────────────────────────────────────────────
  { char: '口', pinyin: 'kǒu',   tone: 3, meaning: 'mouth',     emoji: '👄',  category: 'body' },
  { char: '手', pinyin: 'shǒu',  tone: 3, meaning: 'hand',      emoji: '✋',  category: 'body' },
  { char: '目', pinyin: 'mù',    tone: 4, meaning: 'eye',       emoji: '👁️', category: 'body' },
  { char: '耳', pinyin: 'ěr',    tone: 3, meaning: 'ear',       emoji: '👂',  category: 'body' },
  { char: '心', pinyin: 'xīn',   tone: 1, meaning: 'heart',     emoji: '❤️', category: 'body' },

  // ── home ──────────────────────────────────────────────
  { char: '门', pinyin: 'mén',   tone: 2, meaning: 'door',      emoji: '🚪',  category: 'home' },
  { char: '家', pinyin: 'jiā',   tone: 1, meaning: 'home',      emoji: '🏠',  category: 'home' },
  { char: '里', pinyin: 'lǐ',    tone: 3, meaning: 'inside',    emoji: '📦',  category: 'home' },
  { char: '书', pinyin: 'shū',   tone: 1, meaning: 'book',      emoji: '📚',  category: 'home' },

  // ── animals ───────────────────────────────────────────
  { char: '马', pinyin: 'mǎ',    tone: 3, meaning: 'horse',     emoji: '🐴',  category: 'animals' },
  { char: '鱼', pinyin: 'yú',    tone: 2, meaning: 'fish',      emoji: '🐟',  category: 'animals' },
  { char: '鸟', pinyin: 'niǎo',  tone: 3, meaning: 'bird',      emoji: '🐦',  category: 'animals' },
  { char: '猫', pinyin: 'māo',   tone: 1, meaning: 'cat',       emoji: '🐱',  category: 'animals' },
  { char: '狗', pinyin: 'gǒu',   tone: 3, meaning: 'dog',       emoji: '🐶',  category: 'animals' },
  { char: '兔', pinyin: 'tù',    tone: 4, meaning: 'rabbit',    emoji: '🐰',  category: 'animals' },
  { char: '熊', pinyin: 'xióng', tone: 2, meaning: 'bear',      emoji: '🐻',  category: 'animals' },
  { char: '虎', pinyin: 'hǔ',    tone: 3, meaning: 'tiger',     emoji: '🐯',  category: 'animals' },
  { char: '龙', pinyin: 'lóng',  tone: 2, meaning: 'dragon',    emoji: '🐉',  category: 'animals' },
  { char: '羊', pinyin: 'yáng',  tone: 2, meaning: 'sheep',     emoji: '🐑',  category: 'animals' },
  { char: '牛', pinyin: 'niú',   tone: 2, meaning: 'cow',       emoji: '🐄',  category: 'animals' },

  // ── food ──────────────────────────────────────────────
  { char: '米', pinyin: 'mǐ',    tone: 3, meaning: 'rice',      emoji: '🍚',  category: 'food' },
  { char: '茶', pinyin: 'chá',   tone: 2, meaning: 'tea',       emoji: '🍵',  category: 'food' },
  { char: '肉', pinyin: 'ròu',   tone: 4, meaning: 'meat',      emoji: '🥩',  category: 'food' },
  { char: '饭', pinyin: 'fàn',   tone: 4, meaning: 'meal',      emoji: '🍱',  category: 'food' },
  { char: '面', pinyin: 'miàn',  tone: 4, meaning: 'noodles',   emoji: '🍜',  category: 'food' },
  { char: '蛋', pinyin: 'dàn',   tone: 4, meaning: 'egg',       emoji: '🥚',  category: 'food' },
  { char: '果', pinyin: 'guǒ',   tone: 3, meaning: 'fruit',     emoji: '🍎',  category: 'food' },
  { char: '菜', pinyin: 'cài',   tone: 4, meaning: 'vegetable', emoji: '🥦',  category: 'food' },

  // ── fruits ────────────────────────────────────────────
  { char: '苹', pinyin: 'píng',  tone: 2, meaning: 'apple',     emoji: '🍎',  category: 'fruits' },
  { char: '桃', pinyin: 'táo',   tone: 2, meaning: 'peach',     emoji: '🍑',  category: 'fruits' },
  { char: '瓜', pinyin: 'guā',   tone: 1, meaning: 'melon',     emoji: '🍈',  category: 'fruits' },

  // ── nature ────────────────────────────────────────────
  { char: '日', pinyin: 'rì',    tone: 4, meaning: 'sun / day', emoji: '☀️', category: 'nature' },
  { char: '月', pinyin: 'yuè',   tone: 4, meaning: 'moon',      emoji: '🌙',  category: 'nature' },
  { char: '山', pinyin: 'shān',  tone: 1, meaning: 'mountain',  emoji: '⛰️', category: 'nature' },
  { char: '水', pinyin: 'shuǐ',  tone: 3, meaning: 'water',     emoji: '💧',  category: 'nature' },
  { char: '火', pinyin: 'huǒ',   tone: 3, meaning: 'fire',      emoji: '🔥',  category: 'nature' },
  { char: '木', pinyin: 'mù',    tone: 4, meaning: 'wood',      emoji: '🪵',  category: 'nature' },
  { char: '土', pinyin: 'tǔ',    tone: 3, meaning: 'earth',     emoji: '🌍',  category: 'nature' },
  { char: '天', pinyin: 'tiān',  tone: 1, meaning: 'sky',       emoji: '🌤️', category: 'nature' },
  { char: '地', pinyin: 'dì',    tone: 4, meaning: 'ground',    emoji: '🏔️', category: 'nature' },
  { char: '风', pinyin: 'fēng',  tone: 1, meaning: 'wind',      emoji: '💨',  category: 'nature' },
  { char: '雨', pinyin: 'yǔ',    tone: 3, meaning: 'rain',      emoji: '🌧️', category: 'nature' },
  { char: '雪', pinyin: 'xuě',   tone: 3, meaning: 'snow',      emoji: '❄️', category: 'nature' },
  { char: '云', pinyin: 'yún',   tone: 2, meaning: 'cloud',     emoji: '☁️', category: 'nature' },
  { char: '草', pinyin: 'cǎo',   tone: 3, meaning: 'grass',     emoji: '🌿',  category: 'nature' },
  { char: '花', pinyin: 'huā',   tone: 1, meaning: 'flower',    emoji: '🌸',  category: 'nature' },
  { char: '树', pinyin: 'shù',   tone: 4, meaning: 'tree',      emoji: '🌲',  category: 'nature' },
  { char: '石', pinyin: 'shí',   tone: 2, meaning: 'stone',     emoji: '🪨',  category: 'nature' },

  // ── colors ────────────────────────────────────────────
  { char: '红', pinyin: 'hóng',  tone: 2, meaning: 'red',       emoji: '🔴',  category: 'colors' },
  { char: '蓝', pinyin: 'lán',   tone: 2, meaning: 'blue',      emoji: '🔵',  category: 'colors' },
  { char: '绿', pinyin: 'lǜ',    tone: 4, meaning: 'green',     emoji: '🟢',  category: 'colors' },
  { char: '白', pinyin: 'bái',   tone: 2, meaning: 'white',     emoji: '⬜',  category: 'colors' },
  { char: '黑', pinyin: 'hēi',   tone: 1, meaning: 'black',     emoji: '⬛',  category: 'colors' },
  { char: '黄', pinyin: 'huáng', tone: 2, meaning: 'yellow',    emoji: '🟡',  category: 'colors' },

  // ── adjectives ────────────────────────────────────────
  { char: '大', pinyin: 'dà',    tone: 4, meaning: 'big',       emoji: '🐘',  category: 'adjectives' },
  { char: '小', pinyin: 'xiǎo',  tone: 3, meaning: 'small',     emoji: '🐭',  category: 'adjectives' },
  { char: '好', pinyin: 'hǎo',   tone: 3, meaning: 'good',      emoji: '👍',  category: 'adjectives' },
  { char: '多', pinyin: 'duō',   tone: 1, meaning: 'many',      emoji: '✨',  category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────
  { char: '一', pinyin: 'yī',    tone: 1, meaning: 'one',       emoji: '1️⃣', category: 'numbers' },
  { char: '二', pinyin: 'èr',    tone: 4, meaning: 'two',       emoji: '2️⃣', category: 'numbers' },
  { char: '三', pinyin: 'sān',   tone: 1, meaning: 'three',     emoji: '3️⃣', category: 'numbers' },
  { char: '四', pinyin: 'sì',    tone: 4, meaning: 'four',      emoji: '4️⃣', category: 'numbers' },
  { char: '五', pinyin: 'wǔ',    tone: 3, meaning: 'five',      emoji: '5️⃣', category: 'numbers' },
  { char: '六', pinyin: 'liù',   tone: 4, meaning: 'six',       emoji: '6️⃣', category: 'numbers' },
  { char: '七', pinyin: 'qī',    tone: 1, meaning: 'seven',     emoji: '7️⃣', category: 'numbers' },
  { char: '八', pinyin: 'bā',    tone: 1, meaning: 'eight',     emoji: '8️⃣', category: 'numbers' },
  { char: '九', pinyin: 'jiǔ',   tone: 3, meaning: 'nine',      emoji: '9️⃣', category: 'numbers' },
  { char: '十', pinyin: 'shí',   tone: 2, meaning: 'ten',       emoji: '🔟',  category: 'numbers' },

  // ── direction ─────────────────────────────────────────
  { char: '上', pinyin: 'shàng', tone: 4, meaning: 'up',        emoji: '⬆️', category: 'direction' },
  { char: '下', pinyin: 'xià',   tone: 4, meaning: 'down',      emoji: '⬇️', category: 'direction' },
  { char: '中', pinyin: 'zhōng', tone: 1, meaning: 'middle',    emoji: '🇨🇳', category: 'direction' },

  // ── verbs ─────────────────────────────────────────────
  { char: '吃', pinyin: 'chī',   tone: 1, meaning: 'eat',       emoji: '😋',  category: 'verbs' },
  { char: '喝', pinyin: 'hē',    tone: 1, meaning: 'drink',     emoji: '🥤',  category: 'verbs' },
  { char: '看', pinyin: 'kàn',   tone: 4, meaning: 'look',      emoji: '👀',  category: 'verbs' },
  { char: '走', pinyin: 'zǒu',   tone: 3, meaning: 'walk',      emoji: '🚶',  category: 'verbs' },
  { char: '爱', pinyin: 'ài',    tone: 4, meaning: 'love',      emoji: '❤️', category: 'verbs' },
  { char: '来', pinyin: 'lái',   tone: 2, meaning: 'come',      emoji: '➡️', category: 'verbs' },
  { char: '在', pinyin: 'zài',   tone: 4, meaning: 'at / in',   emoji: '📍',  category: 'verbs' },
  { char: '有', pinyin: 'yǒu',   tone: 3, meaning: 'have',      emoji: '🤲',  category: 'verbs' },
  { char: '是', pinyin: 'shì',   tone: 4, meaning: 'is / am',   emoji: '✅',  category: 'verbs' },
  { char: '也', pinyin: 'yě',    tone: 3, meaning: 'also',      emoji: '➕',  category: 'verbs' },
  { char: '和', pinyin: 'hé',    tone: 2, meaning: 'and',       emoji: '🔗',  category: 'verbs' },
  { char: '说', pinyin: 'shuō',  tone: 1, meaning: 'say / speak', emoji: '💬', category: 'verbs' },

  // ── sounds ────────────────────────────────────────────
  { char: '喵', pinyin: 'miāo',  tone: 1, meaning: 'meow (cat)', emoji: '🐱',  category: 'sounds' },
  { char: '汪', pinyin: 'wāng',  tone: 1, meaning: 'woof (dog)', emoji: '🐶',  category: 'sounds' },
  { char: '咩', pinyin: 'miē',   tone: 1, meaning: 'baa (sheep)', emoji: '🐑', category: 'sounds' },
  { char: '哞', pinyin: 'mōu',   tone: 1, meaning: 'moo (cow)',  emoji: '🐄',  category: 'sounds' },
  { char: '叽', pinyin: 'jī',    tone: 1, meaning: 'chirp (bird)', emoji: '🐦', category: 'sounds' },
  { char: '吼', pinyin: 'hǒu',   tone: 3, meaning: 'roar (tiger/bear)', emoji: '🐯', category: 'sounds' },

  // ── transport ─────────────────────────────────────────
  { char: '车', pinyin: 'chē',   tone: 1, meaning: 'car',       emoji: '🚗',  category: 'transport' },
  { char: '船', pinyin: 'chuán', tone: 2, meaning: 'boat',      emoji: '⛵',  category: 'transport' },

  // ── toys ──────────────────────────────────────────────
  { char: '玩', pinyin: 'wán',   tone: 2, meaning: 'play',      emoji: '🎲',  category: 'toys' },
  { char: '球', pinyin: 'qiú',   tone: 2, meaning: 'ball',      emoji: '⚽',  category: 'toys' },
  { char: '娃', pinyin: 'wá',    tone: 2, meaning: 'doll',      emoji: '🪆',  category: 'toys', image: '/images/doll.webp' },
  { char: '琴', pinyin: 'qín',   tone: 2, meaning: 'instrument',emoji: '🎹',  category: 'toys' },
  { char: '鼓', pinyin: 'gǔ',    tone: 3, meaning: 'drum',      emoji: '🥁',  category: 'toys' },
  { char: '画', pinyin: 'huà',   tone: 4, meaning: 'draw / paint', emoji: '🎨', category: 'toys' },
  { char: '笔', pinyin: 'bǐ',    tone: 3, meaning: 'pen / pencil', emoji: '✏️', category: 'toys' },
  { char: '纸', pinyin: 'zhǐ',   tone: 3, meaning: 'paper',     emoji: '📄',  category: 'toys' },
  { char: '跑', pinyin: 'pǎo',   tone: 3, meaning: 'run',       emoji: '🏃',  category: 'toys' },
  { char: '跳', pinyin: 'tiào',  tone: 4, meaning: 'jump',      emoji: '🦘',  category: 'toys' },
];

export default characters;
