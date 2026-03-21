// src/EndorsementList.jsx
import React, { useState } from 'react';
import { endorsements } from './data/endorsementData';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './EndorsementList.css';

const EndorsementList = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Group by year
  const groupedEndorsements = endorsements.reduce((acc, curr) => {
    (acc[curr.year] = acc[curr.year] || []).push(curr);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(groupedEndorsements).sort((a, b) => b - a);

  return (
    <div className="endorsement-page">
      <div className="endorsement-header">
         <div className="back-btn-container">
            <Link to="/" className="pixel-btn-small" style={{textDecoration:'none', color:'#fff', background:'#333', padding:'8px 15px'}}>
               <ArrowLeft size={16} /> BACK
            </Link>
         </div>
         <h1 className="treasure-title">WISH TREASURE LIST</h1>
      </div>

      <div className="locker-container">
        {sortedYears.map((year) => (
          <div key={year} className="year-section">
            <h2 className="year-title">{year}</h2>
            <div className="locker-grid">
              {groupedEndorsements[year].map((item) => (
                <div 
                  key={item.id} 
                  className="locker-item"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="locker-img-container">
                     {/* 如果有圖就顯示，沒有顯示預設文字 */}
                     {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="locker-img" />
                     ) : (
                        <span style={{color:'#666', fontSize:'10px'}}>NO IMAGE</span>
                     )}
                  </div>
                  <div className="locker-label">{item.brand}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedItem(null)}>X</button>
            
            {selectedItem.imageUrl && (
               <img src={selectedItem.imageUrl} alt={selectedItem.title} className="modal-img-large" />
            )}
            
            <h2 className="modal-title">{selectedItem.title}</h2>
            <span className="modal-brand">{selectedItem.brand} ({selectedItem.year})</span>
            
            <p className="modal-desc">{selectedItem.description}</p>
            
            {selectedItem.link && (
               <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="modal-link">
                  VIEW MORE
               </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EndorsementList;