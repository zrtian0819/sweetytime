import React from 'react';
import Image from 'next/image';
import styles from '@/components/shop/shopCard.module.scss';
import FavoriteIcon from '@/components/Favorite';
import Link from 'next/link';

export default function ShopCard({ shop, onToggleFav, initStateFav }) {
	const Size = 70;

	return (
		<div className={`${styles['TIL-shop-item']}`}>
			<Link href={`/shop/${shop.shop_id}`}>
				<button className={styles['TIL-FavoriteBox']}>
					<FavoriteIcon
						isFavorite={initStateFav ?? false}
						onClick={() => onToggleFav(shop.shop_id)}
					/>
				</button>
				<div
					className={`${styles['TIL-content']} d-flex flex-column justify-content-center align-items-center p-lg-2`}
				>
					<div className={`${styles['TIL-Image-box']}`}>
						<Image
							src={`/photos/shop_logo/${shop.logo}`}
							alt={shop.name}
							width={Size}
							height={Size}
							className={styles['TIL-Image']}
							priority
						/>
					</div>
					<h4 className="text-black my-lg-2 text-center">{shop.name}</h4>
				</div>
			</Link>
		</div>
	);
}
