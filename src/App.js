import React, { useState } from 'react';
import Home from './components/Home';
import FlashCards from './components/FlashCards';
import StrokeOrder from './components/StrokeOrder';
import Copybook from './components/Copybook';
import Quiz from './components/Quiz';
import Stories from './components/Stories';
import Numbers from './components/Numbers';
import Pinyin from './components/Pinyin';
import Map from './components/Map';
import './App.css';

const PAGES = {
  home:       Home,
  flashcards: FlashCards,
  stroke:     StrokeOrder,
  copybook:   Copybook,
  quiz:       Quiz,
  stories:    Stories,
  numbers:    Numbers,
  pinyin:     Pinyin,
  map:        Map,
};

function App() {
  const [page, setPage]           = useState('home');
  const [reviewSet, setReviewSet] = useState(null);
  const [reviewLoc, setReviewLoc] = useState(null);

  const navigate = (p) => {
    if (p !== 'quiz') { setReviewSet(null); setReviewLoc(null); }
    setPage(p);
  };

  const startReview = (chars, loc) => {
    setReviewSet(chars);
    setReviewLoc(loc);
    setPage('quiz');
  };

  const Page = PAGES[page];
  const extra = {};
  if (page === 'quiz') { extra.reviewSet = reviewSet; extra.reviewLoc = reviewLoc; }
  if (page === 'map')  extra.onReview = startReview;

  return (
    <div className="app">
      <Page onNavigate={navigate} {...extra} />
    </div>
  );
}

export default App;
