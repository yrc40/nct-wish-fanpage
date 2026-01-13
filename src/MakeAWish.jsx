import React, { useState, useEffect } from 'react';
import { Send, Star, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './MakeAWish.css';

// 引入圖片
import doll1 from './assets/doll_sion.png';
import doll2 from './assets/doll_yushi.png';
/*import doll2 from './assets/doll2.png';
import doll3 from './assets/doll3.png';
import doll4 from './assets/doll4.png';
import doll5 from './assets/doll5.png';
import doll6 from './assets/doll6.png';*/

// --- 修正點：陣列裡只放已經 import 的 doll1 ---
const dollImages = [doll1, doll2 /*, doll3, doll4, doll5, doll6 */]; 

const MakeAWish = () => {
  const [input, setInput] = useState('');
  
  // 兩個分開的狀態 (Lists)
  const [wishes, setWishes] = useState([]);      // 存使用者的願望文字
  const [flyingDolls, setFlyingDolls] = useState([]); // 存自動飛出的娃娃

  // --- 1. 自動產生娃娃 (每 15 秒一隻) ---
  useEffect(() => {
    // 定義產生娃娃的函式
    const spawnDoll = () => {
      // 修正點：加個保護機制，如果沒有圖片就不執行，避免錯誤
      if (dollImages.length === 0) return;
      console.log("嘗試產生娃娃..."); // 打開 F12 看有沒有這行字

      const randomDoll = dollImages[Math.floor(Math.random() * dollImages.length)];
      const newDoll = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,       // 0-90% 水平位置
        speed: 15 + Math.random() * 10, // 速度慢一點比較悠閒 (15-25秒)
        img: randomDoll,
      };
      setFlyingDolls((prev) => [...prev, newDoll]);
    };

    // 一進來先飛一隻
    //spawnDoll();

    // 設定計時器
    const intervalId = setInterval(spawnDoll, 15000); 

    return () => clearInterval(intervalId);
  }, []);

  // --- 2. 處理使用者許願 (變成星星/愛心飛上去) ---
  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newWish = {
      id: Date.now(),
      text: input,
      x: Math.random() * 80 + 10,
      speed: 10 + Math.random() * 5, // 願望飛快一點 (10-15秒)
      // 隨機決定是星星還是愛心圖示
      type: Math.random() > 0.5 ? 'star' : 'heart', 
    };

    setWishes((prev) => [...prev, newWish]);
    setInput('');
  };

  // 清理動畫結束的物件 (共用邏輯)
  const removeWish = (id) => setWishes(prev => prev.filter(item => item.id !== id));
  const removeDoll = (id) => setFlyingDolls(prev => prev.filter(item => item.id !== id));

  return (
    <div className="wish-container">
      <div className="stars-bg"></div>

      <header className="pixel-header">
        <h1 className="glitch-text">MAKE A WISH</h1>
        <p className="subtitle">Send your love to WISH</p>
      </header>

      <div className="floating-area">
        {/* --- A. 渲染自動飛出的娃娃 (無文字) --- */}
        {flyingDolls.map((doll) => (
          <img 
            key={doll.id}
            src={doll.img} 
            alt="flying doll" 
            className="flying-doll"
            style={{
              left: `${doll.x}%`,
              animationDuration: `${doll.speed}s`,
            }}
            onAnimationEnd={() => removeDoll(doll.id)}
          />
        ))}

        {/* --- B. 渲染使用者的願望 (星星/愛心 + 文字) --- */}
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="flying-wish"
            style={{
              left: `${wish.x}%`,
              animationDuration: `${wish.speed}s`,
            }}
            onAnimationEnd={() => removeWish(wish.id)}
          >
            {/* 圖示 */}
            <div className={`pixel-icon ${wish.type}`}>
               {wish.type === 'star' ? <Star size={32} fill="#FFD700" /> : <Heart size={32} fill="#FF69B4" />}
            </div>
            {/* 文字氣泡 */}
            <span className="wish-bubble">{wish.text}</span>
          </div>
        ))}
      </div>

      <footer className="control-panel">
        <form onSubmit={handleWishSubmit} className="pixel-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Make a wish..."
            className="pixel-input"
            maxLength={30}
          />
          <button type="submit" className="pixel-btn">
            SEND <Send size={16} style={{marginLeft: '8px'}}/>
          </button>
        </form>
        
        <div className="pixel-nav">
            <Link to="/map" style={{ textDecoration: 'none', color: '#88ff88' }}>
                [ Map ]
            </Link>
            <span>[ Style ]</span>
            <span>[ Dict ]</span>
        </div>
      </footer>
    </div>
  );
};

export default MakeAWish;