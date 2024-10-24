import Image from 'next/image';
import styles from '@/components/shop/index.module.scss';
import FavoriteIcon from '@/components/Favorite';
import Link from 'next/link';

export default function Index({ shop, onToggleFav }) {
	const Size = 150;
	return (
		<Link href={'/shop/{id}'}>
			<div
				className={`${styles['TIL-shop-item']} d-flex flex-column justify-content-center align-items-center`}
			>
				<div className={styles['TIL-Image-box']}>
					<Image
						src={`/photos/shop_logo/${shop.logo}`}
						alt={shop.name}
						width={Size}
						height={Size}
						className={styles['TIL-Image']}
						priority
					/>
				</div>
				<h4 style={{color:'black'}}>{shop.name}</h4>
				<div className={styles['TIL-FavortieBox']}>
					<FavoriteIcon isFavorite={shop.fav} onClick={() => onToggleFav(shop.id)} />
				</div>
			</div>
		</Link>
	);
}
