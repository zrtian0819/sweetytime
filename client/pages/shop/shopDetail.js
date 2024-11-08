import React, { useEffect, useRef, useState } from 'react';
import Styles from '@/styles/shopDetail.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import CircularSlider from '@/components/shop/shop-detail/CircularSlider';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

//視窗Hook
const LAYOUT = {
	MOBILE: 'mobile',
	DESKTOP: 'desktop',
};

const MAX_MOBILE_WIDTH = 768;

const useMedia = () => {
	const [currentLayout, setCurrentLayout] = useState(LAYOUT.MOBILE);

	useEffect(() => {
		const handleWindowWidth = () => {
			if (window.innerWidth < MAX_MOBILE_WIDTH) {
				setCurrentLayout(LAYOUT.MOBILE);
			} else {
				setCurrentLayout(LAYOUT.DESKTOP);
			}
		};

		handleWindowWidth();
		window.addEventListener('resize', handleWindowWidth);

		return () => window.removeEventListener('resize', handleWindowWidth);
	}, []);

	return currentLayout;
};

export default function ShopDetail() {
	const circleLogos = [
		'/photos/shop_logo/sugar_logo.png',
		'/photos/shop_logo/mpapa_logo.png',
		'/photos/shop_logo/SEASON_Artisan_Pâtissier_logo.jpg',
		'/photos/shop_logo/laviebonbon_logo.jpg',
	];

	const shop = {
		name: 'SEASON Artisan Pâtissier敦南旗艦店',
		phone: '02-27085299',
		address: '台北市大安區敦化南路一段295巷16號1樓',
		description:
			'SEASON Artisan Pâtissier於2011年8月品牌誕生,在台北大直豪宅靜巷中發跡,也是甜點市場中人氣居高不墜的話題品牌,全台唯一提供多款現做盤式甜點的甜點概念餐廳,以獨特的個性和精緻的產品廣受媒體和美食同好熱愛推崇',
		logo_path: '/photos/shop_logo/SEASON_Artisan_Pâtissier_logo.jpg',
	};

	const footerRef = useRef(null);
	const sidebarRef = useRef(null);
	const [isSidebarFixed, setIsSidebarFixed] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const { favorites, toggleFavorite } = useFavorites();
	const currentLayout = useMedia();

	// 側邊欄隨視窗滾動
	useEffect(() => {
		const handleScroll = () => {
			if (footerRef.current && sidebarRef.current) {
				const footerTop = footerRef.current.getBoundingClientRect().top;
				const sidebarHeight = sidebarRef.current.getBoundingClientRect().height;

				setIsSidebarFixed(footerTop > sidebarHeight + 20);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const imagesToShow = 4;
	const autoSlideInterval = 3000;

	// 圓形滑動自動切換
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % circleLogos.length);
		}, autoSlideInterval);
		return () => clearInterval(interval);
	}, [circleLogos.length]);

	const visibleImages = circleLogos
		.slice(activeIndex, activeIndex + imagesToShow)
		.concat(circleLogos.slice(0, Math.max(0, activeIndex + imagesToShow - circleLogos.length)));

	// 收藏狀態
	const isLiked = favorites?.shop?.[shop.id] || false;
	return (
		<>
			<Header />
			<div className={`${Styles['TIL-bgColor']} container-fluid p-0`}>
				<div
					className={`${Styles['TIL-shopDetailALL']} row w-100 d-flex flex-column-reverse flex-md-row m-auto`}
				>
					{/* 側邊欄 */}
					<div className="col-12 col-md-3 d-flex gap-3 justify-content-center my-5">
						<div
							className={`d-flex flex-row flex-md-column m-auto gap-sm-5 gap-3`}
							style={{
								position:
									isSidebarFixed && currentLayout !== LAYOUT.MOBILE
										? 'fixed'
										: 'relative',
								top: currentLayout === LAYOUT.MOBILE ? 'unset' : '53px',
								bottom: currentLayout === LAYOUT.MOBILE ? '20px' : 'unset',
							}}
							ref={sidebarRef}
						>
							{visibleImages.map((logo, index) => (
								<Link href={`/shop`} key={index}>
									<div className={`${Styles['TIL-sideBarCircle']} mx-auto p-0`}>
										<Image
											src={logo}
											alt={`Logo ${index + 1}`}
											width={70}
											height={70}
											className={Styles['TIL-sideBarImage']}
										/>
									</div>
								</Link>
							))}
						</div>
					</div>

					{/* 主要內容 */}
					<div className={`${Styles['TIL-content']} col-md-9 d-flex flex-column gap-5`}>
						<div className="d-flex flex-lg-row justify-content-center flex-column-reverse px-md-3 px-lg-5">
							<div
								className={`${Styles['TIL-shopContent']} col-lg-7 mx-lg-5 d-flex flex-column pe-md-2 me-md-3 col-12 p-3 text-white gap-4`}
							>
								<div className="d-flex flex-column-reverse flex-sm-row">
									<h1 className="my-lg-5 text-white">{shop.name}</h1>
									<button
										className={`${Styles['TIL-FavoriteBox']} btn`}
										onClick={() => toggleFavorite('shop', shop.id)}
									>
										<FaHeart size={40} color={isLiked ? '#fe6f67' : 'grey'} />
									</button>
								</div>
								<div className="d-flex flex-row row me-lg-5 gap-1 gap-md-0">
									<div className="col-lg-3 col-md-4 text-center">
										<h3>聯絡電話：</h3>
									</div>
									<div className="col-lg-9 col-md-8 text-center text-md-start">
										<p>{shop.phone}</p>
									</div>
								</div>

								<div className="d-flex flex-row row me-lg-5 gap-1 gap-md-0">
									<div className="col-lg-3 col-md-4 text-center">
										<h3>商家地址：</h3>
									</div>
									<div className="col-lg-9 col-md-8 text-center text-md-start">
										<p>{shop.address}</p>
									</div>
								</div>

								<div className="d-flex flex-row row me-lg-5 gap-1 gap-md-0">
									<div className="col-lg-3 col-md-4 text-center">
										<h3>關於我們：</h3>
									</div>
									<div className="col-lg-9 col-md-8">
										<p className="text-start">{shop.description}</p>
									</div>
								</div>
							</div>
							<div
								className={`${Styles['TIL-detail-logo']} col-lg-3 col-md-3 col-12 m-auto`}
							>
								<Image
									src={shop.logo_path}
									alt={shop.name}
									width={50}
									height={50}
									className={`${Styles['TIL-logo']}`}
								/>
							</div>
						</div>
						<CircularSlider images={visibleImages} />
					</div>
				</div>
				<div ref={footerRef}>
					<Footer />
				</div>
			</div>
		</>
	);
}
