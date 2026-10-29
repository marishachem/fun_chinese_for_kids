import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function DrawingCanvas({ guide, onDone }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasDrawnRef = useRef(false);
  const savedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  const completeCell = useCallback((dataURL) => {
    savedRef.current = true;
    onDoneRef.current(dataURL);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    return () => {
      if (!savedRef.current && hasDrawnRef.current && canvasRef.current) {
        completeCell(canvasRef.current.toDataURL());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [(src.clientX - r.left) * (canvas.width / r.width),
            (src.clientY - r.top)  * (canvas.height / r.height)];
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const [x, y] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawing.current = true;
  };

  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth   = Math.max(4, canvas.width * 0.045);
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    const [x, y] = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    hasDrawnRef.current = true;
    setHasDrawn(true);
  };

  const stopDraw = () => { drawing.current = false; };

  return (
    <div className="dc-wrap">
      {/* faint guide behind the canvas */}
      {guide && <div className="dc-guide">{guide}</div>}

      <canvas
        ref={canvasRef}
        className="dc-canvas"
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
      />

      {hasDrawn && (
        <button className="dc-done-btn" onClick={() => completeCell(canvasRef.current.toDataURL())}>✓</button>
      )}
    </div>
  );
}
