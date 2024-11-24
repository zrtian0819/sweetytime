import React, { useState, useEffect, useRef } from 'react';
import styles from '@/components/shop/shop-detail/CircularSlider.module.scss';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CircularSlider({ shop }) {
	const [product, setProduct] = useState([]);
	const [hoveredIndex, setHoveredIndex] = useState(-1); // Hover 的商品索引
	const router = useRouter();
	const { id } = router.query;

	const [currentBatchIndex, setCurrentBatchIndex] = useState(0); // 當前顯示的批次索引
	const [activeIndexInBatch, setActiveIndexInBatch] = useState(0); // 批次內當前顯示的商品索引
	const [isPaused, setIsPaused] = useState(false); // 是否暫停自動轉動

	const imagesToShow = 5; // 每批顯示的商品數量
	const autoSlideInterval = 3000;
	const autoSlideRef = useRef(null); // 管理自動轉動
	const [activeIndex, setActiveIndex] = useState(0);

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

	// 自動轉動邏輯
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

	// 手動轉動
	const nextSlide = () => {
		setActiveIndexInBatch((prevIndex) => {
			if (prevIndex + 1 >= imagesToShow) {
				// 切換到下一批
				setCurrentBatchIndex((prevBatchIndex) => {
					return (prevBatchIndex + 1) % Math.ceil(product.length / imagesToShow);
				});
				return 0;
			}
			return prevIndex + 1;
		});
	};

	const prevSlide = () => {
		setActiveIndexInBatch((prevIndex) => {
			if (prevIndex === 0) {
				// 如果當前索引為 0，回到上一批
				setCurrentBatchIndex((prevBatchIndex) => {
					const totalBatches = Math.ceil(product.length / imagesToShow);
					return (prevBatchIndex - 1 + totalBatches) % totalBatches;
				});
				return imagesToShow - 1; // 上一批的最後一個商品
			}
			return prevIndex - 1;
		});
	};

	// 圓形排列邏輯
	const rotateAngle = 360 / imagesToShow; // 每個商品的旋轉角度
	const carouselTransformStyle = {
		transform: `rotate(${rotateAngle * -activeIndexInBatch}deg)`,
		transition: 'transform 0.6s ease-in-out',
	};

	// 渲染圓形商品
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
					onClick={() =>
						router.push({
							pathname: '/product',
							query: {
								productId: item.product_id,
								productName: item.name,
							},
						})
					} // 點擊跳轉
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

	// 動態顯示 Hover 或預設內容
	const displayedProduct =
		hoveredIndex >= 0 ? currentBatch[hoveredIndex] : currentBatch[activeIndexInBatch];

	//手機版
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);

	const handleTouchStart = (e) => {
		touchStartX.current = e.changedTouches[0].clientX;
	};

	const handleTouchEnd = (e) => {
		touchEndX.current = e.changedTouches[0].clientX;
		if (touchStartX.current - touchEndX.current > 50) {
			nextSlide();
		} else if (touchEndX.current - touchStartX.current > 50) {
			prevSlide();
		}
	};

	//轉盤限制
	const visibleImages = [
		...product.slice(activeIndex, activeIndex + imagesToShow),
		...product.slice(0, Math.max(0, activeIndex + imagesToShow - product.length)),
	];

	return (
		<div className="container p-0 gap-3 d-flex flex-column gap-lg-5 mb-lg-5 w-100 h-auto">
			{currentBatch.length > 0 ? (
				<div
					className={`${styles['circular-slider']} d-flex flex-xl-row flex-column-reverse flex-column justify-content-between gap-5 position-relative flex-wrap`}
				>
					{/* 左右控制按鈕 */}
					<div
						className={`${styles['TIL-prev']} d-none d-xl-block position-absolute`}
						onClick={prevSlide}
					>
						{'<<'}
					</div>
					<div
						className={`${styles['TIL-next']} d-none d-xl-block position-absolute`}
						onClick={nextSlide}
					>
						{'>>'}
					</div>

					{/* 圓形商品展示 */}
					<div
						className={`${styles['TIL-carousel']} col-xl-7 d-none d-xl-block`}
						style={carouselTransformStyle}
					>
						{renderCircularItems()}
					</div>

					{/* 右側文字內容 */}
					<div
						className={`${styles['TIL-content']} col-12 col-xl-5 px-md-5 d-flex flex-column justify-content-start align-items-start p-xl-0 m-0`}
					>
						{product.length > 0 ? (
							<>
								<h2 className="text-whie my-sm-5 text-center d-none d-xl-block">
									精選商品
								</h2>
								<h2 className="text-white">{displayedProduct?.name}</h2>
								<p>{displayedProduct?.keywords}</p>
								<p className="text-start">{displayedProduct?.description}</p>
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
									<button
										className={`${styles['btn-product']} btn btn-primary m-auto m-sm-0`}
									>
										來去逛逛
									</button>
								</Link>
							</>
						) : (
							<p className="text-white">請重新整理頁面，商品載入中...</p>
						)}
					</div>
					{/* 手機版轉盤變卡片 */}
					<div
						className="col-12 d-flex flex-row d-block d-xl-none gap-2 justify-content-center"
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
					>
						{visibleImages.map((product, index) => (
							<div
								key={product.name}
								className={`${styles['TIL-Phone-item']} m-0`}
								onClick={() => productContent(index)}
							>
								{product.random_photos.map((fileName, index) => (
									<img
										key={index}
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
						))}
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
