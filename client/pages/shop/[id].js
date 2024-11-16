import React, { useEffect, useState, useRef } from 'react';
import Styles from '@/styles/shopDetail.module.scss';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';
import CircularSlider from '@/components/shop/shop-detail/CircularSlider';
import Link from 'next/link';

// 視窗Hook
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
	const [AllShop, setAllShop] = useState(null);
	const [shop, setShop] = useState(null);
	const router = useRouter();
	const { id } = router.query;
	const [isSidebarFixed, setIsSidebarFixed] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const imagesToShow = 4;
	const autoSlideInterval = 3000;
	const currentLayout = useMedia();
	const footerRef = useRef(null);
	const sidebarRef = useRef(null);

	// 取得所有商家(側邊欄用)
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/shop/frontend`)
			.then((response) => {
				setAllShop(response.data);
			})
			.catch((error) => console.error('Error fetching shop data:', error));
	}, []);

	// 設定側邊欄顯示的圖片陣列
	const visibleImages =
		AllShop && Array.isArray(AllShop)
			? AllShop.slice(activeIndex, activeIndex + imagesToShow).concat(
					AllShop.slice(0, Math.max(0, activeIndex + imagesToShow - AllShop.length))
			  )
			: [];

	// 取得特定商家資料
	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/shop/${id}`)
				.then((response) => {
					setShop(response.data);
				})
				.catch((error) => console.error('Error fetching shop data:', error));
		}
	}, [id]);

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

	// 圓形滑動自動切換
	useEffect(() => {
		if (AllShop && AllShop.length > 0) {
			const interval = setInterval(() => {
				setActiveIndex((prevIndex) => (prevIndex + 1) % AllShop.length);
			}, autoSlideInterval);
			return () => clearInterval(interval);
		}
	}, [AllShop]);

	return (
		<>
			<Header />
			<div className={`${Styles['TIL-bgColor']} container-fluid p-0`}>
				{shop ? (
					<div className={`${Styles['TIL-shopDetailALL']} row m-auto`}>
						{/* 側邊欄 */}
						<div className={`${Styles.sideBody} col-12 col-md-3`}>
							<div
								className={`${Styles.sideBar} gap-sm-5 gap-1`}
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
								{visibleImages.map((shop, index) => (
									<Link href={`/shop/${shop.id}`} key={shop.id}>
										<div className={Styles.sideBarCircle}>
											<Image
												src={`/photos/shop_logo/${shop.logo_path}`}
												alt={`Shop Logo ${index + 1}`}
												width={70}
												height={70}
												className={Styles.sideBarImage}
											/>
										</div>
									</Link>
								))}
							</div>
						</div>

						{/* 主要內容 */}
						<div className={`${Styles.content} col-md-9 gap-5`}>
							<div className={`${Styles.information} px-md-3 px-lg-5`}>
								<div
									className={`${Styles.shopContent} col-12 col-lg-7 mx-lg-5 pe-md-2 me-md-3 p-3 gap-4`}
								>
									<div className={Styles.fav}>
										<h1 className="text-white">{shop.name}</h1>
									</div>
									<div className={Styles.text}>
										<div className="col-lg-3 col-md-4 ">
											<h3>聯絡電話：</h3>
										</div>
										<div className="col-lg-9 col-md-8 ">
											<p>{shop.phone}</p>
										</div>
									</div>

									<div className={Styles.text}>
										<div className="col-lg-3 col-md-4 ">
											<h3>商家地址：</h3>
										</div>
										<div className="col-lg-9 col-md-8">
											<p>{shop.address}</p>
										</div>
									</div>

									<div className={Styles.text}>
										<div className="col-lg-3 col-md-4">
											<h3>關於我們：</h3>
										</div>
										<div className="col-lg-9 col-md-8">
											<p>{shop.description}</p>
										</div>
									</div>
								</div>
								<div className={`${Styles.logo} col-12 col-md-3 col-lg-3 m-auto`}>
									<Image
										src={`/photos/shop_logo/${shop.logo_path}`}
										alt={shop.name}
										width={50}
										height={50}
										className={Styles.detail_logo}
									/>
								</div>
							</div>
							<CircularSlider shop={shop} />
						</div>
					</div>
				) : (
					<p>Loading...</p>
				)}
				<div ref={footerRef}>
					<Footer />
				</div>
			</div>
		</>
	);
}
