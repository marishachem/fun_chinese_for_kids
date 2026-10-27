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
  const [page, setPage] = useState('home');
  const Page = PAGES[page];
  return (
    <div className="app">
      <Page onNavigate={setPage} />
    </div>
  );
}

export default App;
