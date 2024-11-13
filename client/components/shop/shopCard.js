// ShopCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import Styles from '@/components/shop/shopCard.module.scss';

export default function ShopCard({ shop, originalLiked, handleToggleLike }) {
	return (
		<div className={Styles['TIL-shopCard']}>
			<button className={`${Styles['TIL-FavoriteBox']} btn`} onClick={handleToggleLike}>
				<FaHeart size={25} color={originalLiked ? '#fe6f67' : 'grey'} />
			</button>

			<Link href={`/shop/${shop.id}`} className={`${Styles['TIL-content']} p-lg-2`}>
				<div className={Styles['TIL-Image-box']}>
					<Image
						src={`/photos/shop_logo/${shop.logo_path}`}
						alt={shop.name}
						width={70}
						height={70}
						className={Styles['TIL-Image']}
					/>
				</div>
				<h4 className="text-black my-lg-2 text-center">{shop.name}</h4>
			</Link>
		</div>
	);
}
