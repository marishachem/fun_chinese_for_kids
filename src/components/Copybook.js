import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';
import characters from '../data/characters';

const CATS = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];
const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];
const COLS = 8;
const ROWS = 6;
// First 4 cells of row 1 are reference cells at fading opacities
const REF_OPS = [1, 0.6, 0.35, 0.15];

function makeGrid() {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    if (row === 0 && col < REF_OPS.length) {
      return { state: 'ref', opacity: REF_OPS[col] };
    }
    return { state: 'empty' };
  });
}

export default function Copybook({ onNavigate }) {
  const [cat, setCat] = useState('all');
  const filtered = useMemo(
    () => cat === 'all' ? characters : characters.filter(c => c.category === cat),
    [cat]
  );
  const [charIdx, setCharIdx] = useState(0);
  const ch = filtered[Math.min(charIdx, filtered.length - 1)];

  const [grid, setGrid] = useState(makeGrid);
  const [activeIdx, setActiveIdx] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const quizRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    setGrid(makeGrid());
    setActiveIdx(null);
    setQuizDone(false);
  }, [ch.char]);

  useEffect(() => {
    if (activeIdx === null || !quizRef.current) return;
    quizRef.current.innerHTML = '';
    setQuizDone(false);
    try {
      writerRef.current = HanziWriter.create(quizRef.current, ch.char, {
        width: 220, height: 220, padding: 16,
        showOutline: true,
        strokeColor: '#db2777',
        outlineColor: '#fce7f3',
        drawingColor: '#7c3aed',
        showHintAfterMisses: 3,
      });
      writerRef.current.quiz({
        onComplete: () => {
          setGrid(prev => {
            const next = [...prev];
            next[activeIdx] = { state: 'done' };
            return next;
          });
          setQuizDone(true);
        },
      });
    } catch {}
    return () => { try { writerRef.current?.cancelQuiz(); } catch {} };
  }, [activeIdx, ch.char]);

  const handleCellClick = useCallback((idx, cell) => {
    if (cell.state !== 'empty') return;
    setActiveIdx(idx);
    setQuizDone(false);
  }, []);

  const handleCat = (c) => { setCat(c); setCharIdx(0); };
  const handleChar = (dir) => setCharIdx(i => Math.max(0, Math.min(filtered.length - 1, i + dir)));

  const doneCells = grid.filter(c => c.state === 'done').length;
  const totalPractice = ROWS * COLS - REF_OPS.length;

  const goNextEmpty = () => {
    const next = grid.findIndex((c, i) => c.state === 'empty' && i > (activeIdx ?? -1));
    setActiveIdx(next !== -1 ? next : null);
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Copybook 字帖</h2>

      <div className="cat-tabs">
        {CATS.map(c => (
          <button key={c} className={`cat-tab ${c === cat ? 'cat-tab--active' : ''}`}
            onClick={() => handleCat(c)}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Character header */}
      <div className="cbk-header">
        <button className="cbk-nav" onClick={() => handleChar(-1)} disabled={charIdx === 0}>‹</button>
        <div className="cbk-info">
          <span className="cbk-big">{ch.char}</span>
          <div className="cbk-sub">
            <span className={`cbk-pinyin ${TONE_CLS[ch.tone]}`}>{ch.pinyin}</span>
            <span className="cbk-dot">·</span>
            <span className="cbk-meaning">{ch.emoji} {ch.meaning}</span>
          </div>
        </div>
        <button className="cbk-nav" onClick={() => handleChar(1)} disabled={charIdx === filtered.length - 1}>›</button>
      </div>

      {/* Copybook grid */}
      <div className="cbk-grid">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={[
              'cbk-cell',
              cell.state === 'empty' ? 'cbk-cell--empty' : '',
              i === activeIdx ? 'cbk-cell--active' : '',
              cell.state === 'done' ? 'cbk-cell--done' : '',
              cell.state === 'ref' ? 'cbk-cell--ref' : '',
            ].join(' ')}
            onClick={() => handleCellClick(i, cell)}
          >
            {(cell.state === 'ref' || cell.state === 'done') && (
              <span
                className="cbk-char"
                style={{ opacity: cell.state === 'ref' ? cell.opacity : 0.2 }}
              >
                {ch.char}
              </span>
            )}
            {i === activeIdx && cell.state === 'empty' && (
              <span className="cbk-active-dot" />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="cbk-progress-row">
        <div className="cbk-prog-bar-bg">
          <div className="cbk-prog-bar-fill" style={{ width: `${(doneCells / totalPractice) * 100}%` }} />
        </div>
        <span className="cbk-prog-label">{doneCells}/{totalPractice}</span>
      </div>

      {/* Quiz panel */}
      {activeIdx !== null ? (
        <div className="cbk-quiz">
          <div className="cbk-quiz-title">
            {quizDone ? '🎉 Well done!' : '✏️ Trace the character'}
          </div>
          <div className="tian cbk-quiz-box" ref={quizRef} />
          {quizDone && (
            <div className="cbk-quiz-btns">
              <button className="btn btn-secondary" onClick={() => setActiveIdx(null)}>← Back to grid</button>
              <button className="btn btn-primary" onClick={goNextEmpty}>Next cell →</button>
            </div>
          )}
        </div>
      ) : (
        <p className="cbk-hint">
          {doneCells === totalPractice
            ? '🏆 All done! Great work!'
            : 'Tap an empty cell to trace'}
        </p>
      )}

      <div className="cbk-bottom">
        <button className="btn btn-secondary" onClick={() => { setGrid(makeGrid()); setActiveIdx(null); }}>
          ↺ Reset
        </button>
        <button className="btn btn-primary" onClick={() => handleChar(1)} disabled={charIdx === filtered.length - 1}>
          Next character →
        </button>
      </div>
    </div>
  );
}
