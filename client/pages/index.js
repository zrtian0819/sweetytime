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

//建立畫框物件
const frames = [
	{
		width: 290,
		height: 320,
		src: '/photos/products/Aposo_39.jpg',
		class: 1,
		color:"#F2C2C9"
	},
	{
		width: 240,
		height: 200,
		src: '/photos/products/FADENFASAi.class (14).jpg',
		class: 2,
		color:"#E8B2BB"
	},
	{
		width: 180,
		height: 160,
		src: '',
		class:"",
		color:"#F2C2C9"
	},
	{
		width: 320,
		height: 260,
		src: '/photos/products/GustaveHenri_7.jpg',
		class: 3,
		color:"#829BD9"
	},
	{
		width: 180,
		height: 160,
		src: '',
		class:"",
		color:"#EC6D76"
	},
	{
		width: 260,
		height: 230,
		src: '/photos/products/10_souvenir_puff_matcha.jpg',
		class: 4,
		color:"#C2A2F6"
	},
	{
		width: 180,
		height: 160,
		src: '',
		class:"",
		color:"#E8B2BB"
	},
	{
		width: 220,
		height: 240,
		src: '/photos/products/01_onTheRoad_strawberry.jpg',
		class: 5,
		color:"#E8B2BB"
	},
	{
		width: 200,
		height: 230,
		src: '/photos/products/52_cupostory_dacquoise_chocolate.jpg',
		class: 6,
		color:"#A2A8F6"
	},
	{
		width: 180,
		height: 160,
		src: '',
		class:"",
		color:"#EA626C"
	},
	{
		width: 270,
		height: 240,
		src: '/photos/products/GustaveHenri_53.jpg',
		class: 7,
		color:"#829BD9"
	},
	{
		width: 180,
		height: 240,
		src: '',
		class:"",
		color:"#E8B2BB"
	},
];

export default function Home() {
	const scroller = useRef();
	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);
	const [currentPlaster, setCurrentPlaster] = useState(0);
	const [snowShow, setSnowShow] = useState(true);
	const [classSideBar, setClassSideBar] = useState(false);

	//雪花物件
	const snow_number = 100;
	const snows = [];
	for (let i = 0; i < snow_number; i++) {
		let top = Math.random() * 100;
		let left = Math.random() * 100;
		let delay = Math.random() * 5;
		let sec = 3 + Math.random() * 7;
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
		//讓每次載入時都是隨機的蠟像
		let randomPage = Math.floor(Math.random() * plaster.length + 1);
		setCurrentPlaster(randomPage);
	}, []);

	let timer;
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
				<div id="sec2" className={`${Styles['sec']} ${Styles['sec2']} ZRT-center`}>
					<div className="frames">
						{frames.map((f, i) => {
							return (
								<div className="frame ZRT-click ZRT-center">
									<PhotoFrams width={f.width} height={f.height} src={f.src} color={f.color} />
								</div>
							);
						})}
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
					 {
						/* sec1的部分 */
					}
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
						transition: 3s;
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
						transition: 0.2s;
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

					 {
						/* sec2的部分 */
					}
					.frames {
						column-count: 4;
						// column-gap: 30px;
						// min-height: 100vh;
						max-width: 1440px;
						width: 100%;
						padding: 0 20px 0 20px;
					}
					.frame {
						margin-bottom: 35px;
					}

					@media (max-width: 768px) {
						.frames {
							column-count: 2;
							column-gap: 50px;
							margin-bottom: 20px;
						}
					}
				`}
			</style>
		</>
	);
}
