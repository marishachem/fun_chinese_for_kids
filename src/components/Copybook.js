import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DrawingCanvas from './DrawingCanvas';
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

  // Load saved grid when character changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cbk_${ch.char}`);
      setGrid(saved ? JSON.parse(saved) : makeGrid());
    } catch { setGrid(makeGrid()); }
    setActiveIdx(null);
  }, [ch.char]);

  const markDone = useCallback((idx, dataURL) => {
    setGrid(prev => {
      const n = [...prev];
      n[idx] = { state: 'done', drawing: dataURL };
      try { localStorage.setItem(`cbk_${ch.char}`, JSON.stringify(n)); } catch {}
      return n;
    });
    setActiveIdx(prev => {
      const nextEmpty = grid.findIndex((c, i) => c.state === 'empty' && i > prev);
      return nextEmpty !== -1 ? nextEmpty : null;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, ch.char]);

  const handleCellClick = useCallback((idx, cell) => {
    if (cell.state === 'empty' && idx !== activeIdx) setActiveIdx(idx);
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
              ? <DrawingCanvas
                  guide={<span className="cbk-char">{ch.char}</span>}
                  onDone={(dataURL) => markDone(i, dataURL)}
                />
              : cell.state === 'ref'
                ? <span className="cbk-char" style={{ opacity: cell.opacity }}>{ch.char}</span>
                : cell.state === 'done'
                  ? <>
                      <span className="cbk-char" style={{ opacity: 0.12 }}>{ch.char}</span>
                      {cell.drawing && <img src={cell.drawing} alt="" className="dc-saved-drawing" />}
                    </>
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
        <button className="btn btn-secondary" onClick={() => { const g = makeGrid(); setGrid(g); setActiveIdx(null); try { localStorage.setItem(`cbk_${ch.char}`, JSON.stringify(g)); } catch {} }}>
          ↺ Reset
        </button>
        <button className="btn btn-primary" onClick={() => handleChar(1)} disabled={charIdx === filtered.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
