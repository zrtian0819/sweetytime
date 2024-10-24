import Styles from '@/styles/home.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PhotoFrams from '@/components/photoFrame';
import { useState, useEffect, useRef } from 'react';
import { Image } from 'lucide-react';
import gsap from 'gsap';

export default function Home() {
	const a = useRef();
	const sections = useRef();
	const scroller = useRef();

	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);

	// useEffect(() => {
	// 	gsap.to(a.current, {
	// 		x: 300,
	// 		duration: 3,
	// 		rotate: 360,
	// 		repeat: -1,
	// 		delay: 1,
	// 	});
	// }, []);

	useEffect(() => {

		if(scrollerClick!=0){
			gsap.to(scroller.current, {
				rotate: "+=420",
				duration: 1,
				ease: "bounce.out"
			});
		}

	}, [scrollerClick]);

	// const [sec, setSec] = useState(1);
	// const [canScroll, setCanScroll] = useState(true);
	// const wrapper = useRef(null)
	// const { gsap } = useGSAP(); // 使用 useGSAP 來獲取 gsap 實例

	// useEffect(() => {

	// 	window.addEventListener('wheel', (event) => {
	// 		if (event.deltaY < 0) {
	// 			console.log('Scrolling up');
	//       setCanScroll(false);
	//       //禁止滑鼠滾動
	//       //依據目前所在section新增向上滾動動畫

	// 		} else {
	// 			console.log('Scrolling down');
	// 			setCanScroll(false);
	//       //禁止滑鼠滾動
	//       //依據目前所在section新增向下滾動動畫
	// 		}
	// 	});

	// }, []);

	// useEffect(() => {
	// 	if (!canScroll) {
	//     const timer = setTimeout(() => {
	//     setCanScroll(true);

	//     //設定滾輪為可以滾動
	// }, 1500);

	//   return () => clearTimeout(timer);
	// }
	// 	}, [canScroll]);

	return (
		<>
			<Header />
			<div className={`${Styles['ZRT-allPage']} test-mode`} ref={sections}>
				<div className={`${Styles['sec']} ${Styles['sec1']}`}>
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
				<div className={`${Styles['sec']} ${Styles['sec2']}`}>
					<div className="container frames pt-5 d-flex" ref={a}>
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
				<div className={`${Styles['sec']} ${Styles['sec3']}`}></div>
				<div className={`${Styles['sec']} ${Styles['sec4']}`}></div>
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
