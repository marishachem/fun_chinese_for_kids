import React, { useState, useEffect, useCallback } from 'react';
import DrawingCanvas from './DrawingCanvas';
import { STROKES } from '../data/strokes';
import { recordCompletedGrid } from '../utils/stickers';

const COLS = 6;
const ROWS = 2;
const REF_OPS = [1, 0.55, 0.22];

function makeGrid() {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    if (row === 0 && col < REF_OPS.length) return { state: 'ref', opacity: REF_OPS[col] };
    return { state: 'empty' };
  });
}

// Inline SVG that draws the stroke shape (path from strokes.js)
function StrokeSVG({ path, size = 52 }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke="#1e293b" strokeWidth="5.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// [ - - → ] direction indicator matching the physical book
function DirectionArrow({ rotation }) {
  return (
    <svg
      viewBox="0 0 80 36"
      className="sg-arrow-svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Left bracket */}
      <polyline points="14,6 8,6 8,30 14,30"
        fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dashed line */}
      <line x1="16" y1="18" x2="54" y2="18"
        stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round"/>
      {/* Arrowhead */}
      <polyline points="48,12 60,18 48,24"
        fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right bracket */}
      <polyline points="66,6 72,6 72,30 66,30"
        fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Detail / practice page ───────────────────────────────────
function StrokeDetail({ stroke, onClose, onNext, onPrev, onNewSticker }) {
  const [grid, setGrid] = useState(makeGrid);
  const [activeIdx, setActiveIdx] = useState(null);
  const tc = stroke.traceChar || stroke.char;

  // Load saved grid when stroke changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sgg_${stroke.id}`);
      setGrid(saved ? JSON.parse(saved) : makeGrid());
    } catch { setGrid(makeGrid()); }
    setActiveIdx(null);
  }, [stroke.id]);

  const markDone = useCallback((idx, dataURL) => {
    let gridComplete = false;
    setGrid(prev => {
      const n = [...prev];
      n[idx] = { state: 'done', drawing: dataURL };
      const practiceTotal = ROWS * COLS - REF_OPS.length;
      if (n.filter(c => c.state === 'done').length === practiceTotal) gridComplete = true;
      try { localStorage.setItem(`sgg_${stroke.id}`, JSON.stringify(n)); } catch {}
      return n;
    });
    if (gridComplete) {
      const newSticker = recordCompletedGrid();
      if (newSticker && onNewSticker) onNewSticker(newSticker);
    }
    setActiveIdx(prev => {
      const nextEmpty = grid.findIndex((c, i) => c.state === 'empty' && i > prev);
      return nextEmpty !== -1 ? nextEmpty : null;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, stroke.id, onNewSticker]);

  const doneCells = grid.filter(c => c.state === 'done').length;
  const totalPractice = ROWS * COLS - REF_OPS.length;

  return (
    <div className="page">
      <button className="back-btn" onClick={onClose}>← All Strokes</button>

      {/* How-to-draw header */}
      <div className="sgg-detail-header">
        <div className="sgg-dh-top">
          {stroke.img
            ? <img src={stroke.img} alt={stroke.name} className="sgg-stroke-img sgg-stroke-img--lg" />
            : stroke.path
              ? <StrokeSVG path={stroke.path} size={60} />
              : <span className="sgg-dh-char">{stroke.char}</span>}
          <DirectionArrow rotation={stroke.arrowRot} />
          <div>
            <div className="sgg-dh-name">{stroke.name}</div>
            <div className="sgg-dh-cn">{stroke.chinese}</div>
          </div>
        </div>
        <div className="sgg-how-to">
          ✏️ {stroke.howToDraw}
        </div>
        <div className="sgg-example-label">
          Example: <span className="sgg-ex-char">{stroke.example.char}</span>
          <span className="sgg-ex-pinyin"> {stroke.example.pinyin}</span>
          <span className="sgg-ex-meaning"> · {stroke.example.meaning}</span>
        </div>
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
            onClick={() => { if (cell.state === 'empty' && i !== activeIdx) setActiveIdx(i); }}
          >
            {i === activeIdx
              ? <DrawingCanvas
                  guide={stroke.img
                    ? <img src={stroke.img} alt={stroke.name} className="cbk-stroke-img" />
                    : <span className="cbk-char">{tc}</span>}
                  onDone={(dataURL) => markDone(i, dataURL)}
                />
              : cell.state === 'ref'
                ? stroke.img
                  ? <img src={stroke.img} alt={stroke.name} className="cbk-stroke-img" style={{ opacity: cell.opacity }} />
                  : <span className="cbk-char" style={{ opacity: cell.opacity }}>{tc}</span>
                : cell.state === 'done'
                  ? <>
                      {stroke.img
                        ? <img src={stroke.img} alt={stroke.name} className="cbk-stroke-img" style={{ opacity: 0.12 }} />
                        : <span className="cbk-char" style={{ opacity: 0.12 }}>{tc}</span>}
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
        {doneCells === totalPractice ? '🏆 Perfect!' : activeIdx !== null ? '✏️ Trace the stroke' : 'Tap a cell to practise'}
      </p>

      <div className="cbk-bottom">
        <button className="btn btn-secondary" onClick={() => { const g = makeGrid(); setGrid(g); setActiveIdx(null); try { localStorage.setItem(`sgg_${stroke.id}`, JSON.stringify(g)); } catch {} }}>↺ Reset</button>
        <button className="btn btn-secondary" onClick={onPrev} disabled={stroke.id === 1}>← Prev</button>
        <button className="btn btn-primary"   onClick={onNext} disabled={stroke.id === STROKES.length}>Next →</button>
      </div>
    </div>
  );
}

// ── Main grid page ────────────────────────────────────────────
export default function StrokeGuide({ onNavigate, onNewSticker }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <StrokeDetail
        stroke={selected}
        onClose={() => setSelected(null)}
        onNext={() => setSelected(STROKES[selected.id])}
        onPrev={() => setSelected(STROKES[selected.id - 2])}
        onNewSticker={onNewSticker}
      />
    );
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Stroke Guide 笔画</h2>
      <p className="sg-subtitle">Learn how each stroke is drawn — tap a card to practise</p>

      <div className="sgg-grid">
        {STROKES.map(stroke => (
          <button key={stroke.id} className="sgg-card" onClick={() => setSelected(stroke)}>
            {/* Number badge */}
            <span className="sgg-num">{stroke.id}</span>

            {/* Stroke shape + direction arrow */}
            <div className="sgg-card-top">
              {stroke.img
                ? <img src={stroke.img} alt={stroke.name} className="sgg-stroke-img" />
                : stroke.path
                  ? <StrokeSVG path={stroke.path} size={48} />
                  : <span className="sgg-stroke-char">{stroke.char}</span>}
              <DirectionArrow rotation={stroke.arrowRot} />
            </div>

            {/* Name */}
            <div className="sgg-name">{stroke.name} <span className="sgg-cn">{stroke.chinese}</span></div>

            {/* Example */}
            <div className="sgg-example">
              {stroke.example.char} {stroke.example.pinyin} · {stroke.example.meaning}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
