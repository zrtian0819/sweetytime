import React, { useState, useEffect, useRef } from 'react';
import sty from './home-psideboard.module.scss';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import ProductCardSM from '@/components/product-card-sm';
import gsap from 'gsap';
import axios from 'axios';

const RandomGetProduct = async (num = 5, type = undefined) => {
	//隨機取得產品
	//num:想取得的筆數(預設為5); type:想取得的類型

	try {
		const pdRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/homePage/product`);
		const pdPhotoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/homePage/product-photo`);
		let products = pdRes.data;
		let pPhotoInfo = pdPhotoRes.data;

		//檢查是否發生錯誤
		if (products.status == 'error') {
			throw new Error(products.message);
		}

		let chosenProducts = [];
		if (type) {
			products = products.filter((pd) => pd.product_class_id == type);
		}

		for (let i = 0; i < num; i++) {
			const pdIndex = Math.floor(Math.random() * products.length);
			const ThisPPhotoAry = pPhotoInfo.find((pd) => pd.product_id == products[pdIndex].id);
			// console.log('ThisPPhotoAry:', ThisPPhotoAry);
			const newProduct = { ...products[pdIndex], ...ThisPPhotoAry };
			// console.log('newProduct:', newProduct);
			chosenProducts.push(newProduct);
			products.splice(pdIndex, 1);
		}
		// console.log(chosenProducts);
		return chosenProducts;
	} catch (err) {
		console.log('❌存取得產品失敗:', err.message);
		return err.message;
	}
};

export default function HomeSideBoard({
	type = '元件請傳入type參數',
	typeNum,
	src = '元件請傳入圖片',
	sideboard = false,
	setSideBoard,
}) {
	const ZRTFrame = useRef(null);
	const ZRTType = useRef(null);
	const ZRTText = useRef(null);
	const ZRTProductArea = useRef(null);
	const animationRef = useRef(null);
	const [picAry, setPicAry] = useState([]);

	useEffect(() => {
		//產生圖片物件
		(async () => {
			let getPd = await RandomGetProduct(10, typeNum);
			// console.log(getPd);
			if (Array.isArray(getPd) && getPd.length > 0) {
				setPicAry(getPd);
			}
		})();
	}, [typeNum]);

	useEffect(() => {
		// 避免在 sideboard 為 false 時執行
		if (!sideboard) return;
	
		// 建立一個狀態追蹤變數
		let isAnimating = true;
	
		// 清理所有現有動畫
		gsap.killTweensOf([
			ZRTFrame.current,
			ZRTType.current,
			ZRTText.current,
			ZRTProductArea.current
		]);
	
		// 重置所有元素到初始狀態
		gsap.set([
			ZRTFrame.current,
			ZRTType.current,
			ZRTText.current,
			ZRTProductArea.current
		], {
			clearProps: "all"  // 清除所有屬性
		});
	
		// 建立新動畫
		const typeTL = gsap.timeline({
			onComplete: () => {
				if (isAnimating) {
					animationRef.current = null;
				}
			},
			onInterrupt: () => {
				console.log('Animation interrupted');
			},
			// 加入這個選項來防止動畫重疊
			paused: true
		});
	
		// 保存動畫引用
		animationRef.current = typeTL;
	
		// 動畫序列
		typeTL
			.from(ZRTFrame.current, {
				y: -30,
				opacity: 0,
				duration: 0.7,
				ease: 'power3.out',
			})
			.from(
				ZRTType.current,
				{
					y: -30,
					opacity: 0,
					duration: 0.7,
					ease: 'power3.out',
				},
				'-=0.1'
			)
			.from(
				ZRTText.current,
				{
					y: -30,
					opacity: 0,
					duration: 0.7,
					ease: 'power3.out',
				},
				'-=0.1'
			)
			.from(
				ZRTProductArea.current,
				{
					y: -30,
					opacity: 0,
					duration: 0.7,
					ease: 'power3.out',
				},
				'-=0.1'
			);
	
		// 啟動動畫
		requestAnimationFrame(() => {
			if (isAnimating) {
				typeTL.play();
			}
		});
	
		// Cleanup function
		return () => {
			isAnimating = false;
			if (animationRef.current) {
				animationRef.current.kill();
				animationRef.current = null;
			}
			// 確保清理所有相關元素的動畫
			gsap.killTweensOf([
				ZRTFrame.current,
				ZRTType.current,
				ZRTText.current,
				ZRTProductArea.current
			]);
		};
	}, [sideboard, type]);

	return (
		<>
			<div className={`${sty['board']} ${sideboard ? '' : 'board-close'}`}>
				<div className={`${sty['frameArea']}`}>
					<div className={`${sty['frame']}`} ref={ZRTFrame}>
						<Image src={src} width={0} height={0} alt={src} />
					</div>
					<div className={`ZRT-type ${sty['type']} rounded-pill`} ref={ZRTType}>
						{type}
					</div>
				</div>
				<div className={`ZRT-textArea ${sty['textArea']}`} ref={ZRTText}>
					<div className={`${sty['text']}`}>精選商品</div>

					<div className={`${sty['text']}`}>
						Le salé nous nourrit, le sucré nous réjouit
					</div>
				</div>
				<div className={`ZRT-productArea ${sty['ProductArea']}`} ref={ZRTProductArea}>
					{/* 此處的資料到時候要用資料庫引入 */}
					{/* <ProductCardSM src="photos/products/巴斯克伯爵茶蛋糕_03.jpg" width={160} />
					<ProductCardSM src="photos/products/蘭姆無花果磅蛋糕_01.jpg" width={160} /> */}

					{picAry && picAry.length > 0
						? picAry.map((pd) => {
								return (
									pd.file_name && (
										<ProductCardSM
											key={pd.product_id}
											src={`photos/products/${pd.file_name}`}
											width={160}
											link={`product/${pd.product_id}`}
										/>
									)
								);
						  })
						: ''}
				</div>
				<div
					className={`${sty['backButton']} ZRT-click`}
					onClick={() => {
						setSideBoard(!sideboard);
					}}
				>
					<FaArrowRight />
				</div>
			</div>

			<style jsx>
				{`
					.board-close {
						translate: 50vw;
						transition: 0.3s;
						opacity: 0;
					}

					@media (max-width: 992px) {
						.board-close {
							translate: 80vw;
						}
					}

					@media (max-width: 768px) {
						.board-close {
							translate: 100vw;
						}
					}
				`}
			</style>
		</>
	);
}
