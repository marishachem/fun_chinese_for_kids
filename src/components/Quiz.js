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

function Quiz({ onNavigate }) {
  const [cat, setCat] = useState('all');
  const pool = useMemo(
    () => cat === 'all' ? characters : characters.filter(c => c.category === cat),
    [cat]
  );

  const [question, setQuestion] = useState(() => makeQuestion(characters));
  const [selected, setSelected]   = useState(null);
  const [score, setScore]         = useState(0);
  const [total, setTotal]         = useState(0);
  const [unlocked, setUnlocked]   = useState(null); // milestone banner

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
      const result = markLearned(opt.char);
      if (result.newLocIdx !== null) {
        setUnlocked(LOCATIONS[result.newLocIdx]);
      }
    }
    setTotal(t => t + 1);
  }, [selected, question.correct.char]);

  const next = () => {
    setQuestion(makeQuestion(pool));
    setSelected(null);
  };

  const { correct, options } = question;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
      <h2 className="page-title">Quiz 🌟</h2>

      {/* milestone unlock overlay */}
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

      <div className="quiz-score">Score: {score} / {total}</div>

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
          <button className="btn btn-primary" onClick={next}>Next →</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
