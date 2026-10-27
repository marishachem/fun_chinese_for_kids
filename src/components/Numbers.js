import React, { useState } from 'react';

const NUMS = [
  { n: 1,  char: '一', pinyin: 'yī',  tone: 1, note: null },
  { n: 2,  char: '二', pinyin: 'èr',  tone: 4, note: null },
  { n: 3,  char: '三', pinyin: 'sān', tone: 1, note: null },
  { n: 4,  char: '四', pinyin: 'sì',  tone: 4, note: null },
  { n: 5,  char: '五', pinyin: 'wǔ',  tone: 3, note: null },
  { n: 6,  char: '六', pinyin: 'liù', tone: 4, chinese: true, note: '🇨🇳 Thumb + pinky out — special Chinese way!' },
  { n: 7,  char: '七', pinyin: 'qī',  tone: 1, chinese: true, note: '🇨🇳 Thumb, index and middle fingertips touching' },
  { n: 8,  char: '八', pinyin: 'bā',  tone: 1, chinese: true, note: '🇨🇳 Thumb up, index pointing out — like a 🔫' },
  { n: 9,  char: '九', pinyin: 'jiǔ', tone: 3, chinese: true, note: '🇨🇳 Index finger bent and hooked down' },
  { n: 10, char: '十', pinyin: 'shí', tone: 2, chinese: true, note: '🇨🇳 Make a fist — or cross two index fingers ✕' },
];

const TONE_CLS   = ['tone-0','tone-1','tone-2','tone-3','tone-4'];
const NUM_COLORS = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6',
                    '#8B5CF6','#EC4899','#14B8A6','#F59E0B','#6366F1'];

function Numbers({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? NUMS[selected] : null;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Numbers 🔢</h2>

      <div className="numbers-intro">
        In China you count <strong>1 – 10</strong> using just <strong>one hand</strong>! 🖐️
        <span className="ni-badge">Numbers 6–10 are uniquely Chinese 🇨🇳</span>
      </div>

      <div className="numbers-grid">
        {NUMS.map((num, i) => (
          <button
            key={num.n}
            className={`num-card ${i === selected ? 'num-card--sel' : ''} ${num.chinese ? 'num-card--cn' : ''}`}
            onClick={() => setSelected(i === selected ? null : i)}
          >
            <img
              src={`/hands/${num.n}.png`}
              alt={`Hand showing ${num.n}`}
              className="num-hand-img"
            />
            <div className="nc-digit" style={{ color: NUM_COLORS[i] }}>{num.n}</div>
            <div className="nc-char">{num.char}</div>
            <div className={`nc-pinyin ${TONE_CLS[num.tone]}`}>{num.pinyin}</div>
            {num.chinese && <div className="nc-cn-dot" title="Unique Chinese gesture">🇨🇳</div>}
          </button>
        ))}
      </div>

      {sel && (
        <div className={`num-detail ${sel.chinese ? 'num-detail--cn' : ''}`}>
          <img
            src={`/hands/${sel.n}.png`}
            alt={`Hand showing ${sel.n}`}
            className="num-hand-img num-hand-img--lg"
          />
          <div className="nd-info">
            <div className="nd-digit" style={{ color: NUM_COLORS[selected] }}>{sel.n}</div>
            <div className="nd-char">{sel.char}</div>
            <div className={`nd-pinyin ${TONE_CLS[sel.tone]}`}>{sel.pinyin}</div>
            {sel.note
              ? <div className="nd-note">{sel.note}</div>
              : <div className="nd-note nd-note--plain">Same as Western counting!</div>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default Numbers;
