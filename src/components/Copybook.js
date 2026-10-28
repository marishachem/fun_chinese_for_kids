import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';
import characters from '../data/characters';

const CATS = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];
const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];
const COLS = 6;
const ROWS = 5;
const REF_OPS = [1, 0.55, 0.22]; // first 3 cells = fading reference

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

  const cellRefs = useRef({});
  const writerRef = useRef(null);

  useEffect(() => {
    setGrid(makeGrid());
    setActiveIdx(null);
  }, [ch.char]);

  // When activeIdx changes, spin up hanzi-writer inside that cell
  useEffect(() => {
    if (activeIdx === null) return;

    // Small delay so the .cbk-inline-writer div is in the DOM
    const timer = setTimeout(() => {
      const cellEl = cellRefs.current[activeIdx];
      if (!cellEl) return;
      const container = cellEl.querySelector('.cbk-inline-writer');
      if (!container) return;
      container.innerHTML = '';

      const rect = cellEl.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height)) - 2;

      try {
        if (writerRef.current) { try { writerRef.current.cancelQuiz(); } catch {} }
        writerRef.current = HanziWriter.create(container, ch.char, {
          width: size, height: size,
          padding: Math.max(4, Math.floor(size * 0.07)),
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
            // Auto-advance to next empty cell
            setActiveIdx(prev => {
              const nextEmpty = grid.findIndex((c, i) => c.state === 'empty' && i > prev);
              return nextEmpty !== -1 ? nextEmpty : null;
            });
          },
        });
      } catch {}
    }, 30);

    return () => {
      clearTimeout(timer);
      try { writerRef.current?.cancelQuiz(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, ch.char]);

  const handleCellClick = useCallback((idx, cell) => {
    if (cell.state !== 'empty' || idx === activeIdx) return;
    setActiveIdx(idx);
  }, [activeIdx]);

  const handleCat = (c) => { setCat(c); setCharIdx(0); };
  const handleChar = (dir) => setCharIdx(i => Math.max(0, Math.min(filtered.length - 1, i + dir)));

  const doneCells = grid.filter(c => c.state === 'done').length;
  const totalPractice = ROWS * COLS - REF_OPS.length;

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

      <div className="cbk-grid">
        {grid.map((cell, i) => (
          <div
            key={i}
            ref={el => { cellRefs.current[i] = el; }}
            className={[
              'cbk-cell',
              cell.state === 'empty' ? 'cbk-cell--empty' : '',
              i === activeIdx ? 'cbk-cell--active' : '',
              cell.state === 'done' ? 'cbk-cell--done' : '',
              cell.state === 'ref' ? 'cbk-cell--ref' : '',
            ].join(' ')}
            onClick={() => handleCellClick(i, cell)}
          >
            {i === activeIdx
              ? <div className="cbk-inline-writer" />
              : cell.state === 'ref'
                ? <span className="cbk-char" style={{ opacity: cell.opacity }}>{ch.char}</span>
                : cell.state === 'done'
                  ? <span className="cbk-char" style={{ opacity: 0.2 }}>{ch.char}</span>
                  : null
            }
          </div>
        ))}
      </div>

      <div className="cbk-progress-row">
        <div className="cbk-prog-bar-bg">
          <div className="cbk-prog-bar-fill" style={{ width: `${(doneCells / totalPractice) * 100}%` }} />
        </div>
        <span className="cbk-prog-label">{doneCells}/{totalPractice}</span>
      </div>

      <p className="cbk-hint">
        {doneCells === totalPractice
          ? '🏆 All done!'
          : activeIdx !== null
            ? '✏️ Trace the strokes'
            : 'Tap a cell to write'}
      </p>

      <div className="cbk-bottom">
        <button className="btn btn-secondary" onClick={() => { setGrid(makeGrid()); setActiveIdx(null); }}>
          ↺ Reset
        </button>
        <button className="btn btn-primary" onClick={() => handleChar(1)} disabled={charIdx === filtered.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
