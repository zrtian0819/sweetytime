import React, { useMemo } from 'react';

const SnowFall = ({ snowNumber = 100 }) => {
	// 使用 useMemo 緩存雪花元素，只在 snowNumber 改變時重新計算
	const snows = useMemo(() => {
		const snowElements = [];
		const snowColor = [
			'rgba(193, 228, 255, 0.8)',
			'rgba(252, 66, 134, 0.8)',
			'rgba(255, 214, 131, 0.8)',
		];

		for (let i = 0; i < snowNumber; i++) {
			const top = Math.random() * 100;
			const left = Math.random() * 100;
			const delay = Math.random() * 5;
			const duration = 10 + Math.random() * 20;
			const size = 15 + Math.random() * 55; // 隨機大小，讓雪花更自然
			const zIndex = -1 + Math.floor(Math.random() * 11);
			const ranDomColor = Math.floor(Math.random() * snowColor.length);

			snowElements.push(
				<div
					key={i}
					className="snow"
					style={{
						position: 'absolute',
						width: `${size}px`,
						height: `${size}px`,
						backgroundColor: `${snowColor[ranDomColor]}`,
						borderRadius: '50%',
						top: `${top}vh`,
						left: `${left}vw`,
						opacity: 0,
						animation: `snowFall ${duration}s linear infinite ${-delay}s`,
						zIndex: `${zIndex}`,
					}}
				/>
			);
		}

		return snowElements;
	}, [snowNumber]); // 只在 snowNumber 改變時重新計算

	return (
		<div className="snow-container">
			{snows}
			<style jsx global>{`
				.snow-container {
					//position: fixed;
					top: 0;
					left: 0;
					width: 100vw;
					height: 100vh;
					pointer-events: none;
					 {
						/* z-index: 5; */
					}
				}

				@keyframes snowFall {
					100% {
						transform: translate(0, -10vh);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
					90% {
						opacity: 1;
					}
					0% {
						transform: translate(0, 110vh);
						opacity: 0;
					}
				}
			`}</style>
		</div>
	);
};

export default SnowFall;
