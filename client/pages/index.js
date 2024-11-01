import sty from '@/styles/home.module.scss';

// 元件
import Header from '@/components/header';
import Footer from '@/components/footer';
import PhotoFrams from '@/components/photoFrame';
import Pikaso from '@/components/pikaso';
import HomeTeacher from '@/components/home-teacher';
import HomeSideBoard from '@/components/home-psideboard';
import HomeShop from '@/components/home-shop';
import NeonLightPopup from '@/components/NeonLightPopup';
import CouponPopup from '@/components/couponPopup';
import SnowFall from '@/components/snowFall';

//鉤子與方法
import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import MotionPathPlugin from 'gsap/dist/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(MotionPathPlugin);

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
		width: 150,
		height: 130,
		src: '/photos/products/Aposo_39.jpg',
		class: 1,
		color: '#F2C2C9',
	},
	{
		width: 160,
		height: 140,
		src: '',
		class: '',
		color: '#EC6D76',
	},
	{
		width: 180,
		height: 140,
		src: '/photos/products/FADENFASAi.class (14).jpg',
		class: 2,
		color: '#E8B2BB',
	},
	{
		width: 150,
		height: 120,
		src: '',
		class: '',
		color: '#F2C2C9',
	},
	{
		width: 200,
		height: 170,
		src: '/photos/products/GustaveHenri_7.jpg',
		class: 3,
		color: '#F2C2C9',
	},
	{
		width: 140,
		height: 160,
		src: '',
		class: '',
		color: '#EC6D76',
	},
	{
		width: 200,
		height: 150,
		src: '/photos/products/10_souvenir_puff_matcha.jpg',
		class: 4,
		color: '#EC6D76',
	},
	{
		width: 170,
		height: 120,
		src: '',
		class: '',
		color: '#E8B2BB',
	},
	{
		width: 180,
		height: 150,
		src: '/photos/products/01_onTheRoad_strawberry.jpg',
		class: 5,
		color: '#E8B2BB',
	},
	{
		width: 210,
		height: 170,
		src: '',
		class: '',
		color: '#EA626C',
	},
	{
		width: 160,
		height: 180,
		src: '/photos/products/52_cupostory_dacquoise_chocolate.jpg',
		class: 6,
		color: '#EA626C',
	},
	{
		width: 180,
		height: 160,
		src: '',
		class: '',
		color: '#E8B2BB',
	},
	{
		width: 200,
		height: 150,
		src: '',
		class: '',
		color: '#EA626C',
	},
	{
		width: 150,
		height: 120,
		src: '',
		class: '',
		color: '#E8B2BB',
	},
	{
		width: 150,
		height: 160,
		src: '/photos/products/GustaveHenri_53.jpg',
		class: 7,
		color: '#E8B2BB',
	},
	{
		width: 210,
		height: 170,
		src: '',
		class: '',
		color: '#EA626C',
	},
];

//建立老師物件
const teachers = [
	{
		name: '施易男',
		title: '甜點王子',
		src: '/photos/teachers/shiinan.png',
	},
	{
		name: 'Maggie',
		title: '美姬饅頭創辦人',
		src: '/photos/teachers/Maggie.png',
	},
	{
		name: '王家承 Jeffrey',
		title: '慕斯主廚',
		src: '/photos/teachers/01_jeffrey.png',
	},
	{
		name: '劉偉苓 Willin',
		title: '洋菓子主廚',
		src: '/photos/teachers/00_willin.png',
	},
	{
		name: '陳上瑞',
		title: '法式主廚',
		src: '/photos/teachers/02_ray.png',
	},
	{
		name: '林庚辰',
		title: '御菓子主廚',
		src: '/photos/teachers/03_lin.png',
	},
];

//類別與相片清單
const dessertType = [
	{
		typeId: 1,
		typeName: '蛋糕',
		typePhoto: '/photos/products/Aposo_13.jpg',
	},
	{
		typeId: 2,
		typeName: '餅乾',
		typePhoto: '/photos/products/GustaveHenri_20.jpg',
	},
	{
		typeId: 3,
		typeName: '塔與派',
		typePhoto: '/photos/products/Aposo_12.jpg',
	},
	{
		typeId: 4,
		typeName: '泡芙',
		typePhoto: '/photos/products/s_15_GreedyBeagle_OriginalPuffs.png',
	},
	{
		typeId: 5,
		typeName: '冰淇淋',
		typePhoto: '/photos/products/00_onTheRoad_saltChoco.jpg',
	},
	{
		typeId: 6,
		typeName: '其他',
		typePhoto: '/photos/products/51_cupostory_dacquoise_chocolate.jpg',
	},
	{
		typeId: 7,
		typeName: '可麗露',
		typePhoto: '/photos/products/GustaveHenri_51.jpg',
	},
];

