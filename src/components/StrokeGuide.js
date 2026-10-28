import React, { useState, useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { STROKES } from '../data/strokes';

function StrokeSVG({ path, size = 56 }) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      <path
        d={path}
        fill="none"
        stroke="#db2777"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StrokeDetail({ stroke, onClose, onNext, onPrev }) {
  const animRef = useRef(null);
  const quizRef = useRef(null);
  const writerRef = useRef(null);
  const quizWriterRef = useRef(null);
  const [quizDone, setQuizDone] = useState(false);
  const [exIdx, setExIdx] = useState(0);

  const char = stroke.examples[exIdx] || stroke.examples[0];

  useEffect(() => {
    if (!animRef.current) return;
    animRef.current.innerHTML = '';
    try {
      writerRef.current = HanziWriter.create(animRef.current, char, {
        width: 180, height: 180, padding: 14,
        showOutline: true,
        strokeColor: '#db2777',
        outlineColor: '#fce7f3',
        strokeAnimationSpeed: 0.7,
        delayBetweenStrokes: 500,
      });
      writerRef.current.loopCharacterAnimation();
    } catch {}
    return () => { try { writerRef.current?.cancelAnimation(); } catch {} };
  }, [char]);

  useEffect(() => {
    if (!quizRef.current) return;
    setQuizDone(false);
    quizRef.current.innerHTML = '';
    try {
      quizWriterRef.current = HanziWriter.create(quizRef.current, char, {
        width: 180, height: 180, padding: 14,
        showOutline: true,
        strokeColor: '#db2777',
        outlineColor: '#fce7f3',
        drawingColor: '#7c3aed',
        showHintAfterMisses: 3,
      });
      const startQuiz = () => {
        setQuizDone(false);
        quizWriterRef.current.quiz({
          onComplete: () => {
            setQuizDone(true);
            setTimeout(() => startQuiz(), 1400);
          },
        });
      };
      startQuiz();
    } catch {}
    return () => { try { quizWriterRef.current?.cancelQuiz(); } catch {} };
  }, [char]);

  return (
    <div className="page">
      <button className="back-btn" onClick={onClose}>← All Strokes</button>

      <div className="sd-header">
        <span className="sd-num">#{stroke.id}</span>
        <div className="sd-shape-lg">
          <StrokeSVG path={stroke.path} size={72} />
        </div>
        <div>
          <div className="sd-name">{stroke.name}</div>
          <div className="sd-cn">{stroke.chinese}</div>
        </div>
      </div>

      <div className="sd-ex-row">
        <span className="sd-ex-label">Example:</span>
        {stroke.examples.map((ex, i) => (
          <button
            key={ex}
            className={`sd-ex-btn ${i === exIdx ? 'sd-ex-btn--active' : ''}`}
            onClick={() => setExIdx(i)}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="sd-panels">
        <div className="sd-panel">
          <div className="sd-panel-title">👀 Watch</div>
          <div className="sg-writer-box tian" ref={animRef} />
          <div className="sd-panel-sub">Stroke order</div>
        </div>
        <div className="sd-panel">
          <div className="sd-panel-title">✏️ Trace</div>
          <div className="sg-writer-box tian" ref={quizRef} />
          <div className="sd-panel-sub">
            {quizDone ? '🎉 Great job!' : 'Follow strokes'}
          </div>
        </div>
      </div>

      <div className="sd-nav">
        <button className="btn btn-secondary" onClick={onPrev} disabled={stroke.id === 1}>
          ← Prev
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={stroke.id === STROKES.length}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default function StrokeGuide({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <StrokeDetail
        stroke={selected}
        onClose={() => setSelected(null)}
        onNext={() => setSelected(STROKES[selected.id])}
        onPrev={() => setSelected(STROKES[selected.id - 2])}
      />
    );
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Stroke Guide 笔画</h2>
      <p className="sg-subtitle">Tap a stroke to watch & practise it</p>

      <div className="sg-grid">
        {STROKES.map(stroke => (
          <button
            key={stroke.id}
            className="sg-card"
            onClick={() => setSelected(stroke)}
          >
            <div className="sgc-top">
              <span className="sgc-num">{stroke.id}</span>
              <div className="sgc-shape">
                <StrokeSVG path={stroke.path} size={52} />
              </div>
            </div>
            <div className="sgc-name">{stroke.name}</div>
            <div className="sgc-ex">{stroke.examples.join('、')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
