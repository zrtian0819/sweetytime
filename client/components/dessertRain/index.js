import React, { useState, useEffect } from 'react';

const RainEffect = () => {
  const [drops, setDrops] = useState([]);

  const desserts = [
    '🍰', // 蛋糕
    '🧁', // 纸杯蛋糕
    '🍪', // 饼干
    '🍮', // 布丁
    '🍨', // 冰淇淋
    '🍫', // 巧克力
    '🍩', // 甜甜圈
    '🥞', // 松饼
  ];

  // 生成随机位置和随机甜点
  const createDrop = () => {
    return {
      id: Math.random(),
      left: Math.random() * 100, // 整个视窗宽度的随机位置
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5,
      symbol: desserts[Math.floor(Math.random() * desserts.length)],
      rotation: Math.random() * 360
    };
  };

  useEffect(() => {
    const drops = Array.from({ length: 40 }, createDrop);
    setDrops(drops);

    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = [...prev];
        for(let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * newDrops.length);
          newDrops[randomIndex] = createDrop();
        }
        return newDrops;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none'  // 确保不会影响下方元素的交互
    }}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: `${drop.left}%`,
            top: '-20px',
            fontSize: '24px',
            animation: `fall ${drop.duration}s linear ${drop.delay}s infinite`,
            transform: `scale(${drop.scale}) rotate(${drop.rotation}deg)`,
            zIndex: 1
          }}
        >
          {drop.symbol}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RainEffect;