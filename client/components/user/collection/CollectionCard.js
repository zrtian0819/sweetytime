// components/user/collection/CollectionCard.js
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import styles from './collectionCard.module.scss';
import useCollection from '@/hooks/useCollection';

export default function CollectionCard({ type, data, onRemove }) {
	console.log('CollectionCard props:', { type, data});
	const { isLiked, toggleLike } = useCollection(type, data.id, onRemove);

	const handleToggleLike = async () => {
		await toggleLike();
		if (!isLiked) {
			onRemove(data.id);
		}
	};

	// 截斷文字的函數
	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	};

	const renderContent = () => {
		switch (type) {
			case 'shop':
				return (
					<>
						<div className={styles.card}>
							<div className={styles.imageWrapper}>
								<Image
									src={`/photos/shop_logo/${data.logo_path}`}
									alt={data.name}
									fill
									className={styles.image}
									sizes="(max-width: 768px) 100vw, 300px"
									priority
								/>
							</div>
							<div className={styles.content}>
								<div className={styles.titleWrapper}>
									<h3 className={styles.title}>{data.name}</h3>
									<button
										className={styles.likeButton}
										onClick={(e) => {
											e.preventDefault();
											handleToggleLike();
										}}
									>
										<FaHeart size={20} color={isLiked ? '#fe6f67' : 'grey'} />
									</button>
								</div>
								<p className={styles.description}>
									{truncateText(data.description, 30)}
								</p>
							</div>
						</div>
					</>
				);

			case 'product':
				return (
					<>
						<div className={styles.imageWrapper}>
							<Image
								src={`/photos/products/${data.img}`}
								alt={data.name}
								fill
								className={styles.image}
								sizes="(max-width: 768px) 100vw, 300px"
								priority
							/>
						</div>
						<div className={styles.proContent}>
							<div className={styles.titleWrapper}>
								<h3 className={styles.proTitle}>{data.name}</h3>
								<button
									className={styles.likeButton}
									onClick={(e) => {
										e.preventDefault();
										handleToggleLike();
									}}
								>
									<FaHeart size={30} color={isLiked ? '#fe6f67' : 'grey'} />
								</button>
							</div>
							<p className={styles.proPrice}>NT$ {data.price.toLocaleString()}</p>
						</div>
					</>
				);

			case 'lesson':
				return (
					<>
						<div className={styles.imageWrapper}>
							<Image
								src={`/photos/lesson/${data.img}`}
								alt={data.name}
								fill
								className={styles.image}
								sizes="(max-width: 768px) 100vw, 300px"
								priority
							/>
						</div>
						<div className={styles.content}>
							<div className={styles.titleWrapper}>
								<h3 className={styles.title}>{data.name}</h3>
								<button
									className={styles.likeButton}
									onClick={(e) => {
										e.preventDefault();
										handleToggleLike();
									}}
								>
									<FaHeart size={30} color={isLiked ? '#fe6f67' : 'grey'} />
								</button>
							</div>
							<p>{data.date}</p>
							<p className={styles.price}>NT$ {data.price}</p>
						</div>
					</>
				);
		}
	};

	return (
		<div className={styles.card} data-type={type}>
			<Link href={`/${type}/${data.item_id}`}>
				<div className={styles.imageContainer}>{renderContent()}</div>
			</Link>
		</div>
	);
}
