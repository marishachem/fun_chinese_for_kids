import React, { useState, useEffect, useRef, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import characters from '../data/characters';

const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];

// Build sorted category list, 'all' first
const CATEGORIES = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];

function StrokeOrder({ onNavigate }) {
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(0);   // index into full characters array
  const containerRef = useRef(null);
  const writerRef = useRef(null);

  const filtered = useMemo(
    () => cat === 'all' ? characters : characters.filter(c => c.category === cat),
    [cat]
  );

  // When category changes, reset selection to the first char in that category
  const handleCat = (c) => {
    setCat(c);
    const first = c === 'all' ? 0 : characters.findIndex(ch => ch.category === c);
    setSelected(first >= 0 ? first : 0);
  };

  const char = characters[selected];

  useEffect(() => {
    if (!containerRef.current || !char) return;
    containerRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(containerRef.current, char.char, {
      width: 220,
      height: 220,
      padding: 12,
      showOutline: true,
      strokeColor: '#1a1a2e',
      outlineColor: '#cbd5e1',
      strokeAnimationSpeed: 0.8,
      delayBetweenStrokes: 500,
    });

    writerRef.current.loopCharacterAnimation();
  }, [char?.char]);

  if (!char) return null;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Stroke Order ✏️</h2>

      {/* category tabs */}
      <div className="cat-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`cat-tab ${c === cat ? 'cat-tab--active' : ''}`}
            onClick={() => handleCat(c)}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* character chips for current category */}
      <div className="char-selector">
        {filtered.map(c => {
          const idx = characters.indexOf(c);
          return (
            <button
              key={c.char}
              className={`char-chip ${idx === selected ? 'char-chip--active' : ''}`}
              onClick={() => setSelected(idx)}
            >
              {c.char}
            </button>
          );
        })}
      </div>

      <div className="stroke-main">
        <div className="tian-zi-ge tian-zi-ge--240">
          <div ref={containerRef} className="hw-wrap" />
        </div>

        <div className="stroke-info">
          <div className="si-char">{char.char}</div>
          <div className={`si-pinyin ${TONE_CLS[char.tone]}`}>{char.pinyin}</div>
          <div className="si-meaning">{char.meaning}</div>
          <div className="si-emoji">{char.emoji}</div>
          <div className="si-cat">{char.category}</div>
          <div className="stroke-btns">
            <button
              className="btn btn-primary"
              onClick={() => writerRef.current?.animateCharacter()}
            >
              ▶ Animate
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => { writerRef.current?.cancelAnimation(); writerRef.current?.showCharacter(); }}
            >
              Show
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrokeOrder;
