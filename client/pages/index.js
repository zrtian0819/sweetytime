import Styles from '@/styles/home.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';

import PhotoFrams from '@/components/photoFrame';
import Pikaso from '@/components/pikaso';
import NeonLightPopup from '@/components/NeonLightPopup';

import { useState, useEffect, useRef } from 'react';
import { Image } from 'lucide-react';
import gsap from 'gsap';

// 石膏像物件(蘇雅提供)
const plaster = [
	{
		plaster_id: 1,
		src: '/photos/pikaso/Pikaso1.png',
		text: '甜點大師Pierre Hermé有句名言： 「鹹食養人，甜食悅人」（Le salé nous nourrit, le sucré nous réjouit），當人們品嚐各式甜點時，臉上常會不自覺綻放出笑容，那是一種喜悅和幸福的感覺，具有撫慰人心的魔力。',
		bgc: '1',
	},
	{
		plaster_id: 2,
		src: '/photos/pikaso/Pikaso2.png',
		text: "Ernestine Ulmer（美國作家）： 「人生充滿不確定，吃點甜點會讓一切更好。」 （'Life is uncertain. Eat dessert first.'）",
		bgc: '2',
	},
	{
		plaster_id: 3,
		src: '/photos/pikaso/Pikaso3.png',
		text: 'Ferran Adrià（西班牙名廚，分子料理的代表人物）： 「甜點是創意的極致，它不僅關乎味覺，更是情感的交流。」 （"Desserts are the ultimate expression of creativity, not just about taste but an emotional exchange."）',
		bgc: '3',
	},
	{
		plaster_id: 4,
		src: '/photos/pikaso/Pikaso4.png',
		text: 'Julia Child（美國名廚，法式烹飪的推廣者）： 「人生短暫，先吃甜點吧！」 （"Life itself is the proper binge. Lets start with dessert!"）',
		bgc: '2',
	},
];

export default function Home() {
	const scroller = useRef();
	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);
	const [currentPlaster, setCurrentPlaster] = useState(0);
	const [snowShow, setSnowShow] = useState(true);

	const snows = [];

	for (let i = 0; i < 60; i++) {
		let top = Math.random() * 100;
		let left = Math.random() * 100;
		let delay = Math.random() * 5;
		let sec = 2+ Math.random() * 2;
		snows.push(
			<div
				className={Styles['snow']}
				style={{
					top: `${top}vh`,
					left: `${left}vw`,
					animation: `snowFall ${sec}s linear infinite ${-delay}s`,
				}}
				key={i}
			></div>
		);
	}

	useEffect(() => {
		let randomPage = Math.floor(Math.random() * plaster.length + 1);
		console.log(randomPage);
		setCurrentPlaster(randomPage); //讓每次登入時都是隨機的蠟像
	}, []);

	useEffect(() => {
		//旋轉器動畫
		if (scrollerClick != 0) {
			gsap.to(scroller.current, {
				rotate: '-=987',
				duration: 2,
				ease: 'bounce.out',
			});
		}
	}, [scrollerClick]);

	return (
		<>
			<NeonLightPopup />
			<Header />

			<div className={`${Styles['ZRT-allPage']}`}>
				<div
					id="sec1"
					className={`${Styles['sec']} ${Styles['sec1']} d-flex pt-5 ZRT-center`}
				>
					{plaster.map((pla) => {
						let nowClass;
						if (pla.plaster_id == currentPlaster) {
							nowClass = 'now';
						} else if (pla.plaster_id < currentPlaster) {
							nowClass = 'past';
						} else {
							nowClass = 'future';
						}
						return (
							<div key={pla.plaster_id} className={`plaster_${nowClass}`}>
								<Pikaso src={pla.src} text={pla.text} bgc={pla.bgc}></Pikaso>
							</div>
						);
					})}

					<div
						ref={scroller}
						className={`${Styles['ZRT-scroller']}`}
						onClick={() => {
							if (currentPlaster < plaster.length) {
								setCurrentPlaster(currentPlaster + 1);
							} else {
								setCurrentPlaster(1);
							}
							setScrollerClick(Date.now());

							// setSnowShow(true);
							// setTimeout(() => {
							// 	setSnowShow(false);
							// }, 1000);
						}}
					>
						<img src={'/icon/spinMe.svg'} alt="" />
					</div>

					<div className="snows" style={{ opacity: snowShow ? 1 : 0 }}>
						{snows}
					</div>
				</div>
				<div id="sec2" className={`${Styles['sec']} ${Styles['sec2']}`}>
					<div className="container frames pt-5 d-flex">
						<PhotoFrams
							width={180}
							height={300}
							src={'/photos/products/01_cheesemate_chesse.jpg'}
						/>
						<PhotoFrams
							width={200}
							height={150}
							src={'/photos/products/00_mpapa_moossecake_choco.jpg'}
						/>
						<PhotoFrams
							width={400}
							height={300}
							src={'/photos/products/05_aki_pudding_matcha.jpg'}
						/>
					</div>
				</div>
				<div id="sec3" className={`${Styles['sec']} ${Styles['sec3']}`}></div>
				<div id="sec4" className={`${Styles['sec']} ${Styles['sec4']}`}></div>
			</div>
			<div
				className={`${Styles['ZRT-couponBtn']} ZRT-click`}
				onClick={() => {
					setCouponShow(!couponShow);
				}}
			>
				<img src={'/icon/getCoupon.svg'} alt="" />
			</div>
			<Footer />

			<style jsx>
				{`
					.plaster_now {
						position: absolute;
						left: 30%;
						top: 50%;
						transform: translate(-50%, -50%);
						transition: 1s;
						rotate: 0deg;
					}

					.plaster_past {
						position: absolute;
						left: 10%;
						top: 120%;
						transform: translate(-50%, -50%);
						transition: 2s;
						scale: 1.2;
						opacity: 0;
						rotate: -50deg;
					}

					.plaster_future {
						position: absolute;
						top: 0%;
						left: 100%;
						scale: 0.3;
						opacity: 0;
						transform: translate(-50%, -50%);
						transition: 0.5s;
						rotate: 35deg;
					}

					@media (max-width: 768px) {
						.plaster_now {
							top: 40vh;
							left: 50%;
						}
					}

					.snows {
						transition: 0.3s;
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
