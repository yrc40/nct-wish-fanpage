import React, { useState, useEffect, useMemo, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import { ArrowLeft, ExternalLink, Home, Map as MapIcon, List, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { locations, mapThemes, countrySettings } from './data/mapData'; 
import './WishMap.css';
import worldMapImg from './assets/worldmap.png';

// ... (Icon 設定保持不變) ...
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const countryNameMap = {
  kr: 'KOREA',
  tw: 'TAIWAN',
  jp: 'JAPAN',
  th: 'THAILAND',
  es: 'SPAIN',
  sg: 'SINGAPORE',
  mo: 'MACAU',
};

// --- 修正 1：防止地圖一直縮回去的關鍵 ---
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // ⚠️ 關鍵修正：依賴陣列只放 [center, map]
    // 意思是：只有當「中心點(國家)」改變時，才重置視角。
    // 手動縮放時，因為 center 沒變，所以不會強制彈回去。
  }, [center, map]); 
  return null;
};

const ZoomTracker = ({ setZoom }) => {
  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom()); // 當縮放結束時，更新 state
    },
  });
  return null;
};

const WishMap = () => {
  const [view, setView] = useState('world'); 
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeTheme, setActiveTheme] = useState('all');
  const [filters, setFilters] = useState({ mv: true, food: true, spot: true, venue: true });
  
  // 控制漂浮詳細頁面的狀態
  const [selectedLocation, setSelectedLocation] = useState(null);

  // 控制手機版主題選單 Bottom Sheet (false=收起, true=展開)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // 新增：洲別選擇狀態 (null = 世界地圖, 'asia' = 亞洲地圖)
  const [continent, setContinent] = useState(null);

  // 存目前的縮放值 (預設 13)
  const [currentZoom, setCurrentZoom] = useState(13);

  const navigate = useNavigate(); 
  
  // Ref for auto-scrolling on mobile
  const worldMapRef = useRef(null);

  // Auto-scroll logic:
  // 1. Mobile specific scroll when initially loading world view (optional now if we have zoom)
  // 2. Scroll to continent when selected
  useEffect(() => {
    if (view === 'world' && worldMapRef.current) {
        const scrollContainer = worldMapRef.current;
        const scrollW = scrollContainer.scrollWidth;
        const scrollH = scrollContainer.scrollHeight;

        if (continent === 'asia') {
            // Scroll to Asia (Right-Top area roughly)
            // Center Asia horizontally ~80%
            // Center Asia vertically ~35%
            // Viewport center logic:
            // scrollLeft = TargetX - ViewportWidth/2
            const viewportW = scrollContainer.clientWidth;
            const viewportH = scrollContainer.clientHeight;
            
            const targetX = scrollW * 0.82;
            const targetY = scrollH * 0.35;

            scrollContainer.scrollTo({
                left: targetX - viewportW / 2,
                top: targetY - viewportH / 2,
                behavior: 'smooth'
            });
        } else if (continent === 'europe') {
            // Scroll to Europe
            const viewportW = scrollContainer.clientWidth;
            const viewportH = scrollContainer.clientHeight;
            
            const targetX = scrollW * 0.53;
            const targetY = scrollH * 0.30;

            scrollContainer.scrollTo({
                left: targetX - viewportW / 2,
                top: targetY - viewportH / 2,
                behavior: 'smooth'
            });
        } else if (!continent && window.innerWidth <= 768) {
             // Mobile default scroll
             scrollContainer.scrollLeft = scrollW * 0.5; 
             scrollContainer.scrollTop = scrollContainer.scrollHeight * 0.1; 
        }
    }
  }, [view, continent]);

  const mapCenter = useMemo(() => {
    if (!selectedCountry) return [37.5665, 126.9780]; // 預設值(沒選國家時)

    // 讀取該國家的最佳中心點
    return countrySettings[selectedCountry].center;
  }, [selectedCountry]);

  const currentLocations = selectedCountry 
    ? locations[selectedCountry].filter(loc => {
        const isTypeChecked = filters[loc.type];
        const isThemeMatch = activeTheme === 'all' || (loc.themes && loc.themes.includes(activeTheme));
        return isTypeChecked && isThemeMatch;
      }) 
    : [];

  const handleOpenMap = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Map link not available!");
    }
  };

  const handleBack = () => {
    if (continent) {
        setContinent(null); // Back to World
    } else {
        navigate('/'); // Back to Home
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setActiveTheme('all'); 
    setSelectedLocation(null); // 切換國家時關閉詳細頁
    setCurrentZoom(countrySettings[country].zoom);
    setView('country');
  };

  const handleThemeToggle = (themeId) => {
    if (activeTheme === themeId) {
        setActiveTheme('all');
    } else {
        setActiveTheme(themeId);
    }
  };

  const handleFilterChange = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="map-page-container">
      
      {view === 'world' && (
        <div className="world-view" ref={worldMapRef}>
           <div className="world-nav-bar">
             <button className="pixel-btn-small" onClick={handleBack}>
               {continent ? <ArrowLeft size={12} /> : <Home size={12} />} 
               {continent ? ' BACK' : ' HOME'}
             </button>
          </div>
          <h1 className="pixel-title">{continent ? continent.toUpperCase() : 'SELECT CONTINENT'}</h1>
          
          <div className={`pixel-world-map ${continent ? 'zoomed' : ''}`}>
            <img src={worldMapImg} alt="World Map" className="world-map-image" />
            
            {/* 洲別選擇按鈕 (只在未選擇洲時顯示) */}
            {!continent && (
                <>
                    <button className="map-hotspot asia-spot" onClick={() => setContinent('asia')}>
                        ASIA 🌏
                    </button>
                    <button className="map-hotspot europe-spot" onClick={() => setContinent('europe')}>
                        EUROPE 🌍
                    </button>
                </>
            )}

            {/* 國家按鈕 (只在選擇亞洲時顯示) */}
            {continent === 'asia' && (
                <>
                    <button className="map-hotspot kr-spot" onClick={() => handleCountrySelect('kr')}>
                    <img src="https://flagcdn.com/w40/kr.png" alt="KR" className="flag-img" /> KOREA
                    </button>
                    <button className="map-hotspot jp-spot" onClick={() => handleCountrySelect('jp')}>
                    <img src="https://flagcdn.com/w40/jp.png" alt="JP" className="flag-img" /> JAPAN
                    </button>
                    <button className="map-hotspot tw-spot" onClick={() => handleCountrySelect('tw')}>
                    <img src="https://flagcdn.com/w40/tw.png" alt="TW" className="flag-img" /> TAIWAN
                    </button>
                    <button className="map-hotspot th-spot" onClick={() => handleCountrySelect('th')}>
                    <img src="https://flagcdn.com/w40/th.png" alt="TH" className="flag-img" /> THAILAND
                    </button>
                    <button className="map-hotspot sg-spot" onClick={() => handleCountrySelect('sg')}>
                    <img src="https://flagcdn.com/w40/sg.png" alt="SG" className="flag-img" /> SINGAPORE
                    </button>
                    <button className="map-hotspot mo-spot" onClick={() => handleCountrySelect('mo')}>
                    <img src="https://flagcdn.com/w40/mo.png" alt="MO" className="flag-img" /> MACAU
                    </button>
                 </>
            )}

            {/* 國家按鈕 (只在選擇歐洲時顯示) */}
            {continent === 'europe' && (
                <>
                    <button className="map-hotspot es-spot" onClick={() => handleCountrySelect('es')}>
                    <img src="https://flagcdn.com/w40/es.png" alt="ES" className="flag-img" /> SPAIN
                    </button>
                 </>
            )}
          </div>
        </div>
      )}

      {view === 'country' && (
        <div className="detail-map-view new-style">
          
          <div className={`theme-sidebar ${isSheetOpen ? 'mobile-open' : ''}`}>
             
            {/* [手機版專用] 拖曳/點擊把手 (Handle) */}
            <div className="mobile-sheet-handle" onClick={() => setIsSheetOpen(!isSheetOpen)}>
               <div className="handle-bar"></div>
               <span className="mobile-sheet-title">MAP MENU</span>
            </div>

            <div className="sidebar-scroll-content">
                <button className="pixel-btn-small back-btn" onClick={() => setView('world')}>
                  <ArrowLeft size={12} /> BACK
                </button>
                
                <h2 className="sidebar-title">
                  {`WISH IN ${countryNameMap[selectedCountry] || selectedCountry?.toUpperCase() || ''}`}
                </h2>
                
                <h3 className="section-subtitle"><MapIcon size={12}/> THEMES</h3>
                
                {/* === 修改開始：把 theme-grid 改成 theme-list === */}
                <div className="theme-list">
                    {mapThemes[selectedCountry]?.map((theme) => (
                        <button 
                            key={theme.id}
                            // 判斷是否選中，加上 active class
                            className={`theme-list-btn ${activeTheme === theme.id ? 'active' : ''}`}
                            onClick={() => {
                                handleThemeToggle(theme.id);
                                if (window.innerWidth <= 768) setIsSheetOpen(false); // 手機選完自動收起
                            }}
                        >
                            {/* 這裡只顯示文字 + Emoji，不放圖片了 */}
                            {theme.label}
                        </button>
                    ))}
                </div>
                
                <div className="filter-section">
                    <h3 className="section-subtitle">FILTERS</h3>
                    <div className="filter-list-horizontal">
                      <label className="pixel-checkbox">
                        <input type="checkbox" checked={filters.mv} onChange={() => handleFilterChange('mv')} />
                        <span className="checkmark"></span> MV
                      </label>
                      <label className="pixel-checkbox">
                        <input type="checkbox" checked={filters.food} onChange={() => handleFilterChange('food')} />
                        <span className="checkmark"></span> Food
                      </label>
                      <label className="pixel-checkbox">
                        <input type="checkbox" checked={filters.spot} onChange={() => handleFilterChange('spot')} />
                        <span className="checkmark"></span> Visit
                      </label>
                      <label className="pixel-checkbox">
                        <input type="checkbox" checked={filters.venue} onChange={() => handleFilterChange('venue')} />
                        <span className="checkmark"></span> Venue
                      </label>
                    </div>
                </div>
            </div>
          </div>

          <div className="leaflet-map-wrapper">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='© OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* --- 修正 2：傳入 currentZoom 而不是寫死的 13 --- */}
              <MapUpdater center={mapCenter} zoom={currentZoom} />
              
              <ZoomTracker setZoom={setCurrentZoom} />
              
              {currentLocations.map(loc => (
                <Marker 
                    key={loc.id} 
                    position={[loc.lat, loc.lng]}
                    eventHandlers={{
                        click: () => setSelectedLocation(loc),
                    }}
                >
                  {/* Tooltip 設定：縮放到 14 以上才顯示 */}
                  {currentZoom >= 14 && (
                    <Tooltip 
                      permanent 
                      direction="bottom" 
                      offset={[0, 10]} 
                      className="pixel-map-label"
                    >
                      {loc.name}
                    </Tooltip>
                  )}
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* 漂浮詳細頁面 (Modal) - 移到這裡以避免層級問題 */}
          {selectedLocation && (
              <div className="location-modal-overlay">
                  <div className="location-modal-card">
                      <button className="close-modal-btn" onClick={() => setSelectedLocation(null)}>
                          <X size={20} />
                      </button>

                      <div className="modal-header">
                          <div className="modal-tags">
                              {selectedLocation.themes?.map(t => <span key={t} className="theme-tag">#{t.toUpperCase()}</span>)}
                          </div>
                          <h2 className="modal-title">{selectedLocation.name}</h2>
                      </div>

                      <div className="modal-body">
                          <div className="modal-image-container">
                              {selectedLocation.detailImg ? (
                                  <img src={selectedLocation.detailImg} alt={selectedLocation.name} />
                              ) : (
                                  <div className="no-image-placeholder">NO IMAGE</div>
                              )}
                          </div>
                          <div className="modal-info">
                              <p className="modal-desc">{selectedLocation.description || "暫無詳細介紹..."}</p>
                              
                              <button 
                                  className={`google-maps-btn large ${selectedCountry === 'kr' ? 'naver-style' : ''}`}
                                  onClick={() => handleOpenMap(selectedLocation.mapUrl)} // 改成讀取 mapUrl
                              >
                                  {/* 根據國家顯示不同的文字與顏色 */}
                                  {selectedCountry === 'kr' ? (
                                      <>Open in Naver Map <ExternalLink size={16}/></>
                                  ) : (
                                      <>Open in Google Maps <ExternalLink size={16}/></>
                                  )}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          <div className="bottom-nav">
              <button 
                  className={`bottom-nav-btn ${activeTheme === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTheme('all')}
              >
                  <List size={20} /> ALL LOCATIONS
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishMap;