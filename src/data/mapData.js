// src/data/mapData.js
import tojinboImg from '../assets/tojinbo.png';

// 定義各國家的主題列表 (圖片我先放空字串，你之後填入圖片路徑即可)
export const mapThemes = {
  kr: [
    // id: 'all' 從這裡移除，移到底部導覽列
    { id: 'kuri_tour', label: 'KURI TOUR', img: '' }, 
    { id: 'vlog_tour', label: 'WISH VLOG', img: '' },
    { id: 'debut', label: '出道紀念', img: '' },
  ],
  jp: [
    { id: 'asia_tour', label: '亞巡東京場', img: '' },
    { id: 'nasa_mv', label: 'NASA MV', img: '' },
    { id: 'hands_up', label: 'Hands Up', img: '' },
  ]
};

export const locations = {
  // --- 韓國區域 (Seoul) ---
  kr: [
    { 
      id: 1, 
      name: 'WISH Debut Show Case (Blue Square)', 
      lat: 37.5407, 
      lng: 127.0023, 
      type: 'mv',
      themes: ['debut'],
      // 新增以下欄位 (圖片暫時用空字串，之後填入 import 的圖片變數)
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。',
      mapUrl: 'https://naver.me/GeURMqwb'
    },
    { 
      id: 2, 
      name: 'Sion 推薦的聖水洞咖啡廳', 
      lat: 37.5446, 
      lng: 127.0559, 
      type: 'food',
      themes: ['kuri_tour'],
      detailImg: '',
      description: 'Sion 在直播中強力推薦的咖啡廳，招牌是鮮奶油拿鐵，店內裝潢非常復古。', 
      mapUrl: 'https://naver.me/GeURMqwb'
    },
    { 
      id: 3, 
      name: '漢江公園 (Vlog 拍攝地)', 
      lat: 37.5113, 
      lng: 126.9945, 
      type: 'spot',
      themes: ['vlog_tour', 'kuri_tour'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://naver.me/GeURMqwb'
    },
    { 
      id: 7, 
      name: 'SM Entertainment (Kwangya)', 
      lat: 37.5444, 
      lng: 127.0427, 
      type: 'spot',
      themes: ['debut', 'kuri_tour'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://naver.me/GeURMqwb' 
    }
  ],
  
  // --- 日本區域 (Tokyo) ---
  jp: [
    { 
      id: 4, 
      name: 'NASA MV 拍攝地 (晴空塔附近)', 
      lat: 35.7100, 
      lng: 139.8107, 
      type: 'mv',
      themes: ['nasa_mv'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://maps.app.goo.gl/rxHAAEghzigXoJiF6'
    },
    { 
      id: 5, 
      name: '東京巨蛋 (SMTOWN)', 
      lat: 35.7056, 
      lng: 139.7514, 
      type: 'spot',
      themes: ['asia_tour'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://maps.app.goo.gl/rxHAAEghzigXoJiF6'
    },
    { 
      id: 6, 
      name: 'Yushi 喜歡的拉麵店 (新宿)', 
      lat: 35.6909, 
      lng: 139.7003, 
      type: 'food',
      themes: ['kuri_tour'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://maps.app.goo.gl/rxHAAEghzigXoJiF6'
    },
    { 
      id: 8, 
      name: 'Hands Up MV 街景', 
      lat: 35.6617, 
      lng: 139.7040, 
      type: 'mv',
      themes: ['hands_up'], 
      detailImg: '', 
      description: 'NCT WISH 舉辦出道 Show Case 的地方，充滿回憶的舞台！當時在這裡表演了 WISH 和 Sail Away。', 
      mapUrl: 'https://maps.app.goo.gl/rxHAAEghzigXoJiF6'
    }, 
    { 
      id: 9, 
      name: '東尋坊', 
      lat: 36.237681, 
      lng: 136.125526, 
      type: 'spot',
      themes: ['kuri_tour'], 
      detailImg: tojinboImg, 
      description: 'kuri tour 前往的景點之一，壯觀的海蝕崖景色令人難忘！', 
      mapUrl: 'https://maps.app.goo.gl/rxHAAEghzigXoJiF6'
    }
  ]
};

// 新增：各國家的最佳視角設定 (中心點 + 縮放層級)
export const countrySettings = {
  kr: {
    center: [36.5, 127.8], // 韓國地理中心 (大約在忠清北道)
    zoom: 7,               // 縮放 7 剛好可以看到整個南韓
  },
  jp: {
    center: [36.2048, 138.2529], // 日本地理中心 (長野縣附近)
    zoom: 5,                     // 日本地形狹長，縮放 5 比較能涵蓋本州
  }
};