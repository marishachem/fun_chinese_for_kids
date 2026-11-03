import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

// Guided stroke-by-stroke quiz using hanzi-writer.
// Checks each stroke the user draws. Auto-completes when all strokes correct.
// onDone() is called on completion.
export default function HanziQuizCanvas({ char, onDone }) {
  const containerRef = useRef(null);
  const onDoneRef    = useRef(onDone);
  const [attempt, setAttempt]   = useState(0);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed]     = useState(false); // true after a wrong stroke

  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !char) return;
    el.innerHTML = '';
    setComplete(false);
    setFailed(false);

    const size = el.offsetWidth || 90;
    let writer;
    try {
      writer = HanziWriter.create(el, char, {
        width:  size,
        height: size,
        padding: Math.round(size * 0.08),
        showOutline: true,
        strokeColor: '#db2777',
        outlineColor: '#e2e8f0',
        drawingColor: '#db2777',
        drawingWidth: Math.max(8, size * 0.09),
        showCharacter: false,
        highlightOnComplete: true,
        highlightColor: '#16a34a',
        leniency: 1.2,
      });
    } catch {
      return;
    }

    writer.quiz({
      onMistake: () => setFailed(true),
      onCorrectStroke: () => setFailed(false),
      onComplete: () => {
        setComplete(true);
        setTimeout(() => onDoneRef.current(), 500);
      },
    });

    return () => { try { el.innerHTML = ''; } catch {} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, attempt]);

  const handleClear = () => {
    setAttempt(a => a + 1);
  };

  return (
    <div className="hq-wrap">
      <div ref={containerRef} className="hq-canvas" />
      {!complete && (
        <button className="dc-clear-btn" onClick={handleClear} title="Try again">
          ↺
        </button>
      )}
      {failed && !complete && (
        <div className="hq-hint">✏️ try again</div>
      )}
      {complete && <div className="hq-complete">✓</div>}
    </div>
  );
}
