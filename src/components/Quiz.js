import React, { useState, useCallback, useMemo } from 'react';
import characters from '../data/characters';
import { LOCATIONS, markLearned } from '../utils/progress';

const CATS = ['all', ...Array.from(new Set(characters.map(c => c.category))).sort()];
const TONE_CLS = ['tone-0', 'tone-1', 'tone-2', 'tone-3', 'tone-4'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeQuestion(pool) {
  const correct = shuffle(pool)[0];
  const distractors = shuffle(characters.filter(c => c.char !== correct.char)).slice(0, 3);
  return { correct, options: shuffle([correct, ...distractors]) };
}

function Quiz({ onNavigate, reviewSet, reviewLoc }) {
  const isReview = !!reviewSet && reviewSet.length > 0;

  const [cat, setCat] = useState('all');
  const pool = useMemo(() => {
    if (isReview) return reviewSet;
    return cat === 'all' ? characters : characters.filter(c => c.category === cat);
  }, [cat, isReview, reviewSet]);

  const [question, setQuestion]   = useState(() => makeQuestion(isReview ? reviewSet : characters));
  const [selected, setSelected]   = useState(null);
  const [score, setScore]         = useState(0);
  const [total, setTotal]         = useState(0);
  const [unlocked, setUnlocked]   = useState(null);
  const [reviewDone, setReviewDone] = useState(false);

  const handleCat = (c) => {
    const newPool = c === 'all' ? characters : characters.filter(ch => ch.category === c);
    setCat(c);
    setQuestion(makeQuestion(newPool));
    setSelected(null);
  };

  const handleAnswer = useCallback((opt) => {
    if (selected !== null) return;
    setSelected(opt.char);
    if (opt.char === question.correct.char) {
      setScore(s => s + 1);
      if (!isReview) {
        const result = markLearned(opt.char);
        if (result.newLocIdx !== null) setUnlocked(LOCATIONS[result.newLocIdx]);
      }
    }
    setTotal(t => t + 1);
  }, [selected, question.correct.char, isReview]);

  const next = () => {
    if (isReview && total + 1 >= pool.length) {
      setReviewDone(true);
      return;
    }
    setQuestion(makeQuestion(pool));
    setSelected(null);
  };

  const { correct, options } = question;

  if (reviewDone) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNavigate('map')}>← Map</button>
        <div className="review-done">
          <div className="rd-emoji">🌟</div>
          <div className="rd-title">Review complete!</div>
          <div className="rd-score">{score} / {total} correct</div>
          {reviewLoc && (
            <div className="rd-loc">
              <img src={reviewLoc.image} alt={reviewLoc.nameEn} className="rd-img" />
              <div>{reviewLoc.name} · {reviewLoc.nameEn}</div>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => onNavigate('map')}>Back to Map 🗺️</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate(isReview ? 'map' : 'home')}>
        ← {isReview ? 'Map' : 'Home'}
      </button>

      {isReview ? (
        <div className="review-header">
          {reviewLoc && <img src={reviewLoc.image} alt={reviewLoc.nameEn} className="rh-img" />}
          <div>
            <h2 className="page-title" style={{ marginBottom: 2 }}>Review ✨</h2>
            {reviewLoc && <div className="rh-loc">{reviewLoc.name} · {reviewLoc.nameEn}</div>}
          </div>
        </div>
      ) : (
        <h2 className="page-title">Quiz 🌟</h2>
      )}

      {/* milestone unlock overlay (normal quiz only) */}
      {unlocked && (
        <div className="quiz-unlock" onClick={() => setUnlocked(null)}>
          <div className="qu-inner">
            <div className="qu-sparks">🎉✨🎊✨🎉</div>
            <img src="/images/princess.png" className="qu-princess" alt="princess" />
            <img src={unlocked.image} alt={unlocked.nameEn} className="qu-img" />
            <div className="qu-msg">New location unlocked!</div>
            <div className="qu-name">{unlocked.name} · {unlocked.nameEn}</div>
            <button className="btn btn-primary" onClick={() => setUnlocked(null)}>Awesome! →</button>
          </div>
        </div>
      )}

      {!isReview && (
        <div className="cat-tabs">
          {CATS.map(c => (
            <button
              key={c}
              className={`cat-tab ${c === cat ? 'cat-tab--active' : ''}`}
              onClick={() => handleCat(c)}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      )}

      {isReview && (
        <div className="review-progress">
          {total} / {pool.length} · {score} correct
          <div className="rp-bar-bg">
            <div className="rp-bar-fill" style={{ width: `${(total / pool.length) * 100}%` }} />
          </div>
        </div>
      )}

      {!isReview && <div className="quiz-score">Score: {score} / {total}</div>}

      <div className="quiz-prompt">
        {correct.image
          ? <img src={correct.image} alt={correct.meaning} className="qp-img" />
          : <div className="qp-emoji">{correct.emoji}</div>}
        <div className="qp-meaning">{correct.meaning}</div>
        <div className="qp-hint">Which character is this?</div>
      </div>

      <div className="quiz-options">
        {options.map(opt => {
          let cls = 'quiz-opt';
          if (selected !== null) {
            if (opt.char === correct.char) cls += ' quiz-opt--correct';
            else if (opt.char === selected) cls += ' quiz-opt--wrong';
          }
          return (
            <button key={opt.char} className={cls} onClick={() => handleAnswer(opt)}>
              <span className="qo-char">{opt.char}</span>
              <span className={`qo-pinyin ${TONE_CLS[opt.tone]}`}>{opt.pinyin}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="quiz-feedback">
          {selected === correct.char ? (
            <p className="qf-correct">🎉 Correct! {correct.emoji} = {correct.meaning}</p>
          ) : (
            <p className="qf-wrong">
              The answer was <strong>{correct.char}</strong> — {correct.meaning}
            </p>
          )}
          <button className="btn btn-primary" onClick={next}>
            {isReview && total + 1 >= pool.length ? 'Finish ✅' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
