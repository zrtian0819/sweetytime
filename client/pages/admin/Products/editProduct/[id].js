import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminProducts/viewProducts.module.scss';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import Button from '@/components/adminButton';
import { Editor } from '@tinymce/tinymce-react';

import { useRouter } from 'next/router';
import axios from 'axios';

export default function ViewProduct(props) {
	const router = useRouter();
	const { id } = router.query;
	const [product, setProduct] = useState({});
	const [productClass, setProductClass] = useState('');
	const [productPhotos, setProductPhotos] = useState([]);
	const [productClasses, setProductClasses] = useState([]);
	const [bigPhoto, setBigPhoto] = useState('');
	const [fade, setFade] = useState(false); // 照片切換效果用

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/product/details?id=${id}`)
			.then((response) => {
				const productData = response.data.product;
				const keywordsArray = productData.keywords ? productData.keywords.split(',') : [];
				setProduct({ ...productData, keywords: keywordsArray });
				setProductClass(response.data.product_class[0]?.class_name || '');
				setProductPhotos(response.data.photos);
				setBigPhoto(response.data.photos[0]);
			})
			.catch((error) => console.error('Error fetching data:', error));

		axios
			.get('http://localhost:3005/api/product_class')
			.then((response) => setProductClasses(response.data))
			.catch((error) => console.error('Error fetching product_class:', error));
	}, [id]);

	const handlePhotoClick = (photo) => {
		setFade(true);

		setTimeout(() => {
			setBigPhoto(photo);
			setFade(false);
		}, 150);
	};

	// 要送出的值
	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState(0);
	const [selectedClass, setSelectedClass] = useState(0);
	const [productDiscount, setProductDiscount] = useState(0);
	const [productAvailable, setProductAvailable] = useState(0);
	useEffect(() => {
		setProductName(product.name);
		setProductPrice(product.price);
		setSelectedClass(product.class_id);
		setProductDiscount(product.discount);
		setProductAvailable(product.available);
	}, [product, productClass, productPhotos, productAvailable]);

	const editorRef = useRef(null); // tinyMCE 用

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
					<div
						className={`${styles['infos']} d-flex flex-column justify-content-between`}
					>
						<div className={`${styles['infos-editArea']}`}>
							<Box display="grid" gridTemplateColumns="1fr" gap={2}>
								<TextField
									label="商品名稱"
									name="name"
									value={productName}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setProductName(e.target.value)}
								/>
								<Box display="grid" gridTemplateColumns="3fr 3fr 3fr 2fr" gap={2}>
									<TextField
										label="價格"
										name="price"
										value={productPrice}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setProductPrice(e.target.value)}
									/>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">分類</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={
												selectedClass ||
												(productClasses.length > 0
													? productClasses[0].id
													: '')
											}
											label="分類"
											onChange={(e) => setSelectedClass(e.target.value)}
											size="small"
										>
											{productClasses.map((pClass, index) => (
												<MenuItem value={index + 1} key={index}>
													{pClass.class_name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField
										label="折扣"
										name="discount"
										value={productDiscount}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setProductName(e.target.value)}
									/>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">狀態</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={productAvailable}
											label="status"
											onChange={(e) => setProductAvailable(e.target.value)}
											size="small"
										>
											<MenuItem value={1}>上架中</MenuItem>
											<MenuItem value={0}>下架</MenuItem>
										</Select>
									</FormControl>
								</Box>
								{/* <Editor
									apiKey="ybm105m2grbfo4uvecjmsga7qgzsleh4xyd0rtzef4glhafj"
									onInit={(evt, editor) => (editorRef.current = editor)}
									initialValue={product.description}
									init={{
										width: '100%',
										menubar: false,
										plugins: [
											'advlist autolink lists link image charmap print preview anchor',
											'searchreplace visualblocks code fullscreen',
											'insertdatetime media table paste code help wordcount',
										],
										toolbar:
											'undo redo | formatselect | bold italic backcolor | \
										alignleft aligncenter alignright alignjustify | \
										bullist numlist outdent indent | removeformat | help',
									}}
								/> */}
							</Box>
						</div>
						<div className={`${styles['buttons']} gap-2 d-flex justify-content-end`}>
							<Button
								text="取消 回上一頁"
								onClick={() => console.log('點擊我按鈕被點擊')}
							/>

							<Button
								text="確定編輯 送出"
								onClick={() => console.log('點擊我按鈕被點擊')}
							/>
						</div>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
