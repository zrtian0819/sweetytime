import React, { useState, useEffect, useRef } from 'react';
import styles from '@/components/shop/shop-detail/CircularSlider.module.scss';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CircularSlider({ shop }) {
	const [product, setProduct] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(-1); // Hover 的商品索引
	const [currentBatchIndex, setCurrentBatchIndex] = useState(0); // 桌機版批次索引
	const [activeIndexInBatch, setActiveIndexInBatch] = useState(0); // 桌機版當前商品索引
	const [currentMobileIndex, setCurrentMobileIndex] = useState(0); // 手機版當前索引
	const [isPaused, setIsPaused] = useState(false); // 是否暫停桌機版自動輪播
	const router = useRouter();
	const { id } = router.query;

	const imagesToShow = 5; // 每批顯示的商品數量
	const autoSlideInterval = 3000; // 桌機版自動輪播間隔
	const autoSlideRef = useRef(null); // 自動輪播計時器
	const touchStartX = useRef(0); // 手機版滑動起點
	const touchEndX = useRef(0); // 手機版滑動終點

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/shop/${id}/products`)
				.then((response) => {
					const productsWithPhotos = response.data.map((product) => ({
						...product,
						random_photos: product.random_photos
							? product.random_photos.split(',')
							: [],
					}));
					setProduct(productsWithPhotos);
				})
				.catch((error) => {
					console.error('Error fetching products:', error);
				});
		}
	}, [id]);

	// 計算當前批次的商品（環狀列表邏輯）
	const currentBatch = Array.from({ length: imagesToShow }).map((_, index) => {
		// 計算循環索引
		const productIndex = (currentBatchIndex * imagesToShow + index) % product.length;
		return product[productIndex];
	});

	// 桌機版自動輪播
	useEffect(() => {
		if (!isPaused) {
			autoSlideRef.current = setInterval(() => {
				setActiveIndexInBatch((prevIndex) => {
					if (prevIndex + 1 >= imagesToShow) {
						// 如果當前批次商品全部轉動完，切換到下一批
						setCurrentBatchIndex((prevBatchIndex) => {
							return (prevBatchIndex + 1) % Math.ceil(product.length / imagesToShow);
						});
						return 0; // 重置批次內索引
					}
					return prevIndex + 1; // 批次內下一個商品
				});
			}, autoSlideInterval);
		}

		return () => clearInterval(autoSlideRef.current);
	}, [product, imagesToShow, isPaused]);

	// 手機版滑動邏輯
	const handleTouchStart = (e) => {
		touchStartX.current = e.changedTouches[0].clientX;
	};

	const handleTouchEnd = (e) => {
		touchEndX.current = e.changedTouches[0].clientX;
		if (touchStartX.current - touchEndX.current > 50) {
			// 向左滑動
			setCurrentMobileIndex((prevIndex) => (prevIndex + 1) % product.length);
		} else if (touchEndX.current - touchStartX.current > 50) {
			// 向右滑動
			setCurrentMobileIndex((prevIndex) => (prevIndex - 1 + product.length) % product.length);
		}
	};

	// 桌機版文字顯示商品
	const displayedProduct =
		hoveredIndex >= 0 ? currentBatch[hoveredIndex] : currentBatch[activeIndexInBatch];

	// 手機版文字顯示商品
	const mobileDisplayedProduct = product[currentMobileIndex];

	// 圓形排列邏輯（桌機版）
	const rotateAngle = 360 / imagesToShow;
	const carouselTransformStyle = {
		transform: `rotate(${rotateAngle * -activeIndexInBatch}deg)`,
		transition: 'transform 0.6s ease-in-out',
	};

	// 渲染桌機版商品
	const renderCircularItems = () => {
		return currentBatch.map((item, index) => {
			const angle = rotateAngle * index;
			return (
				<div
					key={item?.product_id || index}
					className={styles['carousel-item']}
					style={{
						transform: `rotate(${angle}deg) translateY(-200px)`,
					}}
					onMouseEnter={() => {
						setHoveredIndex(index); // 設定 Hover 索引
						setIsPaused(true); // 停止自動轉動
					}}
					onMouseLeave={() => {
						setHoveredIndex(-1); // 移除 Hover 狀態
						setIsPaused(false); // 恢復自動轉動
					}}
					// onClick={() =>
					// 	router.push({
					// 		pathname: '/product',
					// 		query: {
					// 			productId: item.product_id,
					// 			productName: item.name,
					// 		},
					// 	})
					// }
				>
					{item?.random_photos.map((fileName, i) => (
						<img
							key={i}
							src={`/photos/products/${fileName}`}
							alt={item.name}
							className={styles['product-image']}
						/>
					))}
				</div>
			);
		});
	};

	// 手機版顯示的商品卡片
	const visibleImages = [
		...product.slice(currentMobileIndex, currentMobileIndex + imagesToShow),
		...product.slice(0, Math.max(0, currentMobileIndex + imagesToShow - product.length)),
	];

	return (
		<div className="container p-0 gap-3 d-flex flex-column gap-lg-5 mb-lg-5 w-100 h-auto">
			{product.length > 0 ? (
				<div
					className={`${styles['circular-slider']} d-flex flex-xl-row flex-column-reverse flex-column justify-content-between gap-5 position-relative flex-wrap`}
				>
					{/* 左右控制按鈕（桌機版） */}
					<div
						className={`${styles['TIL-prev']} d-none d-xl-block position-absolute`}
						onClick={() =>
							setActiveIndexInBatch(
								(prevIndex) => (prevIndex - 1 + imagesToShow) % imagesToShow
							)
						}
					>
						{'<<'}
					</div>
					<div
						className={`${styles['TIL-next']} d-none d-xl-block position-absolute`}
						onClick={() =>
							setActiveIndexInBatch((prevIndex) => (prevIndex + 1) % imagesToShow)
						}
					>
						{'>>'}
					</div>

					{/* 桌機版圓形展示 */}
					<div
						className={`${styles['TIL-carousel']} col-xl-7 d-none d-xl-block`}
						style={carouselTransformStyle}
					>
						{renderCircularItems()}
					</div>

					{/* 桌機版文字內容 */}
					<div
						className={`${styles['TIL-content']} col-12 col-xl-5 px-md-5 d-flex flex-column justify-content-start align-items-start p-xl-0 m-0 d-none d-xl-block`}
					>
						<h2 className="text-white">{displayedProduct?.name || '精選商品'}</h2>
						<p>{displayedProduct?.keywords || ''}</p>
						<p className="text-start">{displayedProduct?.description || ''}</p>
						<Link
							href={{
								pathname: '/product',
								query: {
									shopId: shop.id,
									shopName: shop.name,
									shopLogo: shop.logo_path,
								},
							}}
						>
							<button className={`${styles['btn-product']} btn btn-primary`}>
								來去逛逛
							</button>
						</Link>
					</div>

					{/* 手機版滑動文字內容 */}
					<div
						className={`${styles['TIL-content']} col-12 px-md-5 d-flex flex-column justify-content-start align-items-start p-xl-0 m-0 d-block d-xl-none`}
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					>
						<h2 className="text-white">{mobileDisplayedProduct?.name || '精選商品'}</h2>
						<p>{mobileDisplayedProduct?.keywords || ''}</p>
						<p className="text-start">{mobileDisplayedProduct?.description || ''}</p>
						<Link
							href={{
								pathname: '/product',
								query: {
									shopId: shop.id,
									shopName: shop.name,
									shopLogo: shop.logo_path,
								},
							}}
						>
							<button className={`${styles['btn-product']} btn btn-primary`}>
								來去逛逛
							</button>
						</Link>
					</div>

					{/* 手機版轉盤變卡片 */}
					<div
						className="col-12 d-flex flex-row d-block d-xl-none gap-2 justify-content-center"
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					>
						{visibleImages.map((product, index) => {
							// 判斷是否為當前顯示的卡片
							const isActive = index === 0; // visibleImages 的第一個元素即為當前顯示卡片

							return (
								<div
									key={product.name}
									className={`${styles['TIL-Phone-item']} ${
										isActive ? 'active' : ''
									}`}
								>
									{product.random_photos.map((fileName, i) => (
										<img
											key={i}
											src={`/photos/products/${fileName}`}
											alt={product.name}
											style={{
												objectFit: 'cover',
												width: '100%',
												height: '100%',
											}}
										/>
									))}
								</div>
							);
						})}
					</div>

					<h2 className="text-white text-center d-block d-xl-none">精選商品</h2>
				</div>
			) : (
				<div className="text-center text-secondary my-5">
					<h3>此店家商品上架中，敬請期待</h3>
				</div>
			)}
		</div>
	);
}
