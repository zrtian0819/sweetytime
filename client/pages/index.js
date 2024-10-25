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
		text: 'Pierre Hermé \n「鹹食養人，甜食悅人」\n Le salé nous nourrit, le sucré nous réjouit',
	},
	{
		plaster_id: 2,
		src: '/photos/pikaso/Pikaso2.png',
		text: "Ernestine Ulmer「人生充滿不確定，吃點甜點會讓一切更好。」\n（'Life is uncertain. Eat dessert first.'）",
	},
	{
		plaster_id: 3,
		src: '/photos/pikaso/Pikaso3.png',
		text: '沒有名言餒',
	},
	{
		plaster_id: 4,
		src: '/photos/pikaso/Pikaso4.png',
		text: '第六小組的前端英雄們加油!',
	},
];

export default function Home() {
	const scroller = useRef();

	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);
	const [currentPlaster, setCurrentPlaster] = useState(1);

	useEffect(() => {
		//旋轉器動畫
		if (scrollerClick != 0) {
			gsap.to(scroller.current, {
				rotate: '-=420',
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
								<Pikaso src={pla.src} text={pla.text}></Pikaso>
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
						}}
					>
						<img src={'/icon/scrollDown.svg'} alt="" />
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
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
						transition: 1s;
					}

					.plaster_past {
						position: absolute;
						left: 10%;
						top: 120%;
						transform: translate(-50%,-50%);
						transition: 2s;
						scale: 1.2;
						opacity: 0;
					}

					.plaster_future {
						position: absolute;
						top: 0%;
						left: 100%;
						scale: 0.3;
						opacity: 0;
						transform: translate(-50%,-50%);
						transition: 0.5s;
					}
				`}
			</style>
		</>
	);
}