//商家logo清單
const shopList = [
	{
		shopId: '',
		photo: '/photos/shop_logo/ChizUp_logo.webp',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/greedyDog_logo.jpg',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/Give_Cold_Bird_logo.jpg',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/Jingimoo_logo.png',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/卡啡那_logo.jpg',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/晨露_logo.jpg',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/The_13_logo.jpg',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/FADENFASAï_logo.png',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/cafe4way_logo.png',
	},
	{
		shopId: '',
		photo: '/photos/shop_logo/beardpapas_logo.png',
	},
];

//物件移動路徑
const MyPath = [
	{ x: '10vw', y: '3vh' },
	{ x: '20vw', y: '-5vh' },
	{ x: '30vw', y: '-10vh' },
	{ x: '40vw', y: '-15vh' },
	{ x: '50vw', y: '-12vh' },
	{ x: '60vw', y: '-5vh' },
	{ x: '70vw', y: '5vh' },
	{ x: '80vw', y: '0vh' },
	{ x: '90vw', y: '-5vh' },
	{ x: '100vw', y: '-15vh' },
	{ x: '140vw', y: '-30vh' },
];

export default function Home() {
	const scroller = useRef();
	const shops = useRef();
	const [couponShow, setCouponShow] = useState(false);
	const [scrollerClick, setScrollerClick] = useState(0);
	const [currentPlaster, setCurrentPlaster] = useState(0);
	const [snowShow, setSnowShow] = useState(true);
	const [classSideBar, setClassSideBar] = useState(false);
	const [sideboard, setSideBoard] = useState(false);
	const [currentType, setCurrentType] = useState(1);

	//雪花物件
	const snow_number = 200;
	const snows = [];
	for (let i = 0; i < snow_number; i++) {
		let top = Math.random() * 100;
		let left = Math.random() * 100;
		let delay = Math.random() * 5;
		let sec = 20 + Math.random() * 10;
		snows.push(
			<div
				className={`${sty['snow']}`}
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

		//導入相框動畫
		// gsap.to('.frames', {
		// 	scrollTrigger: {
		// 		trigger: '.frames',
		// 		start: '-300 center',
		// 		scrub: true,
		// 		// markers:true
		// 	},
		// 	ease: 'none',
		// 	x: -250,
		// });

		//師資無限輪播動畫
		const teacher_tl = gsap.timeline({ repeat: -1 });
		teacher_tl.to('.teachers', {
			x: '-2500',
			duration: 10, // 調整動畫持續時間
			ease: 'none', // 設定動畫緩動方式
		});

		//商家無限輪播
		const aniDuration = 15; //動畫速度在這裡設定
		const aniDelay = aniDuration / shopList.length;
		for (let i = 0; i < shopList.length; i++) {
			gsap.to(`.ZRT-shop-${i}`, {
				duration: aniDuration,
				delay: i * aniDelay,
				rotate: '+720',
				repeat: -1,
				motionPath: {
					path: MyPath,
					curviness: 1.5, // 曲線彎曲程度
					// autoRotate: true, // 沿著路徑自動旋轉
				},
				ease: 'none',
			});
		}
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

	// useEffect(() => {}, [classSideBar]);

	return (
		<>
			{/* 抱歉了鈞盛,開發期間會暫時關掉 嘻嘻 */}
			{/* <NeonLightPopup /> */}
			<Header />

			<div className={`${sty['ZRT-allPage']}`}>
				{/* 區塊一 */}
				<div id="sec1" className={`${sty['sec']} ${sty['sec1']} d-flex pt-5 ZRT-center`}>
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
						className={`${sty['ZRT-scroller']}`}
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

					{/* <div className="snows" style={{ opacity: snowShow ? 1 : 0 }}>
						{snows}
					</div> */}
					<SnowFall />
				</div>

				{/* 區塊二 */}
				<div
					id="sec2"
					className={`${sty['sec']} ${sty['sec2']} ZRT-center d-flex flex-column`}
				>

					<div className={`${sty['sec2-title']}`}>
						<img src="icon/topPicks.svg" alt="" />
					</div>
					<div className="frames d-flex justify-content-start py-5">
						{frames.map((f, i) => {
							return (
								<div
									key={i}
									className="frame ZRT-click ZRT-center"
									onClick={() => {
										if (f.class != '') {
											// alert('class is ' + f.class);
											setClassSideBar(!classSideBar);
											setSideBoard(true);
											setCurrentType(f.class);
										}
									}}
								>
									<PhotoFrams
										width={f.width}
										height={f.height}
										src={f.src}
										color={f.color}
									/>
								</div>
							);
						})}
					</div>
					<div className={`${sty['sec3-side']}`}>
						<HomeSideBoard
							src={dessertType[currentType - 1].typePhoto} //⚠暫時這麼寫
							type={dessertType[currentType - 1].typeName} //⚠暫時這麼寫
							typeNum={dessertType[currentType - 1].typeId} //⚠暫時這麼寫
							sideboard={sideboard}
							setSideBoard={setSideBoard}
							HomeSideBoard={HomeSideBoard}
						/>
					</div>
				</div>

				{/* 區塊三 */}
				<div id="sec3" className={`${sty['sec']} ${sty['sec3']} ZRT-center`}>
					<div className={`${sty['sec3-wrapper']}`}>
						<div className={`${sty['lessonIntro']}`}>
							<div className={`${sty['lessonInfo']}`}>
								<div className={`${sty['lessonText']}`}>
									<h1>
										手作藍莓果醬鬆餅課程
										<br />
										甜點王子 施易男老師
									</h1>
								</div>

								<div className={`${sty['lessonBtnArea']}`}>
									<Link href="/lesson">
										<h3 className={`${sty['lessonBtn']} ZRT-click`}>
											課程資訊
										</h3>
									</Link>
								</div>
							</div>
							<div className={`${sty['sec3-imgBox']}`}>
								<Image
									src="photos/lesson/06_cake_chestnut.jpg"
									alt=""
									width={0}
									height={0}
								/>
							</div>
							<div className="ZRT-center">
								<Link href="/lesson">
									<div
										className={`${sty['lessonListBtn']} ZRT-hollow-whtBtn ZRT-click rounded-pill`}
									>
										尋找課程
									</div>
								</Link>
							</div>
						</div>
						<div className={`${sty['arc']} d-none d-md-block`}>
							<img src="/photos/background/arch.png" alt="" />

							<div className={`tWrapper ${sty['tWrapper']}`}>
								<div className={`teachers ${sty['teachers']}`}>
									{teachers.map((t, i) => {
										return (
											<HomeTeacher
												key={i}
												name={t.name}
												title={t.title}
												src={t.src}
											/>
										);
									})}
								</div>
							</div>
							<Link href="/teacher">
								<div
									className={`${sty['teacherBtn']} ZRT-hollow-whtBtn ZRT-click rounded-pill`}
								>
									尋找師資
								</div>
							</Link>
						</div>
					</div>
				</div>

				{/* 區塊四 */}
				<div id="sec4" className={`${sty['sec']} ${sty['sec4']}`}>
					<div
						className={`${sty['sec4-wrapper']} d-flex flex-column justify-content-center align-items-center align-items-md-start`}
					>
						<h1 className={`${sty['title']}`}>精選商家</h1>
						<div className={`${sty['shopBox']} container mt-2 d-md-none`}>
							<div className="row row-cols-2 g-2">
								{shopList.map((s, i) => {
									return (
										<div
											key={i}
											className={`d-flex justify-content-center ${sty['shopSM-logo']}`}
										>
											<HomeShop src={s.photo} width={120} />
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<Image
						className={`${sty['sec4-bgVector']} d-none d-md-block`}
						src="vector/BgSec4TwoLine.svg"
						width={0}
						height={0}
						alt=""
					></Image>
					{shopList.map((s, i) => {
						return (
							<div
								key={i}
								className={`ZRT-shop-${i} ${sty['shopLogo']} d-none d-md-block`}
							>
								<HomeShop src={s.photo} />
							</div>
						);
					})}
				</div>
			</div>

			{/* 優惠券彈窗組件
				isOpen={couponShow} - 控制彈窗顯示狀態的prop，true顯示/false隱藏
				onClose={() => setCouponShow(false)} - 關閉彈窗的回調函數，點擊關閉按鈕時觸發
			*/}
			<CouponPopup isOpen={couponShow} onClose={() => setCouponShow(false)} />

			{/* 優惠券按鈕容器 */}
			<div
				className={`${sty['ZRT-couponBtn']} ZRT-click`}
				// 點擊按鈕時將couponShow設為true，顯示優惠券彈窗
				onClick={() => setCouponShow(true)}
			>
				{/* 優惠券圖標 */}
				<img src={'/icon/getCoupon.svg'} alt="" />
			</div>
			<Footer bgColor="#fda2a2" />

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
						max-width: 1440px;
						width: 100%;
						padding: 0 20px;

						display: flex;
						flex-direction: column;
						flex-wrap: wrap;
						height: 95vh;
						justify-content: center;
						overflow-x: scroll;
						scrollbar-width: none;
					}
					.frame {
						margin-bottom: 5px;
						position: relative;
						// width: 25%;
						padding: 0px;
					}
					.frame:hover {
						animation: vibrate 0.2s alternate 0.4s linear;
					}

					@keyframes vibrate {
						0% {
							rotate: 1deg;
						}
						100% {
							rotate: -1deg;
						}
					}

					@media (max-width: 768px) {
						.frames {
							aspect-ratio: 1/1;
							// width: 140%;
							padding: 0 5px;
						}
					}
				`}
			</style>
		</>
	);
}
