export default function adjustBrightness(hexColor, adjustment) {
    // 移除 # 號
    hexColor = hexColor.replace('#', '');
  
    // 將十六進位轉換為十進位 RGB 值
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
  
    // 調整 RGB 值
    const newR = Math.max(0, Math.min(255, r + adjustment));
    const newG = Math.max(0, Math.min(255, g + adjustment));
    const newB = Math.max(0, Math.min(255, b + adjustment));
  
    // 將 RGB 轉換回十六進位
    const newHex = '#' + ((1 << 24) | (newR << 16) | (newG << 8) | newB).toString(16).slice(1);
  
    return newHex;
  }
