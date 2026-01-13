// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAWish from './MakeAWish';
import WishMap from './WishMap';

function App() {
  return (
    <Router>
      <Routes>
        {/* 設定路徑對應的元件 */}
        <Route path="/" element={<MakeAWish />} />
        <Route path="/map" element={<WishMap />} />
      </Routes>
    </Router>
  );
}

export default App;