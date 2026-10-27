import React, { useState, useEffect, useRef, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import characters from '../data/characters';

const CATS = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];
const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];

function Copybook({ onNavigate }) {
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(0);   // index into full characters array
  const [completed, setCompleted] = useState(false);
  const exampleRef = useRef(null);
  const practiceRef = useRef(null);

  const filtered = useMemo(
    () => cat === 'all' ? characters : characters.filter(c => c.category === cat),
    [cat]
  );

  const handleCat = (c) => {
    setCat(c);
    const pool = c === 'all' ? characters : characters.filter(ch => ch.category === c);
    setSelected(characters.indexOf(pool[0]));
  };

  const char = characters[selected];

  const startPractice = (charStr) => {
    if (!practiceRef.current) return;
    practiceRef.current.innerHTML = '';
    setCompleted(false);

    const writer = HanziWriter.create(practiceRef.current, charStr, {
      width: 200, height: 200, padding: 10,
      showOutline: true,
      strokeColor: '#16a34a', outlineColor: '#bbf7d0',
      drawingColor: '#16a34a',
      showCharacter: false,
      showHintAfterMisses: 3,
    });
    writer.quiz({
      onMistake: () => {},
      onCorrectStroke: () => {},
      onComplete: () => setCompleted(true),
    });
  };

  useEffect(() => {
    if (!exampleRef.current) return;
    exampleRef.current.innerHTML = '';

    const writer = HanziWriter.create(exampleRef.current, char.char, {
      width: 200, height: 200, padding: 10,
      showOutline: true,
      strokeColor: '#1a1a2e', outlineColor: '#e2e8f0',
      strokeAnimationSpeed: 0.6, delayBetweenStrokes: 600,
    });
    writer.loopCharacterAnimation();
    startPractice(char.char);

    return () => writer.cancelAnimation?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char.char]);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Copybook 📝</h2>

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

      <div className="copybook-info">
        <span className={`cb-pinyin ${TONE_CLS[char.tone]}`}>{char.pinyin}</span>
        <span className="cb-sep">·</span>
        <span className="cb-meaning">{char.meaning}</span>
        <span className="cb-emoji">{char.emoji}</span>
      </div>

      <div className="copybook-panels">
        <div className="copybook-panel">
          <p className="panel-title">Watch</p>
          <div className="tian-zi-ge tian-zi-ge--200">
            <div ref={exampleRef} className="hw-wrap" />
          </div>
        </div>

        <div className="copybook-panel">
          <p className="panel-title">Trace it!</p>
          <div className="tian-zi-ge tian-zi-ge--200">
            <div ref={practiceRef} className="hw-wrap" />
          </div>
          {completed ? (
            <div className="completed-msg">
              <span>🌟 Great job! 🌟</span>
              <button className="btn btn-primary" onClick={() => startPractice(char.char)}>
                Try Again!
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => startPractice(char.char)}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Copybook;
