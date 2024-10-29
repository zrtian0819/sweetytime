import React, { useState, useEffect } from 'react';

const RainEffect = () => {
	const [drops, setDrops] = useState([]);

	const desserts = ['🍰', '🧁', '🍪', '🍮', '🍨', '🍫', '🍩', '🥞'];

	const createDrop = () => {
		return {
			// 1. 唯一識別碼
			id: Math.random(),
			// 2. 水平位置
			left: Math.random() * 100,
			// 3. 下落動畫持續時間
			duration: 2 + Math.random() * 4,
			// 4. 動畫延遲時間
			delay: Math.random() * 2,
			// 5. 甜點大小
			scale: 3 + Math.random() * 3,
			// 6. 隨機選擇甜點符號
			symbol: desserts[Math.floor(Math.random() * desserts.length)],
			// 7. 旋轉角度
			rotation: Math.random() * 360,
		};
	};

  useEffect(() => {
    // length是數量
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
      pointerEvents: 'none'
    }}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="dessert-drop"
          style={{
            position: 'absolute',
            left: `${drop.left}%`,
            top: '-20px',
            fontSize: '24px',
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            '--scale': drop.scale,
            '--rotation': `${drop.rotation}deg`,
          }}
        >
          {drop.symbol}
        </div>
      ))}

      <style jsx>{`
        .dessert-drop {
          animation: fall linear infinite;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(var(--scale));
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(10vh) rotate(90deg) scale(var(--scale));
          }
          90% {
            opacity: 1;
            transform: translateY(90vh) rotate(270deg) scale(var(--scale));
          }
          100% {
            transform: translateY(105vh) rotate(360deg) scale(var(--scale));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RainEffect;