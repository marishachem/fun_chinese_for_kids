import React, { useState, useCallback, useRef } from 'react';
import characters from '../data/characters';

// ── speech helper ──────────────────────────────────────────
function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

function playAudio(src) {
  const a = new Audio(src);
  a.play().catch(() => {});
}

// ── tone data ──────────────────────────────────────────────
const TONES = [
  {
    n: 1, mark: 'ā', color: '#dc2626', bg: '#fef2f2',
    name: 'First Tone',   chinese: '第一声',
    desc: 'High and flat — hold it steady, like humming a musical note',
    hanzi: '妈', example: 'mā', meaning: 'mom',
    audio: '/audio/tones/a1.mp3', audioMa: '/audio/tones/ma1.mp3',
  },
  {
    n: 2, mark: 'á', color: '#d97706', bg: '#fefce8',
    name: 'Second Tone',  chinese: '第二声',
    desc: 'Rising — like asking "really?" in surprise',
    hanzi: '麻', example: 'má', meaning: 'hemp / numb',
    audio: '/audio/tones/a2.mp3', audioMa: '/audio/tones/ma2.mp3',
  },
  {
    n: 3, mark: 'ǎ', color: '#16a34a', bg: '#f0fdf4',
    name: 'Third Tone',   chinese: '第三声',
    desc: 'Dipping then rising — start medium, dip low, then come back up',
    hanzi: '马', example: 'mǎ', meaning: 'horse',
    audio: '/audio/tones/a3.mp3', audioMa: '/audio/tones/ma3.mp3',
  },
  {
    n: 4, mark: 'à', color: '#2563eb', bg: '#eff6ff',
    name: 'Fourth Tone',  chinese: '第四声',
    desc: 'Falling sharply — start high and drop fast, like saying "No!"',
    hanzi: '骂', example: 'mà', meaning: 'scold',
    audio: '/audio/tones/a4.mp3', audioMa: '/audio/tones/ma4.mp3',
  },
];

// ── tone pitch chart ───────────────────────────────────────
// Classic Chao tone letter system: 5 pitch levels (1=low, 5=high)
// y-coordinate mapping: level l → y = 12 + (5-l)*13
const ly = l => 12 + (5 - l) * 13;

const CHART_TONES = [
  { color: '#dc2626', n: '1', pts: [[20, ly(5)], [58, ly(5)]],                                label: 'Tone 1 — 55' },
  { color: '#d97706', n: '2', pts: [[78, ly(3)], [116, ly(5)]],                               label: 'Tone 2 — 35' },
  { color: '#16a34a', n: '3', pts: [[136, ly(2)], [157, ly(1)], [194, ly(4)]],               label: 'Tone 3 — 214' },
  { color: '#2563eb', n: '4', pts: [[214, ly(5)], [252, ly(1)]],                              label: 'Tone 4 — 51' },
];

function ToneChart() {
  return (
    <svg viewBox="0 0 275 90" className="tone-chart-svg" role="img" aria-label="Chinese tone pitch chart">
      {/* pitch level guide lines */}
      {[5, 4, 3, 2, 1].map(l => (
        <g key={l}>
          <line x1="16" y1={ly(l)} x2="265" y2={ly(l)} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x="11" y={ly(l) + 4} fontSize="8" fill="#94a3b8" textAnchor="middle">{l}</text>
        </g>
      ))}

      {/* tone lines */}
      {CHART_TONES.map(({ color, n, pts }) => {
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
        const [lx, ly2] = pts[pts.length - 1];
        const [fx] = pts[0];
        return (
          <g key={n}>
            <path d={d} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lx} cy={ly2} r="4.5" fill={color} />
            <text x={(fx + lx) / 2} y="85" fontSize="9" fontWeight="bold" fill={color} textAnchor="middle">
              {n}
            </text>
          </g>
        );
      })}

      {/* axis label */}
      <text x="140" y="96" fontSize="7.5" fill="#94a3b8" textAnchor="middle">← pitch level (1 = low  ·  5 = high) →</text>
    </svg>
  );
}

// ── initials ───────────────────────────────────────────────
const INITIAL_GROUPS = [
  { group: '唇音',  items: ['b','p','m','f'] },
  { group: '舌尖音', items: ['d','t','n','l'] },
  { group: '喉音',  items: ['g','k','h'] },
  { group: '腭音',  items: ['j','q','x'] },
  { group: '卷舌音', items: ['zh','ch','sh','r'] },
  { group: '平舌音', items: ['z','c','s'] },
];

