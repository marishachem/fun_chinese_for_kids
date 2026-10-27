import React, { useState, useMemo } from 'react';
import characters from '../data/characters';

const CATS = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];
const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];

function FlashCards({ onNavigate }) {
  const [cat, setCat] = useState('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(
    () => cat === 'all' ? characters : characters.filter(c => c.category === cat),
    [cat]
  );

  const char = filtered[Math.min(index, filtered.length - 1)];

  const handleCat = (c) => { setCat(c); setIndex(0); setFlipped(false); };
  const go = (dir) => {
    setIndex(i => (i + dir + filtered.length) % filtered.length);
    setFlipped(false);
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Flash Cards 🃏</h2>

      <div className="cat-tabs">
        {CATS.map(c => (
          <button
            key={c}
            className={`cat-tab ${c === cat ? 'cat-tab--active' : ''}`}
            onClick={() => handleCat(c)}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="flashcard-wrap">
        <div className="flashcard" onClick={() => setFlipped(f => !f)}>
          <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              {char.image
                ? <img src={char.image} alt={char.meaning} className="fc-img" />
                : <div className="fc-emoji">{char.emoji}</div>}
              <div className="fc-char">{char.char}</div>
              <div className={`fc-pinyin ${TONE_CLS[char.tone]}`}>{char.pinyin}</div>
              <div className="fc-hint">tap to reveal meaning</div>
            </div>
            <div className="flashcard-back">
              {char.image
                ? <img src={char.image} alt={char.meaning} className="fc-img" />
                : <div className="fc-emoji">{char.emoji}</div>}
              <div className="fc-char">{char.char}</div>
              <div className={`fc-pinyin ${TONE_CLS[char.tone]}`}>{char.pinyin}</div>
              <div className="fc-meaning">{char.meaning}</div>
            </div>
          </div>
        </div>

        <div className="fc-nav">
          <button className="btn btn-secondary" onClick={() => go(-1)}>◀</button>
          <span className="fc-counter">{index + 1} / {filtered.length}</span>
          <button className="btn btn-secondary" onClick={() => go(1)}>▶</button>
        </div>

        <div className="fc-dots">
          {filtered.map((_, i) => (
            <button
              key={i}
              className={`fc-dot ${i === index ? 'fc-dot--active' : ''}`}
              onClick={() => { setIndex(i); setFlipped(false); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlashCards;
