// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MakeAWish from './MakeAWish';
import WishMap from './WishMap';
import EndorsementList from './EndorsementList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MakeAWish />} />
        <Route path="/map" element={<WishMap />} />
        <Route path="/list" element={<EndorsementList />} />
      </Routes>
    </Router>
  );
}

export default App;