const INITIAL_SYLLABLES = {
  b:  ['ba','bai','ban','bang','bao','bei','ben','beng','bi','bian','biao','bie','bin','bing','bo','bu'],
  p:  ['pa','pai','pan','pang','pao','pei','pen','peng','pi','pian','piao','pie','pin','ping','po','pou','pu'],
  m:  ['ma','mai','man','mang','mao','me','mei','men','meng','mi','mian','miao','mie','min','ming','miu','mo','mou','mu'],
  f:  ['fa','fan','fang','fei','fen','feng','fo','fou','fu'],
  d:  ['da','dai','dan','dang','dao','de','dei','den','deng','di','dian','diao','die','ding','diu','dong','dou','du','duan','dui','dun','duo'],
  t:  ['ta','tai','tan','tang','tao','te','teng','ti','tian','tiao','tie','ting','tong','tou','tu','tuan','tui','tun','tuo'],
  n:  ['na','nai','nan','nang','nao','ne','nei','nen','neng','ni','nian','niang','niao','nie','nin','ning','niu','nong','nou','nu','nuan','nuo','nü','nüe'],
  l:  ['la','lai','lan','lang','lao','le','lei','leng','li','lia','lian','liang','liao','lie','lin','ling','liu','lo','long','lou','lu','luan','lun','luo','lü','lüe'],
  g:  ['ga','gai','gan','gang','gao','ge','gei','gen','geng','gong','gou','gu','gua','guai','guan','guang','gui','gun','guo'],
  k:  ['ka','kai','kan','kang','kao','ke','kei','ken','keng','kong','kou','ku','kua','kuai','kuan','kuang','kui','kun','kuo'],
  h:  ['ha','hai','han','hang','hao','he','hei','hen','heng','hong','hou','hu','hua','huai','huan','huang','hui','hun','huo'],
  j:  ['ji','jia','jian','jiang','jiao','jie','jin','jing','jiong','jiu','ju','juan','jue','jun'],
  q:  ['qi','qia','qian','qiang','qiao','qie','qin','qing','qiong','qiu','qu','quan','que','qun'],
  x:  ['xi','xia','xian','xiang','xiao','xie','xin','xing','xiong','xiu','xu','xuan','xue','xun'],
  zh: ['zha','zhai','zhan','zhang','zhao','zhe','zhei','zhen','zheng','zhi','zhong','zhou','zhu','zhua','zhuai','zhuan','zhuang','zhui','zhun','zhuo'],
  ch: ['cha','chai','chan','chang','chao','che','chen','cheng','chi','chong','chou','chu','chuai','chuan','chuang','chui','chun','chuo'],
  sh: ['sha','shai','shan','shang','shao','she','shei','shen','sheng','shi','shou','shu','shua','shuai','shuan','shuang','shui','shun','shuo'],
  r:  ['ran','rang','rao','re','ren','reng','ri','rong','rou','ru','ruan','rui','run','ruo'],
  z:  ['za','zai','zan','zang','zao','ze','zei','zen','zeng','zi','zong','zou','zu','zuan','zui','zun','zuo'],
  c:  ['ca','cai','can','cang','cao','ce','cen','ceng','ci','cong','cou','cu','cuan','cui','cun','cuo'],
  s:  ['sa','sai','san','sang','sao','se','sen','seng','si','song','sou','su','suan','sui','sun','suo'],
};

const TONE_VOWELS = {
  a: ['ā','á','ǎ','à'],
  e: ['ē','é','ě','è'],
  i: ['ī','í','ǐ','ì'],
  o: ['ō','ó','ǒ','ò'],
  u: ['ū','ú','ǔ','ù'],
  'ü': ['ǖ','ǘ','ǚ','ǜ'],
};

function addTone(syllable, tone) {
  const t = tone - 1;
  if (syllable.includes('a')) return syllable.replace('a', TONE_VOWELS.a[t]);
  if (syllable.includes('e')) return syllable.replace('e', TONE_VOWELS.e[t]);
  if (syllable.includes('ou')) return syllable.replace('o', TONE_VOWELS.o[t]);
  for (let i = syllable.length - 1; i >= 0; i--) {
    const c = syllable[i];
    if (TONE_VOWELS[c]) return syllable.slice(0, i) + TONE_VOWELS[c][t] + syllable.slice(i + 1);
  }
  return syllable;
}

