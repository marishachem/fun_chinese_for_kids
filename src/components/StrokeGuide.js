import React, { useState, useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { STROKES, GROUPS } from '../data/strokes';

function StrokeDetail({ stroke, onClose }) {
  const animRef = useRef(null);
  const quizRef = useRef(null);
  const writerRef = useRef(null);
  const quizWriterRef = useRef(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    if (!animRef.current) return;
    animRef.current.innerHTML = '';
    writerRef.current = HanziWriter.create(animRef.current, stroke.example, {
      width: 180, height: 180, padding: 14,
      showOutline: true,
      strokeColor: '#db2777',
      outlineColor: '#fce7f3',
      strokeAnimationSpeed: 0.7,
      delayBetweenStrokes: 500,
    });
    writerRef.current.loopCharacterAnimation();
    return () => { try { writerRef.current?.cancelAnimation(); } catch {} };
  }, [stroke]);

  useEffect(() => {
    if (!quizRef.current) return;
    setQuizDone(false);
    quizRef.current.innerHTML = '';
    quizWriterRef.current = HanziWriter.create(quizRef.current, stroke.example, {
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
    return () => { try { quizWriterRef.current?.cancelQuiz(); } catch {} };
  }, [stroke]);

  return (
    <div className="page">
      <button className="back-btn" onClick={onClose}>← All Strokes</button>

      <div className="sd-header">
        <span className="sd-num">#{stroke.id}</span>
        <div>
          <div className="sd-name">{stroke.name}</div>
          <div className="sd-pinyin">{stroke.pinyin}</div>
        </div>
        <div className="sd-example-char">{stroke.example}</div>
      </div>

      <div className="sd-panels">
        <div className="sd-panel">
          <div className="sd-panel-title">👀 Watch</div>
          <div className="sg-writer-box tian" ref={animRef} />
          <div className="sd-panel-sub">See stroke order</div>
        </div>
        <div className="sd-panel">
          <div className="sd-panel-title">✏️ Trace</div>
          <div className="sg-writer-box tian" ref={quizRef} />
          <div className="sd-panel-sub">
            {quizDone ? '🎉 Great job!' : 'Follow the strokes'}
          </div>
        </div>
      </div>

      <div className="sd-nav">
        {stroke.id > 1 && (
          <button className="btn btn-secondary" onClick={() => onClose(STROKES[stroke.id - 2])}>
            ← Prev
          </button>
        )}
        {stroke.id < STROKES.length && (
          <button className="btn btn-primary" onClick={() => onClose(STROKES[stroke.id])}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default function StrokeGuide({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [showChart, setShowChart] = useState(false);

  if (selected) {
    return (
      <StrokeDetail
        stroke={selected}
        onClose={(next) => {
          if (next && next.id) setSelected(next);
          else setSelected(null);
        }}
      />
    );
  }

  if (showChart) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => setShowChart(false)}>← Back</button>
        <h2 className="page-title">Stroke Chart 笔画表</h2>
        <img
          src="/images/stroke-chart.jpg"
          alt="Chinese stroke chart"
          className="sg-chart-img"
        />
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Stroke Guide 笔画</h2>
      <p className="sg-subtitle">
        Chinese characters are built from these strokes — tap one to practice!
      </p>

      <button className="sg-chart-btn" onClick={() => setShowChart(true)}>
        📊 View full chart
      </button>

      {GROUPS.map(group => {
        const groupStrokes = STROKES.filter(s => s.group === group.key);
        return (
          <div key={group.key} className="sg-group">
            <div className="sg-group-title">{group.emoji} {group.label}</div>
            <div className="sg-grid">
              {groupStrokes.map(stroke => (
                <button
                  key={stroke.id}
                  className="sg-card"
                  onClick={() => setSelected(stroke)}
                >
                  <div className="sgc-num">{stroke.id}</div>
                  <div className="sgc-example">{stroke.example}</div>
                  <div className="sgc-name">{stroke.name}</div>
                  <div className="sgc-pinyin">{stroke.pinyin}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
