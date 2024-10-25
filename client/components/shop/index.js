import Image from 'next/image';
import styles from '@/components/shop/index.module.scss';
import FavoriteIcon from '@/components/Favorite';
import Link from 'next/link';

export default function Index({ shop, onToggleFav }) {
	const Size = 150;
	return (
		<div className={`${styles['TIL-shop-item']} `}>
			<button className={styles['TIL-FavortieBox']}>
				<FavoriteIcon isFavorite={shop.fav} onClick={() => onToggleFav(shop.id)} />
			</button>
			<Link href={'/shop/{id}'}>
				<div
					className={`${styles['TIL-content']} d-flex flex-column justify-content-center align-items-center p-lg-2 `}
				>
					<div className={`${styles['TIL-Image-box']}`}>
						<Image
							src={`/photos/shop_logo/${shop.logo}`}
							alt={shop.name}
							width={70}
							height={70}
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
