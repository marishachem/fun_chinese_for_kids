import React, { useState, useCallback, useEffect } from 'react';
import characters from '../data/characters';
import { LOCATIONS, markLearned, getProgress } from '../utils/progress';

const TONE_CLS = ['tone-0','tone-1','tone-2','tone-3','tone-4'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getLocationChars(locIdx) {
  const start = LOCATIONS[locIdx].req;
  const end   = LOCATIONS[locIdx + 1]?.req ?? characters.length;
  return characters.slice(start, end);
}

export default function LocationLearn({ locIdx, onBack, onComplete }) {
  const loc   = LOCATIONS[locIdx];
  const chars = getLocationChars(locIdx);

  // which chars are already marked easy in global progress
  const [learnedSet, setLearnedSet] = useState(() => {
    const p = getProgress();
    return new Set(chars.filter(c => p.learned.includes(c.char)).map(c => c.char));
  });

  // session queue: unlearned first (shuffled), then already-learned (shuffled)
  const [queue, setQueue] = useState(() => {
    const p = getProgress();
    const unlearned = chars.filter(c => !p.learned.includes(c.char));
    const alreadyDone = chars.filter(c => p.learned.includes(c.char));
    return [...shuffle(unlearned), ...shuffle(alreadyDone)];
  });

  const [animDir, setAnimDir] = useState(null); // 'easy'|'ok'|'hard'
  const [revealed, setRevealed] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const total        = chars.length;
  const learnedCount = learnedSet.size;
  const allDone      = learnedCount >= total;

  useEffect(() => {
    if (allDone && queue.length === 0) setShowComplete(true);
  }, [allDone, queue.length]);

  const answer = useCallback((rating) => {
    const card = queue[0];
    setAnimDir(rating);

    setTimeout(() => {
      if (rating === 'easy') {
        markLearned(card.char);
        setLearnedSet(prev => new Set([...prev, card.char]));
        setQueue(prev => {
          const next = prev.slice(1);
          // if that was the last card and all learned, trigger complete
          return next;
        });
        if (learnedSet.size + 1 >= total) setShowComplete(true);
      } else if (rating === 'ok') {
        // back of queue
        setQueue(prev => [...prev.slice(1), prev[0]]);
      } else {
        // hard: show again after 2 cards
        setQueue(prev => {
          const [head, ...rest] = prev;
          const pos = Math.min(2, rest.length);
          return [...rest.slice(0, pos), head, ...rest.slice(pos)];
        });
      }
      setRevealed(false);
      setAnimDir(null);
    }, 350);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, learnedSet, total]);

  if (showComplete || (allDone && queue.length === 0)) {
    return (
      <div className="page ll-complete-page">
        <div className="ll-confetti">🎉</div>
        <div className="ll-complete-badge" style={{ borderColor: loc.color }}>
          <img src={loc.image} alt={loc.nameEn} className="ll-complete-img" />
        </div>
        <h2 className="ll-complete-title">You learned all {total} words!</h2>
        <p className="ll-complete-sub">{loc.nameEn} is complete — the next stop is unlocked!</p>
        <button className="btn btn-primary ll-complete-btn" onClick={onComplete}>
          Continue on the map →
        </button>
      </div>
    );
  }

  const card = queue[0];
  const alreadyKnown = card && learnedSet.has(card.char);

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Map</button>

      {/* header */}
      <div className="ll-header">
        <div className="ll-loc-name" style={{ color: loc.color }}>{loc.nameEn}</div>
        <div className="ll-prog-row">
          <div className="ll-prog-bg">
            <div className="ll-prog-fill" style={{ width: `${(learnedCount / total) * 100}%`, background: loc.color }} />
          </div>
          <span className="ll-prog-label">{learnedCount}/{total}</span>
        </div>
      </div>

      {/* card */}
      <div className={`ll-card-wrap ${animDir ? `ll-anim-${animDir}` : ''}`}>
        {card && (
          <div
            className={`ll-card ${!revealed ? 'll-card--hidden' : ''}`}
            style={{ borderColor: loc.color }}
            onClick={() => !revealed && setRevealed(true)}
          >
            {alreadyKnown && <div className="ll-known-tag">✓ already learned</div>}
            <div className="ll-char">{card.char}</div>
            {revealed ? (
              <>
                <div className={`ll-pinyin ${TONE_CLS[card.tone]}`}>{card.pinyin}</div>
                <div className="ll-meaning">{card.emoji}&nbsp;{card.meaning}</div>
              </>
            ) : (
              <div className="ll-tap-hint">tap to reveal</div>
            )}
          </div>
        )}
      </div>

      <p className="ll-queue-hint">
        {queue.length > 1 ? `${queue.length - 1} card${queue.length - 1 !== 1 ? 's' : ''} still in this round` : 'Last card this round!'}
      </p>

      {/* rating buttons — only shown after card is revealed */}
      <div className={`ll-btns ${!revealed ? 'll-btns--hidden' : ''}`}>
        <button className="ll-btn ll-btn--hard" onClick={() => answer('hard')}>
          <span className="ll-btn-icon">😓</span>
          <span className="ll-btn-label">Hard</span>
          <span className="ll-btn-hint">show sooner</span>
        </button>
        <button className="ll-btn ll-btn--ok" onClick={() => answer('ok')}>
          <span className="ll-btn-icon">🙂</span>
          <span className="ll-btn-label">OK</span>
          <span className="ll-btn-hint">show later</span>
        </button>
        <button className="ll-btn ll-btn--easy" onClick={() => answer('easy')}>
          <span className="ll-btn-icon">⭐</span>
          <span className="ll-btn-label">Easy!</span>
          <span className="ll-btn-hint">I know it</span>
        </button>
      </div>
    </div>
  );
}