function playSyllable(syllable, tone) {
  const key = syllable.replace(/ü/g, 'v');
  const a = new Audio(`/audio/syllables/${key}${tone}.mp3`);
  a.play().catch(() => {});
}

// ── finals ─────────────────────────────────────────────────
const FINALS = [
  { group: 'Simple vowels 单韵母',   items: ['a','o','e','i','u','ü'] },
  { group: 'Compound -i / -u 复韵母', items: ['ai','ei','ui','ao','ou','iu','ia','ie','ua','uo','üe'] },
  { group: 'Nasal -n 前鼻音',        items: ['an','en','in','un','ün','ian','uan','üan'] },
  { group: 'Nasal -ng 后鼻音',       items: ['ang','eng','ing','iang','uang','iong'] },
  { group: 'W syllables 零声母 w-',  items: ['wu','wa','wai','wan','wang','wei','wen','weng','wo'] },
  { group: 'Y syllables 零声母 y-',  items: ['yu','yuan','yue','yun'] },
];

const FINAL_SPEAK = { 'ü':'鱼','üe':'月','ün':'云','üan':'远','ia':'家','ie':'爷','ua':'花','uo':'火','ao':'猫','ou':'楼','iu':'牛','ui':'水','uan':'换','ian':'天','uang':'王','iang':'想','iong':'熊','ong':'红','ing':'星','ang':'帮','eng':'风','ing 2':'鸡','an':'安','en':'恩','in':'因','un':'运' };

function getFinalSpeak(f) {
  return FINAL_SPEAK[f] || f;
}

// Local finals audio (downloaded from YoYo Chinese)
const YOYO = '/audio/finals/';
const FINAL_AUDIO_BASE = {
  'a':'a',   'o':'o',   'e':'e',
  'i':'yi',  'u':'wu',  'ü':'yu',
  'ai':'ai', 'ei':'ei', 'ui':'wei',
  'ao':'ao', 'ou':'ou', 'iu':'you',
  'ia':'ya', 'ie':'ye', 'ua':'wa', 'uo':'wo', 'üe':'yue',
  'an':'an', 'en':'en', 'in':'yin', 'un':'wen', 'ün':'yun',
  'ian':'yan', 'uan':'wan', 'üan':'yuan',
  'ang':'ang', 'eng':'eng', 'ing':'ying',
  'iang':'yang', 'uang':'wang', 'iong':'yong',
  'wu':'wu', 'wa':'wa', 'wai':'wai', 'wan':'wan',
  'wang':'wang', 'wei':'wei', 'wen':'wen', 'weng':'weng', 'wo':'wo',
  'yu':'yu', 'yuan':'yuan', 'yue':'yue', 'yun':'yun',
};

function playFinalTone(f, tone) {
  const base = FINAL_AUDIO_BASE[f];
  if (base) {
    const a = new Audio(`${YOYO}${base}${tone}.mp3`);
    a.play().catch(() => speak(getFinalSpeak(f), 0.7));
  } else {
    speak(getFinalSpeak(f), 0.7);
  }
}

