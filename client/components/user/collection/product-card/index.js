import React, { useState, useEffect } from 'react';
import styles from './product-card.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  console.log(product);
	return (
		<>
			<div className={styles['ProductCard']}>
				<Link href={`/shop/${product.id}`} className={styles['TIL-content']}>
					<div className={styles['imgBox']}>
						<div className={styles['heart']}>❤️</div>
						<Image
							src={`/photos/products/${product.img}`}
							alt={product.name}
							width={120}
							height={120}
							onError={(e) => {
								console.error('Image loading error:', e);
							}}
						/>
					</div>
				</Link>
				<div className={styles['textBox']}>
					<div className="detail">
						<div className={styles['productName']}>{product.name}</div>
						<div className="productPrice">
							$
							{product.discount === 1 ? (
								<span className={styles['price']}>{product.price}</span>
							) : (
								<span>
									<del>{product.price}</del>{' '}
									<span className={styles['price']}>
										{product.price * product.discount}
									</span>
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
