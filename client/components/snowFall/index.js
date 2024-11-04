import React, { useState, useEffect } from 'react';
import sty from '@/styles/home.module.scss';
// 程式還未能正常執行

export default function SnowFall({ snowNumber = 100 }) {
	// const [snowStyle, setSnowStyle] = useState(null);
	let snows = [];

	for (let i = 0; i < snowNumber; i++) {
		const top = Math.random() * 100;
		const left = Math.random() * 100;
		const delay = Math.random() * 5;
		const sec = 20 + Math.random() * 10;

		let style = {
			top: `${top}vh`,
			left: `${left}vw`,
			animation: `snowFall ${sec}s linear infinite ${-delay}s`,
		};

		snows.push(<div className={sty['snow']} style={style}></div>);
	}

	useEffect(() => {
		console.log('🥲目前無法解決雪花報錯問題');
	}, []);

	return (
		<>
			{snows.map((snow, i) => {
				return <div key={i}>{snow}</div>;
			})}

			<style jsx>
				{`
					.snows {
						transition: 0.3s;
					}
					.snow {
						position: absolute;
						width: 10px;
						height: 10px;
						background-color: #fff;
						border-radius: 50%;
					}
					@keyframes snowFall {
						0% {
							transform: translate(100%, -200px);
							opacity: 0;
						}
						50% {
							opacity: 1;
						}
						100% {
							transform: translate(-100%, 900px);
							opacity: 0;
						}
					}
				`}
			</style>
		</>
	);
}
