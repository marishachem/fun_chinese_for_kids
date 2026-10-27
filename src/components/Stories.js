import React, { useState, useMemo } from 'react';
import characters from '../data/characters';
import stories from '../data/stories';

// lookup map: char → character data
const charMap = Object.fromEntries(characters.map(c => [c.char, c]));

const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];

function tokenize(text) {
  return [...text].map(ch => ({ ch, data: charMap[ch] || null }));
}

// ── Story List ────────────────────────────────────────────
function StoryList({ onNavigate, onSelect }) {
  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Stories 📖</h2>
      <div className="story-grid">
        {stories.map(s => (
          <button
            key={s.id}
            className={`story-card story-card--${s.color}`}
            onClick={() => onSelect(s)}
          >
            <div className="sc-cover">{s.cover}</div>
            <div className="sc-body">
              <div className="sc-title">{s.title}</div>
              <div className="sc-en">{s.titleEn}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Story Reader ──────────────────────────────────────────
function StoryReader({ story, onBack }) {
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(null);

  const current = story.pages[page];
  const tokens = useMemo(() => tokenize(current.zh), [current.zh]);

  const go = (dir) => {
    setPage(p => p + dir);
    setActive(null);
  };

  const toggle = (data) => setActive(a => (a?.char === data.char ? null : data));

  return (
    <div className="page story-reader-page">
      <div className="sr-header">
        <button className="back-btn" onClick={onBack}>← Stories</button>
        <span className="sr-progress">{page + 1} / {story.pages.length}</span>
      </div>
      <h3 className="sr-title">{story.titleEn}</h3>

      {/* illustration */}
      <div className="sr-art">{current.art}</div>

      {/* sentence */}
      <div className="sr-sentence">
        {tokens.map((t, i) =>
          t.data ? (
            <span
              key={i}
              className={`sr-char-known ${active?.char === t.ch ? 'active' : ''}`}
              onClick={() => toggle(t.data)}
            >
              {t.ch}
            </span>
          ) : (
            <span key={i} className="sr-char">{t.ch}</span>
          )
        )}
      </div>

      {/* character popup */}
      {active && (
        <div className="sr-popup">
          <button className="sr-popup-close" onClick={() => setActive(null)}>✕</button>
          <span className="srp-char">{active.char}</span>
          <span className={`srp-pinyin ${TONE_CLS[active.tone]}`}>{active.pinyin}</span>
          <span className="srp-meaning">{active.meaning}</span>
          {active.image
            ? <img src={active.image} alt={active.meaning} className="srp-img" />
            : <span className="srp-emoji">{active.emoji}</span>}
        </div>
      )}

      {/* navigation */}
      <div className="sr-nav">
        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() => go(-1)}
        >
          ◀
        </button>
        <div className="sr-dots">
          {story.pages.map((_, i) => (
            <span key={i} className={`sr-dot ${i === page ? 'sr-dot--active' : ''}`} />
          ))}
        </div>
        <button
          className="btn btn-secondary"
          disabled={page === story.pages.length - 1}
          onClick={() => go(1)}
        >
          ▶
        </button>
      </div>

      {page === story.pages.length - 1 && (
        <div className="sr-end">
          <span>🎉 The End!</span>
          <button className="btn btn-primary" onClick={onBack}>Read Another →</button>
        </div>
      )}
    </div>
  );
}

// ── Main wrapper ──────────────────────────────────────────
function Stories({ onNavigate }) {
  const [story, setStory] = useState(null);

  if (!story) return <StoryList onNavigate={onNavigate} onSelect={setStory} />;
  return <StoryReader story={story} onBack={() => setStory(null)} />;
}

export default Stories;
