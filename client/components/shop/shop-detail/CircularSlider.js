import React, { useState, useEffect, useRef } from 'react';
import styles from '@/components/shop/shop-detail/CircularSlider.module.scss';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CircularSlider() {
	const [product, setProduct] = useState([]);
	const router = useRouter();
	const { id } = router.query;
	const [activeIndex, setActiveIndex] = useState(0);

	const imagesToShow = 5;
	const autoSlideInterval = 9000;

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/shop/${id}/products`)
				.then((response) => {
					// 將隨機圖片字串轉換為陣列
					const productsWithPhotos = response.data.map((product) => ({
						...product,
						random_photos: product.random_photos
							? product.random_photos.split(',')
							: [],
					}));
					setProduct(productsWithPhotos);
					console.log(productsWithPhotos);
				})
				.catch((error) => {
					console.error('Error fetching products:', error);
				});
		}
	}, [id]);

	const nextSlide = () => setActiveIndex((prevIndex) => (prevIndex + 1) % product.length);
	const prevSlide = () =>
		setActiveIndex((prevIndex) => (prevIndex - 1 + product.length) % product.length);

	useEffect(() => {
		const interval = setInterval(() => {
			nextSlide();
		}, autoSlideInterval);

		return () => clearInterval(interval);
	}, [product.length]);

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

	const rotateAngle = product.length ? 360 / visibleImages.length : 0;

	const carouselTransformStyle = {
		transform: `rotate(${rotateAngle * -activeIndex}deg)`,
		transition: 'transform 0.6s ease-in-out',
	};

	const productContent = (index) => {
		setActiveIndex(index);
	};

	useEffect(() => {
		if (product.length > 0 && activeIndex >= product.length) {
			setActiveIndex(0);
		}
	}, [product, activeIndex]);

	return (
		<div className="container p-0 gap-3 d-flex flex-column gap-lg-5 mb-lg-5 w-100 h-auto">
			{product.length > 0 ? (
				<div
					className={`${styles['circular-slider']} d-flex flex-xl-row flex-column-reverse flex-column justify-content-between gap-5 position-relative flex-wrap`}
				>
					<div
						className={`${styles['TIL-prev']} d-none d-xl-block position-absolute`}
						onClick={nextSlide}
					>
						{'<<'}
					</div>
					<div
						className={`${styles['TIL-next']} d-none d-xl-block position-absolute`}
						onClick={prevSlide}
					>
						{'>>'}
					</div>
					<div
						className={`${styles['TIL-carousel']} col-xl-7 d-none d-xl-block`}
						style={carouselTransformStyle}
					>
						{visibleImages.map((product, index) => (
							<div
								key={product.product_id}
								className={styles['carousel-item']}
								style={{
									transform: `rotate(${
										rotateAngle * index
									}deg) translateY(-200px)`,
								}}
								onClick={() => productContent(index)}
							>
								{/* 隨機顯示五張圖片 */}
								{product.random_photos.map((fileName, imgIndex) => (
									<img
										key={imgIndex}
										src={`/photos/products/${fileName}`}
										alt={product.name}
										className={styles['product-image']}
									/>
								))}
							</div>
						))}
					</div>
					<div
						className={`${styles['TIL-content']} col-12 col-xl-5 px-md-5 d-flex flex-column justify-content-start align-items-start p-xl-0 m-0`}
					>
						<h2 className="text-white my-sm-5 text-center d-none d-xl-block">
							精選商品
						</h2>
						<h2 className="text-white">{product[activeIndex].name}</h2>
						<p>{product[activeIndex].keywords}</p>
						<p className="text-start">{product[activeIndex].description}</p>
						<Link href={'/product'}>
							<button
								className={`${styles['btn-product']} btn btn-primary m-auto m-sm-0`}
							>
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
						{visibleImages.map((product, index) => (
							<div
								key={product.product_id}
								className={`${styles['TIL-Phone-item']} m-0`}
								onClick={() => productContent(index)}
							>
								{product.random_photos.map((fileName, imgIndex) => (
									<img
										key={imgIndex}
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
				<p>Loading...</p>
			)}
		</div>
	);
}
