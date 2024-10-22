import Styles from '@/styles/home.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState, useEffect , useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


export default function Home() {
	const [sec, setSec] = useState(1);
	const [canScroll, setCanScroll] = useState(true);
  const wrapper = useRef(null)
  const { gsap } = useGSAP(); // 使用 useGSAP 來獲取 gsap 實例

	useEffect(() => {

		window.addEventListener('wheel', (event) => {
			if (event.deltaY < 0) {
				console.log('Scrolling up');
        setCanScroll(false);
        //禁止滑鼠滾動
        //依據目前所在section新增向上滾動動畫

			} else {
				console.log('Scrolling down');
				setCanScroll(false);
        //禁止滑鼠滾動
        //依據目前所在section新增向下滾動動畫
			}
		});

     
	}, []);

	useEffect(() => {
		if (!canScroll) {
      const timer = setTimeout(() => {
      setCanScroll(true);

      //設定滾輪為可以滾動
  }, 1500);

  return () => clearTimeout(timer);
}
	}, [canScroll]);

	return (
		<div ref={wrapper}>
			<Header />

			<section id="sec1" className={`${Styles['sec']} ${Styles['sec1']}`}></section>
			<section id="sec2" className={`${Styles['sec']} ${Styles['sec2']}`}></section>
			<section id="sec3" className={`${Styles['sec']} ${Styles['sec3']}`}></section>
			<section id="sec4" className={`${Styles['sec']} ${Styles['sec4']}`}></section>
			<Footer />
		</div>
	);
}
