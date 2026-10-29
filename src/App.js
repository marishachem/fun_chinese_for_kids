import React, { useState } from 'react';
import floralBg from './images/floral-bg.jpg';
import Home from './components/Home';
import FlashCards from './components/FlashCards';
import StrokeOrder from './components/StrokeOrder';
import Copybook from './components/Copybook';
import Quiz from './components/Quiz';
import Stories from './components/Stories';
import Numbers from './components/Numbers';
import Pinyin from './components/Pinyin';
import Map from './components/Map';
import StrokeGuide from './components/StrokeGuide';
import LocationLearn from './components/LocationLearn';
import StickerToast from './components/StickerToast';
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
  strokes:    StrokeGuide,
};

function App() {
  const [page, setPage]           = useState('home');
  const [reviewSet, setReviewSet] = useState(null);
  const [reviewLoc, setReviewLoc] = useState(null);
  const [learnLocIdx, setLearnLocIdx] = useState(null);
  const [newSticker, setNewSticker] = useState(null);

  const navigate = (p) => {
    if (p !== 'quiz') { setReviewSet(null); setReviewLoc(null); }
    setPage(p);
  };

  const startReview = (chars, loc) => {
    setReviewSet(chars);
    setReviewLoc(loc);
    setPage('quiz');
  };

  const startLearn = (locIdx) => {
    setLearnLocIdx(locIdx);
    setPage('locationlearn');
  };

  if (page === 'locationlearn' && learnLocIdx !== null) {
    return (
      <div style={{ minHeight: '100vh', background: `url(${floralBg}) center center / cover fixed` }}>
        <div className="app" style={{ background: 'rgba(255,255,255,0.60)' }}>
          <LocationLearn
            locIdx={learnLocIdx}
            onBack={() => setPage('map')}
            onComplete={() => setPage('map')}
          />
        </div>
      </div>
    );
  }

  const Page = PAGES[page];
  const extra = {};
  if (page === 'quiz') { extra.reviewSet = reviewSet; extra.reviewLoc = reviewLoc; }
  if (page === 'map')  { extra.onReview = startReview; extra.onStartLearn = startLearn; }
  if (page === 'copybook' || page === 'strokes') extra.onNewSticker = setNewSticker;

  return (
    <div style={{
      minHeight: '100vh',
      background: `url(${floralBg}) center center / cover fixed`,
    }}>
      <div className="app" style={{ background: 'rgba(255,255,255,0.60)' }}>
        <Page onNavigate={navigate} {...extra} />
      </div>
      {newSticker && <StickerToast sticker={newSticker} onDone={() => setNewSticker(null)} />}
    </div>
  );
}

export default App;
