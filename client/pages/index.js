import Styles from '@/styles/home.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PhotoFrams from '@/components/photoFrame';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

export default function Home() {
	const a = useRef();
	const sections = useRef();

	useGSAP(() => {
		() => {
			// gsap code here...
			gsap.to('.frames', { rotation: 27, x: 100, duration: 10 }); // <-- automatically reverted
		}
	});

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
			<div className="sections" ref={sections}>
				<div className={`${Styles['sec']} ${Styles['sec1']}`}></div>
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
			<Footer />
		</>
	);
}
