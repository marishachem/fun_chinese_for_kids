const KEY = 'fun_chinese_v1';

export const LOCATIONS = [
  { id: 0,  req: 0,   name: '梦幻草地',  nameEn: 'Dream Meadow',      color: '#f9a8d4', image: '/images/locations/loc01.png' },
  { id: 1,  req: 10,  name: '独角兽草原', nameEn: 'Unicorn Prairie',   color: '#c084fc', image: '/images/locations/loc02.png' },
  { id: 2,  req: 20,  name: '星星草原',  nameEn: 'Starry Prairie',     color: '#93c5fd', image: '/images/locations/loc03.png' },
  { id: 3,  req: 30,  name: '魔法森林',  nameEn: 'Magic Forest',       color: '#34d399', image: '/images/locations/loc04.png' },
  { id: 4,  req: 40,  name: '兔子森林',  nameEn: 'Bunny Forest',       color: '#86efac', image: '/images/locations/loc05.png' },
  { id: 5,  req: 50,  name: '精灵花园',  nameEn: 'Fairy Garden',       color: '#f472b6', image: '/images/locations/loc06.png' },
  { id: 6,  req: 60,  name: '精灵树屋',  nameEn: 'Fairy Treehouse',    color: '#a78bfa', image: '/images/locations/loc07.png' },
  { id: 7,  req: 70,  name: '低语瀑布',  nameEn: 'Whispering Falls',   color: '#38bdf8', image: '/images/locations/loc08.png' },
  { id: 8,  req: 80,  name: '蝴蝶洞穴',  nameEn: 'Butterfly Cave',     color: '#fb923c', image: '/images/locations/loc09.png' },
  { id: 9,  req: 90,  name: '水晶洞穴',  nameEn: 'Crystal Cave',       color: '#818cf8', image: '/images/locations/loc10.png' },
  { id: 10, req: 105, name: '冰雪城堡',  nameEn: 'Ice Castle',          color: '#7dd3fc', image: '/images/locations/loc11.png' },
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
    const newIdx = getLocationIndex(p.learned.length);
    return { changed: true, count: p.learned.length, newLocIdx: newIdx > prevIdx ? newIdx : null };
  } catch { return { changed: false, count: 0, newLocIdx: null }; }
}

export function resetProgress() {
  try { localStorage.removeItem(KEY); } catch {}
}
