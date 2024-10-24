import Styles from '@/styles/home.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';

import PhotoFrams from '@/components/photoFrame';
import Pikaso from '@/components/pikaso';

import { useState, useEffect, useRef } from 'react';
import { Image } from 'lucide-react';
import gsap from 'gsap';

// 石膏像文字(蘇雅提供)
let text1 = `Pierre Hermé
「鹹食養人，甜食悅人」
Le salé nous nourrit, le sucré nous réjouit`;
let text2 = `Ernestine Ulmer「人生充滿不確定，吃點甜點會讓一切更好。」
（"Life is uncertain. Eat dessert first."）`;
let text3 = ``;
let text4 = ``;

export default function Home() {
	const scroller = useRef();

	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);

	useEffect(() => {
		//旋轉器動畫
		if (scrollerClick != 0) {
			gsap.to(scroller.current, {
				rotate: '+=420',
				duration: 2,
				ease: 'bounce.out',
			});
		}
	}, [scrollerClick]);

	return (
		<>
			<Header />

			<div className={`${Styles['ZRT-allPage']}`}>
				<div id="sec1" className={`${Styles['sec']} ${Styles['sec1']} d-flex pt-5 ZRT-center`}>
					<Pikaso src="/photos/pikaso/Pikaso1.png" text={text1} />
					<Pikaso src="/photos/pikaso/Pikaso2.png" text={text2} />
					<Pikaso src="/photos/pikaso/Pikaso3.png" text={text3} />
					<Pikaso src="/photos/pikaso/Pikaso4.png" text={text4} />

					<div
						ref={scroller}
						className={`${Styles['ZRT-scroller']}`}
						onClick={() => {
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
		</>
	);
}
