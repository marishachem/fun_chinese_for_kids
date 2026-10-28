import React, { useState } from 'react';
import { LOCATIONS, getProgress, getLocationIndex, resetProgress } from '../utils/progress';
import characters from '../data/characters';

const charMap = Object.fromEntries(characters.map(c => [c.char, c]));


export default function Map({ onNavigate, onReview }) {
  const [prog] = useState(() => getProgress());
  const count  = prog.learned.length;
  const curIdx = getLocationIndex(count);
  const cur    = LOCATIONS[curIdx];
  const next   = LOCATIONS[curIdx + 1] || null;
  const pct    = next
    ? Math.min(100, ((count - cur.req) / (next.req - cur.req)) * 100)
    : 100;

  const handleReset = () => {
    if (window.confirm('Reset all progress and start over?')) {
      resetProgress();
      window.location.reload();
    }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">My Journey 🗺️</h2>

      {/* hero */}
      <div className="map-hero" style={{ borderColor: cur.color, background: cur.color + '22' }}>
        <img src={cur.image} alt={cur.nameEn} className="mh-img" />
        <div className="mh-body">
          <div className="mh-name">{cur.name} · <span className="mh-en">{cur.nameEn}</span></div>
          <div className="mh-count">{count} words learned total</div>
          {next ? (
            <>
              <div className="mh-next">Next: {next.name} — {next.req - count} more correct answers</div>
              <div className="mh-bar-bg">
                <div className="mh-bar-fill" style={{ width: `${pct}%`, background: cur.color }} />
              </div>
            </>
          ) : (
            <div className="mh-complete">🎉 Journey complete — you've mastered all locations!</div>
          )}
        </div>
      </div>

      {/* zigzag */}
      <div className="map-grid">
        {LOCATIONS.map((loc, i) => {
          const unlocked  = count >= loc.req;
          const isCur     = i === curIdx;
          const isDone    = unlocked && !isCur;
          const isLeft    = i % 2 === 0;
          const isLast    = i === LOCATIONS.length - 1;
          const nextReq   = LOCATIONS[i + 1]?.req ?? prog.learned.length + 1;
          const locChars  = prog.learned
            .slice(loc.req, nextReq)
            .map(ch => charMap[ch])
            .filter(Boolean);

          const card = (
            <div
              className={`map-card ${unlocked ? 'map-card--on' : 'map-card--off'} ${isCur ? 'map-card--cur' : ''}`}
              style={{ borderColor: isCur ? loc.color : unlocked ? loc.color + '99' : '#e2e8f0' }}
            >
              <img src={loc.image} alt={loc.nameEn} className="mc-img" />
              <div className="mc-body">
                <div className="mc-name">{loc.name}</div>
                <div className="mc-en">{loc.nameEn}</div>
                {isCur && (
                  <span className="mc-badge" style={{ background: loc.color }}>📍 You are here</span>
                )}
                {isDone && (
                  <span className="mc-badge mc-badge--done">✅ Completed!</span>
                )}
                {!unlocked && (
                  <span className="mc-badge mc-badge--lock">🔒 {loc.req - count} words away</span>
                )}
                {isDone && locChars.length > 0 && onReview && (
                  <button
                    className="mc-review-btn"
                    onClick={e => { e.stopPropagation(); onReview(locChars, loc); }}
                  >
                    ✨ Review
                  </button>
                )}
              </div>
            </div>
          );

          return (
            <React.Fragment key={loc.id}>
              <div className="map-col-side map-col-left">
                {isLeft && card}
              </div>
              <div className="map-col-path">
                {isCur ? (
                  <img
                    src="/images/princess.png"
                    className="map-princess"
                    alt="You are here"
                    style={{ filter: `drop-shadow(0 0 10px ${cur.color}) drop-shadow(0 0 22px ${cur.color}88) drop-shadow(0 4px 6px rgba(0,0,0,.15))` }}
                  />
                ) : (
                  <div
                    className="map-dot"
                    style={{ background: unlocked ? loc.color : '#d1d5db' }}
                  />
                )}
                {!isLast && (
                  <svg className="map-curve-line" viewBox="0 0 44 90" preserveAspectRatio="none">
                    <path
                      d={i % 2 === 0
                        ? 'M 22 0 C 88 22, 88 68, 22 90'
                        : 'M 22 0 C -44 22, -44 68, 22 90'}
                      fill="none"
                      stroke={unlocked ? loc.color : '#e2e8f0'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={unlocked ? undefined : '7 5'}
                    />
                  </svg>
                )}
              </div>
              <div className="map-col-side map-col-right">
                {!isLeft && card}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={handleReset}>
          🔄 Reset progress
        </button>
      </div>
    </div>
  );
}
