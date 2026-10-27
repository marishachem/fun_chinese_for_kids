import React, { useState } from 'react';
import { LOCATIONS, getProgress, getLocationIndex } from '../utils/progress';

const modes = [
  { id: 'flashcards', label: 'Flash Cards',  emoji: '🃏', desc: 'Learn words with pictures', color: 'red' },
  { id: 'stroke',     label: 'Stroke Order', emoji: '✏️', desc: 'Watch how to write',         color: 'blue' },
  { id: 'copybook',   label: 'Copybook',     emoji: '📝', desc: 'Practice tracing',            color: 'green' },
  { id: 'quiz',       label: 'Quiz',         emoji: '🌟', desc: 'Test what you know',          color: 'purple' },
  { id: 'numbers',    label: 'Numbers',      emoji: '🔢', desc: 'Count on one hand!',          color: 'orange' },
  { id: 'pinyin',     label: 'Pinyin',       emoji: '🎵', desc: 'Tones, sounds & phonics',     color: 'teal' },
  { id: 'stories',    label: 'Stories',      emoji: '📖', desc: 'Read fun Chinese stories',    color: 'gold' },
];

function Home({ onNavigate }) {
  const [prog] = useState(() => getProgress());
  const count  = prog.learned.length;
  const locIdx = getLocationIndex(count);
  const loc    = LOCATIONS[locIdx];
  const next   = LOCATIONS[locIdx + 1] || null;
  const pct    = next
    ? Math.min(100, ((count - loc.req) / (next.req - loc.req)) * 100)
    : 100;

  return (
    <div className="page home-page">
      <div className="home-header">
        <div className="home-lanterns">🏮 🏮</div>
        <h1 className="home-title">快乐中文！</h1>
        <p className="home-subtitle">Fun Chinese for Kids</p>
      </div>

      {/* ── progress widget ── */}
      <button className="home-progress" onClick={() => onNavigate('map')}>
        <div className="hp-left">
          <img src={loc.image} alt={loc.nameEn} className="hp-img" />
          <div>
            <div className="hp-loc">{loc.name} · {loc.nameEn}</div>
            <div className="hp-count">{count} words learned</div>
          </div>
        </div>
        <div className="hp-right">
          {next ? (
            <>
              <div className="hp-bar-bg">
                <div className="hp-bar-fill" style={{ width: `${pct}%`, background: loc.color }} />
              </div>
              <div className="hp-next">→ {next.nameEn} in {next.req - count}</div>
            </>
          ) : (
            <div className="hp-done">🏆 Complete!</div>
          )}
          <div className="hp-map-link">View map 🗺️</div>
        </div>
      </button>

      <div className="mode-grid">
        {modes.map(m => (
          <button
            key={m.id}
            className={`mode-card mode-card--${m.color}`}
            onClick={() => onNavigate(m.id)}
          >
            <span className="mode-emoji">{m.emoji}</span>
            <span className="mode-label">{m.label}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </div>

      <p className="home-footer">105 characters · ages 6–8 · 🇨🇳</p>
    </div>
  );
}

export default Home;
