import { saveToCloud } from './db';

const KEY = 'fun_chinese_v1';
let _uid = null;
export function setProgressUid(uid) { _uid = uid; }

export const LOCATIONS = [
  // Steps 0-5: all difficulty 1 characters
  { id: 0,  req: 0,   name: '梦幻草地', nameEn: 'Dream Meadow',        color: '#f9a8d4', image: '/images/locations/loc01.png' },
  { id: 1,  req: 15,  name: '莲花仙境', nameEn: 'Lotus Fairy Pond',    color: '#c084fc', image: '/images/locations/loc02.png' },
  { id: 2,  req: 30,  name: '月光仙河', nameEn: 'Moonlight River',     color: '#93c5fd', image: '/images/locations/loc03.png' },
  { id: 3,  req: 45,  name: '魔法森林', nameEn: 'Magic Forest',        color: '#34d399', image: '/images/locations/loc04.jpg' },
  { id: 4,  req: 60,  name: '兔子森林', nameEn: 'Bunny Forest',        color: '#86efac', image: '/images/locations/loc05.jpg' },
  { id: 5,  req: 75,  name: '精灵花园', nameEn: 'Fairy Garden',        color: '#f472b6', image: '/images/locations/loc06.png' },
  // Steps 6-9: mostly d1, d2 begins to appear (~10–30%)
  { id: 6,  req: 90,  name: '精灵树屋', nameEn: 'Fairy Treehouse',     color: '#a78bfa', image: '/images/locations/loc07.png' },
  { id: 7,  req: 108, name: '低语瀑布', nameEn: 'Whispering Falls',    color: '#38bdf8', image: '/images/locations/loc08.png' },
  { id: 8,  req: 126, name: '蝴蝶洞穴', nameEn: 'Butterfly Cave',      color: '#fb923c', image: '/images/locations/loc09.png' },
  { id: 9,  req: 144, name: '水晶洞穴', nameEn: 'Crystal Cave',        color: '#818cf8', image: '/images/locations/loc10.png' },
  // Steps 10-13: mixed d1+d2 (~50/50)
  { id: 10, req: 162, name: '冰雪城堡', nameEn: 'Ice Castle',          color: '#7dd3fc', image: '/images/locations/loc11.png' },
  { id: 11, req: 180, name: '龙脊山脉', nameEn: 'Dragon Ridge',        color: '#f97316', image: '/images/locations/loc04.jpg' },
  { id: 12, req: 198, name: '凤凰山谷', nameEn: 'Phoenix Valley',      color: '#ef4444', image: '/images/locations/loc05.jpg' },
  { id: 13, req: 216, name: '星光花园', nameEn: 'Starlight Garden',    color: '#8b5cf6', image: '/images/locations/loc06.png' },
  // Steps 14-17: mostly d2
  { id: 14, req: 234, name: '月宫',     nameEn: 'Moon Palace',         color: '#c0c0c0', image: '/images/locations/loc03.png' },
  { id: 15, req: 252, name: '云之王国', nameEn: 'Cloud Kingdom',       color: '#bfdbfe', image: '/images/locations/loc02.png' },
  { id: 16, req: 267, name: '彩虹桥',   nameEn: 'Rainbow Bridge',      color: '#6ee7b7', image: '/images/locations/loc07.png' },
  { id: 17, req: 282, name: '翡翠森林', nameEn: 'Jade Forest',         color: '#34d399', image: '/images/locations/loc08.png' },
  // Steps 18-19: advanced d2
  { id: 18, req: 297, name: '金色神殿', nameEn: 'Golden Temple',       color: '#d97706', image: '/images/locations/loc09.png' },
  { id: 19, req: 315, name: '龙宫',     nameEn: 'Dragon Palace',       color: '#1d4ed8', image: '/images/locations/loc10.png' },
];

export function getLocationIndex(count) {
  for (let i = LOCATIONS.length - 1; i >= 0; i--) {
    if (count >= LOCATIONS[i].req) return i;
  }
  return 0;
}

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { learned: [] }; }
  catch { return { learned: [] }; }
}

// Returns { changed, count, newLocIdx } — newLocIdx set only if a milestone just unlocked
export function markLearned(char) {
  try {
    const p = getProgress();
    if (p.learned.includes(char)) return { changed: false, count: p.learned.length, newLocIdx: null };
    const prevIdx = getLocationIndex(p.learned.length);
    p.learned = [...p.learned, char];
    localStorage.setItem(KEY, JSON.stringify(p));
    if (_uid) saveToCloud(_uid);
    const newIdx = getLocationIndex(p.learned.length);
    return { changed: true, count: p.learned.length, newLocIdx: newIdx > prevIdx ? newIdx : null };
  } catch { return { changed: false, count: 0, newLocIdx: null }; }
}

export function resetProgress() {
  try {
    localStorage.removeItem(KEY);
    if (_uid) saveToCloud(_uid);
  } catch {}
}
