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

// ── tone data ──────────────────────────────────────────────
const TONES = [
  {
    n: 1, mark: 'ā', color: '#dc2626', bg: '#fef2f2',
    name: 'First Tone',   chinese: '第一声',
    desc: 'High and flat — hold it steady, like humming a musical note',
    hanzi: '妈', example: 'mā', meaning: 'mom',
  },
  {
    n: 2, mark: 'á', color: '#d97706', bg: '#fefce8',
    name: 'Second Tone',  chinese: '第二声',
    desc: 'Rising — like asking "really?" in surprise',
    hanzi: '麻', example: 'má', meaning: 'hemp / numb',
  },
  {
    n: 3, mark: 'ǎ', color: '#16a34a', bg: '#f0fdf4',
    name: 'Third Tone',   chinese: '第三声',
    desc: 'Dipping then rising — start medium, dip low, then come back up',
    hanzi: '马', example: 'mǎ', meaning: 'horse',
  },
  {
    n: 4, mark: 'à', color: '#2563eb', bg: '#eff6ff',
    name: 'Fourth Tone',  chinese: '第四声',
    desc: 'Falling sharply — start high and drop fast, like saying "No!"',
    hanzi: '骂', example: 'mà', meaning: 'scold',
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
const INITIALS = [
  { group: 'Lip sounds 唇音',  items: ['b','p','m','f'] },
  { group: 'Tongue tip 舌尖',  items: ['d','t','n','l'] },
  { group: 'Throat 喉音',      items: ['g','k','h'] },
  { group: 'Palatal 腭音',     items: ['j','q','x'] },
  { group: 'Retroflex 卷舌',   items: ['zh','ch','sh','r'] },
  { group: 'Sibilant 平舌',    items: ['z','c','s'] },
];

// speak initial with a neutral vowel so it's audible
const INITIAL_SPEAK = { b:'玻',p:'坡',m:'摸',f:'佛',d:'得',t:'特',n:'讷',l:'勒',g:'哥',k:'科',h:'喝',j:'基',q:'欺',x:'希',zh:'知',ch:'吃',sh:'诗',r:'日',z:'资',c:'雌',s:'思' };

// ── finals ─────────────────────────────────────────────────
const FINALS = [
  { group: 'Simple vowels 单韵母',   items: ['a','o','e','i','u','ü'] },
  { group: 'Compound -i / -u 复韵母', items: ['ai','ei','ui','ao','ou','iu','ia','ie','ua','uo','üe'] },
  { group: 'Nasal -n 前鼻音',        items: ['an','en','in','un','ün','ian','uan','üan'] },
  { group: 'Nasal -ng 后鼻音',       items: ['ang','eng','ing','ong','iang','uang','iong'] },
];

const FINAL_SPEAK = { 'ü':'鱼','üe':'月','ün':'云','üan':'远','ia':'家','ie':'爷','ua':'花','uo':'火','ao':'猫','ou':'楼','iu':'牛','ui':'水','uan':'换','ian':'天','uang':'王','iang':'想','iong':'熊','ong':'红','ing':'星','ang':'帮','eng':'风','ing 2':'鸡','an':'安','en':'恩','in':'因','un':'运' };

function getFinalSpeak(f) {
  return FINAL_SPEAK[f] || f;
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
                onClick={() => speak(t.hanzi)}>
                <span className="tmb-ex">{t.example}</span>
                <span className="tmb-meaning">{t.meaning}</span>
                <span className="tmb-sound">🔊</span>
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button className="btn btn-secondary" onClick={() => speak('妈麻马骂')}>
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
                  <button className="btn-snd" onClick={() => speak(t.hanzi)} aria-label={`Hear ${t.example}`}>🔊</button>
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
            <strong>Initials (声母)</strong> are the consonants at the <em>start</em> of a syllable — like "b" in "bā".
            Tap any to hear it!
          </p>
          {INITIALS.map(({ group, items }) => (
            <div key={group} className="py-group">
              <div className="py-group-label">{group}</div>
              <div className="py-chips">
                {items.map(s => (
                  <button key={s} className="py-chip"
                    onClick={() => speak(INITIAL_SPEAK[s] || s, 0.7)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="py-note">
            💡 <strong>zh ch sh</strong> are "retroflex" — curl your tongue back to make them!
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
                  <button key={s} className="py-chip"
                    onClick={() => speak(getFinalSpeak(s), 0.7)}>
                    {s}
                  </button>
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
