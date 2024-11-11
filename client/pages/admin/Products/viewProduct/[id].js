import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminProducts/viewProducts.module.scss';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

import { useRouter } from 'next/router';
import axios from 'axios';

export default function ViewProduct(props) {
	const router = useRouter();
	const { id } = router.query;
	const [product, setProduct] = useState({});
	const [productClass, setProductClass] = useState('');
	const [productShop, setProductShop] = useState('');
	const [productPhotos, setProductPhotos] = useState([]);
	const [bigPhoto, setBigPhoto] = useState('');
	const [fade, setFade] = useState(false);

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/product/details?id=${id}`)
			.then((response) => {
				const productData = response.data.product;
				const keywordsArray = productData.keywords ? productData.keywords.split(',') : [];
				setProduct({ ...productData, keywords: keywordsArray });
				setProductClass(response.data.product_class[0]?.class_name || '');
				setProductShop(response.data.product_shop_name[0].name);
				setProductPhotos(response.data.photos);
				setBigPhoto(response.data.photos[0]);
			})
			.catch((error) => console.error('Error fetching data:', error));
	}, [id]);

	const handlePhotoClick = (photo) => {
		setFade(true);

		setTimeout(() => {
			setBigPhoto(photo);
			setFade(false);
		}, 150);
	};

	return (
		<>
			<AdminLayout>
				<div className={`d-flex gap-5`}>
					<div className={`${styles['photos']}`}>
						<div
							className={`${styles['bigPhoto']} ${
								fade ? styles.fadeOut : styles.fadeIn
							} mb-3`}
						>
							{bigPhoto && (
								<Image
									src={`/photos/products/${bigPhoto}`}
									width={500}
									height={500}
								/>
							)}
						</div>

						<div className={`${styles['allPhotos']} d-flex gap-2`}>
							{productPhotos.map((photo) => {
								return (
									<div
										className={`${styles['smallPhoto']} ZRT-click`}
										onClick={() => handlePhotoClick(photo)}
									>
										<Image
											src={`/photos/products/${photo}`}
											width={100}
											height={100}
										/>
									</div>
								);
							})}
						</div>
					</div>
					<div className={`${styles['infos']}`}>
						<h1>{product.name}</h1>
						<h3>所屬商家: {productShop}</h3>
						<h3>分類: {productClass}</h3>
						<h3>價格: {product.price}</h3>
						<h3>
							關鍵字:
							{product && product.keywords
								? product.keywords.map((keyword) => ` #${keyword}`)
								: '無關鍵字'}
						</h3>
						<h3>庫存數量: {product.stocks}</h3>
						<h3>商品描述: {product.description}</h3>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
