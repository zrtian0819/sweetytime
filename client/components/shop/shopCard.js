// ShopCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import Styles from '@/components/shop/shopCard.module.scss';

export default function ShopCard({ shop, isLiked, handleToggleLike }) {
	const imageSize = 70;

	return (
		<div className={Styles.shopItem}>
			<button className={`${Styles.favoriteBox} btn`} onClick={handleToggleLike}>
				<FaHeart size={25} color={isLiked ? '#fe6f67' : 'grey'} />
			</button>

			<Link
				href={`/shop/${shop.shop_id}`}
				className={`${Styles.content} d-flex flex-column justify-content-center align-items-center p-lg-2`}
			>
				<div className={Styles.imageBox}>
					<Image
						src={`/photos/shop_logo/${shop.logo}`}
						alt={shop.name}
						width={imageSize}
						height={imageSize}
						className={Styles.image}
						priority
					/>
				</div>
				<h4 className="text-black my-lg-2 text-center">{shop.name}</h4>
			</Link>
		</div>
	);
}
