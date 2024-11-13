import React, { useState, useEffect } from 'react';
import Styles from './productCard.module.scss';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { useCart } from '@/context/cartContext';

export default function ProductCard({ productID, userLike, price, onSalePrice, photo, name }) {
	// 加入收藏
	const [isLike, setIsLike] = useState(userLike); // 之後改成讀會員的喜歡資料
	const handleLike = (event) => {
		event.stopPropagation();
		setIsLike(!isLike);
	};

	// 加入購物車
	const { cart, setCart, handleCart } = useCart();
	const handleAddToCart = (event) => {
		event.preventDefault();
		handleCart(cart, productID, 'increase');
		event.stopPropagation();
	};

	// 顯示特價
	const [isOnSale, setIsOnSale] = useState(onSalePrice !== undefined);
	useEffect(() => {
		setIsOnSale(onSalePrice !== undefined);
	}, [onSalePrice]);

	return (
		<>
			<div className={`${Styles['product-card']} card m-3 mt-0`}>
				<div className={`${Styles['product-card-top']}`}>
					<Image
						src={`/photos/products/${photo}`}
						fill
						className={Styles['product-card-img']}
						alt={`這個人很懶，還沒上傳照片(商品id：${productID})`}
					/>
				</div>
				<div className={`${Styles['product-card-body']} card-body`}>
					<div className={Styles['card-body-upper']}>
						<h3 className={`m-0 ${Styles['product-Name']}`}>
							{name}
							{/* {productID} */}
						</h3>
						<FaHeart
							className={Styles['product-card-icon']}
							size={25}
							color={isLike ? '#fe6f67' : 'grey'}
							onClick={handleLike}
						/>
					</div>
					<div className={`${Styles['product-card-body-lower']}`}>
						<div className={`${Styles['product-card-price']} d-flex`}>
							<h4 className={`${Styles['fontSize-18']} m-0 fw-bolder`}>
								<span
									style={{ textDecoration: isOnSale ? 'line-through' : 'none' }}
								>
									${price}
								</span>
							</h4>
							{onSalePrice !== undefined && (
								<h4 className={`${Styles['fontSize-18']} m-0 text-danger ms-1`}>
									{onSalePrice}
								</h4>
							)}
						</div>
						<button className="btn ZRT-center" onClick={handleAddToCart}>
							<FaCartShopping className="me-1" />
							加入購物車
						</button>
					</div>
				</div>
			</div>

			{/* -----------------手機版--------------------- */}
			<div className={`${Styles['product-card-mobile']} card mt-0 mb-3`}>
				<div className={`${Styles['product-card-top']}`}>
					<Image
						src={`/photos/products/${photo}`}
						fill
						className={Styles['product-card-img']}
					/>
					<FaHeart
						className={Styles['product-card-icon']}
						size={25}
						color={isLike ? '#fe6f67' : 'grey'}
						onClick={handleLike}
					/>
				</div>
				<div className={`${Styles['product-card-body']} card-body align-items-center`}>
					<h3 className={`m-0 ${Styles['product-Name']}`}>{name}</h3>

					<div
						className={`${Styles['product-card-price']} my-2 d-flex justify-content-center`}
					>
						<h4 className={`${Styles['fontSize-18']} m-0 fw-bolder`}>
							<span
								style={{
									textDecoration: isOnSale ? 'line-through' : 'none',
									color: isOnSale ? 'grey' : '#333333',
								}}
							>
								${price}
							</span>
						</h4>
						{onSalePrice !== undefined && (
							<h4
								className={`${Styles['fontSize-18']} m-0 ms-1`}
								style={{ color: '#EF5151' }}
							>
								{onSalePrice}
							</h4>
						)}
					</div>
					<button
						onClick={handleAddToCart}
						className={`${Styles['addToCart']} btn ZRT-center w-100`}
					>
						<FaCartShopping className={`${Styles['card-button-mobile']} me-1`} />
						加入購物車
					</button>
				</div>
			</div>
		</>
	);
}