// ── finals exercise ────────────────────────────────────────
const SIMPLE_FINALS = [
  { label: 'a', file: '/audio/finals/a.mp3', hint: 'like "ah"' },
  { label: 'o', file: '/audio/finals/o.mp3', hint: 'like "oh"' },
  { label: 'e', file: '/audio/finals/e.mp3', hint: 'like "uh"' },
  { label: 'i', file: '/audio/finals/i.mp3', hint: 'like "ee"' },
  { label: 'u', file: '/audio/finals/u.mp3', hint: 'like "oo"' },
  { label: 'ü', file: '/audio/finals/v.mp3', hint: 'round lips, say "ee"' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FinalsExercise() {
  const [queue, setQueue]     = useState(() => shuffle(SIMPLE_FINALS));
  const [qIdx, setQIdx]       = useState(0);
  const [choice, setChoice]   = useState(null); // null | 'correct' | 'wrong'
  const [picked, setPicked]   = useState(null);
  const [score, setScore]     = useState(0);
  const [total, setTotal]     = useState(0);
  const audioRef              = useRef(null);

  const current = queue[qIdx % queue.length];

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const a = new Audio(current.file);
    audioRef.current = a;
    a.play().catch(() => {});
  };

  const handlePick = (label) => {
    if (choice) return;
    const correct = label === current.label;
    setPicked(label);
    setChoice(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
  };

  const handleNext = () => {
    setPicked(null);
    setChoice(null);
    if (qIdx + 1 >= queue.length) {
      setQueue(shuffle(SIMPLE_FINALS));
      setQIdx(0);
    } else {
      setQIdx(i => i + 1);
    }
  };

  const handleRestart = () => {
    setPicked(null);
    setChoice(null);
    setScore(0);
    setTotal(0);
    setQueue(shuffle(SIMPLE_FINALS));
    setQIdx(0);
  };

  return (
    <div className="fe-wrap">
      <div className="fe-score">{score} / {total}</div>

      <p className="fe-prompt">Listen and tap the sound you hear!</p>

      <button className="fe-play-btn" onClick={playSound} aria-label="Play sound">
        🔊
      </button>

      {choice && (
        <div className={`fe-feedback ${choice === 'correct' ? 'fe-feedback--ok' : 'fe-feedback--no'}`}>
          {choice === 'correct'
            ? '🎉 Correct!'
            : `❌ It was  "${current.label}" — ${current.hint}`}
        </div>
      )}

      <div className="fe-choices">
        {SIMPLE_FINALS.map(f => {
          let cls = 'fe-choice';
          if (choice) {
            if (f.label === current.label) cls += ' fe-choice--correct';
            else if (f.label === picked)   cls += ' fe-choice--wrong';
            else                           cls += ' fe-choice--dim';
          }
          return (
            <button key={f.label} className={cls} onClick={() => handlePick(f.label)}>
              {f.label}
            </button>
          );
        })}
      </div>

      {choice && (
        <div className="fe-actions">
          <button className="btn btn-primary fe-next-btn" onClick={handleNext}>Next →</button>
          {total >= 6 && (
            <button className="btn btn-secondary" onClick={handleRestart}>↺ Restart</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── component ──────────────────────────────────────────────
export default function Pinyin({ onNavigate }) {
  const [tab, setTab] = useState('tones');
  const [selectedTone, setSelectedTone] = useState(null);

  const charsByTone = useCallback(t => characters.filter(c => c.tone === t), []);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Pinyin &amp; Tones 🎵</h2>

      <div className="cat-tabs">
        {[['tones','Tones 声调'],['initials','Initials 声母'],['finals','Finals 韵母'],['exercise','Exercise 练习'],['explore','Explore 探索']].map(([id, label]) => (
          <button key={id}
            className={`cat-tab ${tab === id ? 'cat-tab--active' : ''}`}
            onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TONES ── */}
      {tab === 'tones' && (
        <div className="py-section">
          <div className="tone-chart-wrap">
            <ToneChart />
            <p className="tone-chart-caption">The 4 tones of Mandarin Chinese — same sound, different pitch, different meaning!</p>
          </div>

          <div className="tone-mā-strip">
            {TONES.map(t => (
              <button key={t.n} className="tone-mā-btn" style={{ color: t.color, borderColor: t.color + '44' }}
                onClick={() => playAudio(t.audioMa)}>
                <span className="tmb-ex">{t.example}</span>
                <span className="tmb-meaning">{t.meaning}</span>
                <span className="tmb-sound">🔊</span>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button className="btn btn-secondary" onClick={() => {
              const files = TONES.map(t => t.audioMa);
              let i = 0;
              const playNext = () => { if (i < files.length) { const a = new Audio(files[i++]); a.onended = playNext; a.play().catch(() => {}); } };
              playNext();
            }}>
              🔊 Hear all four in a row
            </button>
          </div>

          <div className="tone-cards">
            {TONES.map(t => (
              <div key={t.n} className="tone-card" style={{ background: t.bg, borderColor: t.color }}>
                <div className="tc-row">
                  <span className="tc-num" style={{ color: t.color }}>{t.n}</span>
                  <span className="tc-mark" style={{ color: t.color }}>{t.mark}</span>
                  <span className="tc-chinese" style={{ color: t.color }}>{t.chinese}</span>
                  <span className="tc-name">{t.name}</span>
                </div>
                <p className="tc-desc">{t.desc}</p>
                <div className="tc-bottom">
                  <span className="tc-ex">{t.hanzi} = <em>{t.example}</em> ({t.meaning})</span>
                  <button className="btn-snd" onClick={() => t.audio ? playAudio(t.audio) : speak(t.hanzi)} aria-label={`Hear ${t.example}`}>🔊</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INITIALS ── */}
      {tab === 'initials' && (
        <div className="py-section">
          <p className="py-intro">
            <strong>Initials (声母)</strong> are the sounds at the <em>start</em> of a syllable.
            Tap any toned syllable to hear it!
          </p>
          {INITIAL_GROUPS.map(({ group, items }) => (
            <div key={group} className="py-group">
              <div className="py-group-label">{group}</div>
              {items.map(s => (
                <div key={s} className="py-initial-row">
                  <div className="py-initial-heading">{s}</div>
                  <div className="py-chips py-chips--wrap">
                    {(INITIAL_SYLLABLES[s] || []).map(syl => (
                      <div key={syl} className="py-chip-card py-chip-card--syl">
                        <span className="py-chip-syl-base">{syl}</span>
                        <div className="py-chip-tones">
                          {[1,2,3,4].map(t => (
                            <button key={t} className={`py-chip-t py-chip-tsyl py-chip-t${t}`}
                              onClick={() => playSyllable(syl, t)}>
                              {addTone(syl, t)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="py-note">
            💡 <strong>zh ch sh</strong> — curl your tongue back to make them!
          </div>
          <div className="py-note">
            💡 <strong>z c s</strong> — keep your tongue flat behind your teeth.
          </div>
        </div>
      )}

      {/* ── FINALS ── */}
      {tab === 'finals' && (
        <div className="py-section">
          <p className="py-intro">
            <strong>Finals (韵母)</strong> are the <em>vowel endings</em> — every Chinese syllable ends with one.
            Tap to hear!
          </p>
          {FINALS.map(({ group, items }) => (
            <div key={group} className="py-group">
              <div className="py-group-label">{group}</div>
              <div className="py-chips">
                {items.map(s => (
                  <div key={s} className="py-chip-card py-chip-card--syl">
                    <span className="py-chip-syl-base">{s}</span>
                    <div className="py-chip-tones">
                      {[1,2,3,4].map(t => (
                        <button key={t} className={`py-chip-t py-chip-tsyl py-chip-t${t}`}
                          onClick={() => playFinalTone(s, t)}>{addTone(s, t)}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="py-note">
            💡 <strong>ü</strong> — say "ee" but round your lips like you're blowing out a candle 🕯️
          </div>
          <div className="py-note">
            💡 <strong>e</strong> alone sounds like "uh" (not like English "e")
          </div>
        </div>
      )}

      {/* ── EXERCISE ── */}
      {tab === 'exercise' && (
        <div className="py-section">
          <FinalsExercise />
        </div>
      )}

      {/* ── EXPLORE ── */}
      {tab === 'explore' && (
        <div className="py-section">
          <p className="py-intro">
            Pick a tone to see all our characters with that tone. Tap any character to hear it!
          </p>
          <div className="py-tone-btns">
            {TONES.map(t => (
              <button key={t.n}
                className={`py-tone-btn ${selectedTone === t.n ? 'py-tone-btn--on' : ''}`}
                style={{ '--tc': t.color, '--tbg': t.bg }}
                onClick={() => setSelectedTone(selectedTone === t.n ? null : t.n)}>
                <span className="ptb-mark">{t.mark}</span>
                <span className="ptb-label">Tone {t.n}</span>
                <span className="ptb-count">{charsByTone(t.n).length}</span>
              </button>
            ))}
          </div>

          {selectedTone && (
            <div className="py-char-grid">
              {charsByTone(selectedTone).map(c => (
                <button key={c.char} className="py-char-card"
                  style={{ borderColor: TONES[selectedTone - 1].color + '88' }}
                  onClick={() => speak(c.char)}>
                  <span className="pycc-emoji">{c.emoji}</span>
                  <span className="pycc-char">{c.char}</span>
                  <span className="pycc-pinyin" style={{ color: TONES[selectedTone - 1].color }}>{c.pinyin}</span>
                  <span className="pycc-meaning">{c.meaning}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
