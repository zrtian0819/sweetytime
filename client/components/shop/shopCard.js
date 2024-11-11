// ShopCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import Styles from '@/components/shop/shopCard.module.scss';

export default function ShopCard({
	id = 1,
	name = '稍甜 SYRUP LESS',
	img = '28_cake_nuts.jpg',
	originalLiked,
	handleToggleLike,
}) {
	const imageSize = 70;

	return (
		<div className={Styles['TIL-shopCard']}>
			<button className={`${Styles['TIL-FavoriteBox']} btn`} onClick={handleToggleLike}>
				<FaHeart size={25} color={originalLiked ? '#fe6f67' : 'grey'} />
			</button>

			<Link href={`/shop/${id}`} className={`${Styles['TIL-content']} p-lg-2`}>
				<div className={Styles['TIL-Image-box']}>
					<Image
						src={`/photos/shop_logo/${img}`}
						alt={name}
						width={imageSize}
						height={imageSize}
						className={Styles['TIL-Image']}
					/>
				</div>
				<h4 className="text-black my-lg-2 text-center">{name}</h4>
			</Link>
		</div>
	);
}
