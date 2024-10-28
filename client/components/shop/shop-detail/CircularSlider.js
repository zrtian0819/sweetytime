import React, { useState, useEffect } from 'react';
import styles from '@/components/shop/shop-detail/CircularSlider.module.scss';

export default function CircularSlider() {
	const images = [
		{
			src: '/photos/products/15_cheesemate_choco_berry.jpg',
			title: 'PRODUCT NAME 1',
			keyword: 'text',
			description: 'Description for product 1'.repeat(10), // Example description
		},
		{
			src: '/photos/products/15_chizUp_passion.jpg',
			title: 'PRODUCT NAME 2',
			keyword: 'text',
			description: 'Description for product 2',
		},
		{
			src: '/photos/products/15_cupostory_tart_cheese.jpg',
			title: 'PRODUCT NAME 3',
			keyword: 'text',
			description: 'Description for product 3',
		},
		{
			src: '/photos/products/15_laydown_cheese_oreo.jpg',
			title: 'PRODUCT NAME 4',
			keyword: 'text',
			description: 'Description for product 4',
		},
		{
			src: '/photos/products/15_souvenir_cake_matcha.jpg',
			title: 'PRODUCT NAME 5',
			keyword: 'text',
			description: 'Description for product 5',
		},
	];

	const [activeIndex, setActiveIndex] = useState(0);
	const rotateAngle = 360 / images.length;
	const imagesToShow = 4;
	const autoSlideInterval = 3000;

	// 設定自動切換
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, autoSlideInterval);

		return () => clearInterval(interval);
	}, [images.length]);

	// 觸控事件處理
	let touchStartX = 0;
	let touchEndX = 0;

	const handleTouchStart = (e) => {
		touchStartX = e.changedTouches[0].clientX;
	};

	const handleTouchEnd = (e) => {
		touchEndX = e.changedTouches[0].clientX;
		if (touchStartX - touchEndX > 50) {
			// 左滑
			setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
		} else if (touchEndX - touchStartX > 50) {
			// 右滑
			setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
		}
	};

	const visibleImages = images
		.slice(activeIndex, activeIndex + imagesToShow)
		.concat(images.slice(0, Math.max(0, activeIndex + imagesToShow - images.length)));

	//arrow
	const nextSlide = () => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
	};
	const prevSlide = () => {
		setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
	};

	const carouselTransformStyle = {
		transform: `rotate(${rotateAngle * activeIndex}deg)`,
	};

	return (
		<div
			className={`${styles['circular-slider']} container p-md-0 gap-3 d-flex flex-column gap-lg-5 mb-lg-5`}
		>
			<h2 className="p-xl-5 p-md-3 px-3 text-white">精選商品</h2>
			<div className="d-flex flex-xl-row flex-column justify-content-between  gap-5 gap-xl-0 position-relative flex-wrap">
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
				<div
					className="col-12 d-flex flex-row d-block d-xl-none p-0"
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
				>
					{visibleImages.map((image, index) => (
						<div key={index} className={styles['TIL-Phone-item']}>
							<img
								src={image.src}
								alt={image.title}
								className={styles['TIL-phoneImage']}
							/>
						</div>
					))}
				</div>
				<div
					className={`${styles['TIL-carousel']} col-xl-7 d-none d-xl-block`}
					style={carouselTransformStyle}
				>
					{images.map((image, index) => (
						<div
							key={index}
							className={styles['carousel-item']}
							style={{
								transform: `rotate(${rotateAngle * index}deg) translateY(-250px)`,
							}}
						>
							<img src={image.src} alt={image.title} />
						</div>
					))}
				</div>
				<div
					className={`${styles['TIL-content']} col-12 col-xl-5 px-md-5 d-flex flex-column justify-content-start align-items-start p-xl-0 m-0`}
				>
					<h1 className="text-white">{images[activeIndex].title}</h1>
					<p>{images[activeIndex].keyword}</p>
					<p className="text-start">{images[activeIndex].description}</p>
					<button className={`${styles['btn-product']} btn btn-primary`}>來去逛逛</button>
				</div>
			</div>
		</div>
	);
}