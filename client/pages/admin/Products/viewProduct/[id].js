import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminProducts/viewProducts.module.scss';
import elemStyles from '@/components/ElementList/ElementList.module.scss';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Button from '@/components/adminButton';
import { useUser } from '@/context/userContext';
import Swal from 'sweetalert2';

import { useRouter } from 'next/router';
import axios from 'axios';

export default function ViewProduct(props) {
	const router = useRouter();
	const { user, logout } = useUser();
	const { id } = router.query;
	const [product, setProduct] = useState({});
	const [productClass, setProductClass] = useState('');
	const [productShop, setProductShop] = useState('');
	const [productPhotos, setProductPhotos] = useState([]);
	const [bigPhoto, setBigPhoto] = useState('');
	const [fade, setFade] = useState(false);
	const [shopData, setShopData] = useState([]);

	useEffect(() => {
		console.log('Current id:', id);
		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/shopId`, {
				params: { userId: user.id },
			})
			.then((response) => {
				setShopData(response.data);
				console.log('res.data:', response.data);
			})
			.catch((error) => console.error('Error fetching product_class:', error));
		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/details?id=${id}`)
			.then((response) => {
				console.log('response.data.photos:', response.data.photos); // 檢查 API 返回的數據
				console.log(
					'Array.isArray(response.data.photos):',
					Array.isArray(response.data.photos)
				); // 確認是否為陣列
				const productData = response.data.product;
				const keywordsArray = productData.keywords ? productData.keywords.split(',') : [];
				setProduct({ ...productData, keywords: keywordsArray });
				setProductClass(response.data.product_class_name[0]?.class_name || '');
				const shopName = response.data.product_shop_data?.[0]?.name || '未知商店'; // 預設值避免報錯
				setProductShop(shopName);
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

	useEffect(() => {
		console.log('Updated productPhotos:', productPhotos);
	}, [productPhotos]);

	return (
		<>
			<AdminLayout>
				{user.role === 'admin' || shopData.id == product.shop_id ? (
					<>
						<div
							className={`d-flex gap-5`}
							style={{ overflowY: 'auto', height: '100%' }}
						>
							<div className={`${styles['photos']}`}>
								<div
									className={`${styles['bigPhoto']} ${
										fade ? styles.fadeOut : styles.fadeIn
									} mb-3`}
									style={{
										width: '500px',
										height: '500px',
										position: 'relative',
									}}
								>
									{bigPhoto && (
										<Image
											alt="it supposed to be a big photo :P"
											src={`/photos/products/${bigPhoto}`}
											// width={500}
											// height={500}
											fill
											style={{
												objectFit: 'cover', // cover, contain, none
											}}
										/>
									)}
								</div>

								<div className={`${styles['allPhotos']} d-flex gap-2 flex-wrap`}>
									{productPhotos.map((photo) => {
										return (
											<div
												className={`${styles['smallPhoto']} ZRT-click`}
												onClick={() => handlePhotoClick(photo)}
												style={{
													width: '93px',
													height: '93px',
													position: 'relative',
												}}
											>
												<Image
													alt=""
													src={`/photos/products/${photo}`}
													// width={93}
													// height={93}
													fill
													style={{
														objectFit: 'cover', // cover, contain, none
													}}
												/>
											</div>
										);
									})}
								</div>
							</div>
							<div
								className={`${styles['infos']} d-flex flex-column justify-content-start gap-5 h-100`}
							>
								<ul>
									<li className={`mt-2 mb-5`}>
										{/* <h3>商品名稱</h3> */}
										<h2
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{product.name}
										</h2>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>所屬商家</h3>
										<h4
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{productShop}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>分類</h3>
										<h4
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{productClass}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>價格</h3>
										<h4
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{product.price}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>折扣率</h3>
										<h4
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{product.discount}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>關鍵字</h3>
										<h4
											className={`${styles['content']} d-flex align-items-center mb-0 ms-1`}
										>
											{product && product.keywords
												? product.keywords.map((keyword) => ` #${keyword}`)
												: '無關鍵字'}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>庫存數量</h3>
										<h4
											className={`${styles['content']} d-flex  align-items-center mb-0 ms-1`}
										>
											{product.stocks}
										</h4>
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>上架狀態</h3>

										{product.available ? (
											<h4
												className={`${styles['content']} d-flex  align-items-center mb-0 ms-1 text-success`}
											>
												上架中
											</h4>
										) : (
											<h4
												className={`${styles['content']} d-flex  align-items-center mb-0 ms-1 text-danger`}
											>
												已下架
											</h4>
										)}
									</li>
									<li
										className={`${styles['object']} d-flex align-items-center my-4`}
									>
										<h3 className={`${styles['title']} mb-0`}>商品描述</h3>
										<h4
											className={`${styles['content']} d-flex align-items-center mb-0 ms-1`}
										>
											{product.description}
										</h4>
									</li>
								</ul>
								<div
									className={`${styles['buttons']} gap-2 d-flex justify-content-end`}
								>
									<Link href={`/admin/Products/editProduct/${product.id}`}>
										<Button
											text="編輯商品"
											onClick={() => console.log('點擊我按鈕被點擊')}
										/>
									</Link>
									<Link href={`/admin/Products`}>
										<Button
											text="回上一頁"
											onClick={() => console.log('點擊我按鈕被點擊')}
										/>
									</Link>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="d-flex justify-content-center align-items-center h-100">
							<div className="d-flex justify-content-center flex-column align-items-center">
								<h1>不可以偷看別間商店的商品喔！</h1>
								<Button text="回上一頁" onClick={() => router.back()} />
							</div>
						</div>
					</>
				)}
			</AdminLayout>
		</>
	);
}
