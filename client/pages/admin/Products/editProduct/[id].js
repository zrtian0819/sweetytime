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

export default function EditProduct(props) {
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
				console.log('response.data:', response.data);
				const productData = response.data.product;
				const keywordsArray = productData.keywords ? productData.keywords.split(',') : [];
				setProduct({ ...productData, keywords: keywordsArray });
				setProductClass(response.data.product_class_name[0]?.class_name || '');
				// setProductPhotos(response.data.photos);
				const existingPhotos = response.data.photos.map((photo) => ({
					url: `/photos/products/${photo}`,
					keep: true,
					isNew: false,
					fileName: photo,
				}));
				setProductPhotos(existingPhotos);
				setBigPhoto(`/photos/products/${response.data.photos[0]}`);
			})
			.catch((error) => console.error('Error fetching data:', error));

		axios
			.get('http://localhost:3005/api/product_class')
			.then((response) => setProductClasses(response.data))
			.catch((error) => console.error('Error fetching product_class:', error));
	}, [id]);

	// =============================================處理商品照片=====================================

	// 切換大圖
	const handlePhotoClick = (photo) => {
		setFade(true);

		setTimeout(() => {
			setBigPhoto(photo);
			setFade(false);
		}, 150);
	};

	// 觸發input file元素的點擊事件
	const triggerFileInput = () => {
		document.querySelector('#fileInput').click();
	};

	// 上傳照片
	const handlePhotoUpload = (event) => {
		const files = Array.from(event.target.files);
		const newPhotos = files.map((file) => {
			const extension = file.name.split('.').pop(); // 取得副檔名
			// const uniqueFileName = `${file.name.split('.')[0]}_${Date.now()}.${extension}`;
			const uniqueFileName = `${encodeURIComponent(
				file.name.split('.')[0]
			)}_${Date.now()}.${extension}`;

			return {
				file,
				url: URL.createObjectURL(file), // 用於預覽
				keep: true,
				isNew: true,
				uniqueFileName, // 存儲新的唯一檔名
			};
		});
		setProductPhotos((prev) => [...prev, ...newPhotos]);
	};

	// 勾選照片是否要保留
	const handleChangeKeep = (index) => {
		setProductPhotos((prevPhotos) =>
			prevPhotos.map((photo, i) => (i === index ? { ...photo, keep: !photo.keep } : photo))
		);
	};

	// ========================================處理商品資訊=========================================

	// 用來儲存商品資訊
	const [newProductData, setNewProductData] = useState({
		name: '',
		price: 0,
		class: 0,
		discount: 0,
		available: 0,
	});

	// 以後端回傳的資料更新newProductData的值
	useEffect(() => {
		setNewProductData({
			id: product.id || 0,
			name: product.name || '',
			price: product.price || 0,
			class: product.product_class_id || 0,
			discount: product.discount || 0,
			available: product.available || 0,
		});
		editorContentRef.current = product.description || ''; // 同步更新 ref 的值
	}, [product, productClass, productPhotos]);
	const editorContentRef = useRef(''); // 初始化 ref

	// 修改商品資訊的函數
	const handleInputChange = (field, value) => {
		setNewProductData((prevData) => ({
			...prevData,
			[field]: value,
		}));
	};

	const editorRef = useRef(null); // tinyMCE 用
	console.log('productPhotos:', productPhotos);

	console.log('newProductData:', newProductData);

	// ========================================確定送出=============================================
	const handleSave = async () => {
		// ----------------------------------處理照片-----------------------------------
		const formData = new FormData();
		// 將商品 id 添加到 FormData 中
		formData.append('productId', id);

		// 篩選出需要上傳的新照片
		const photosToUpload = productPhotos.filter((photo) => photo.isNew && photo.keep);
		photosToUpload.forEach((photo) => {
			formData.append('photos', photo.file, photo.uniqueFileName);
		});

		// 篩選出需要刪除的舊照片
		const photosToDelete = productPhotos
			.filter((photo) => !photo.isNew && !photo.keep)
			.map((photo) => ({ productId: id, fileName: photo.fileName }));

		console.log('photosToUpload:', photosToUpload);
		// console.log('formData:', formData);
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value); // 解析並打印出 formData
		}
		console.log('photosToDelete:', photosToDelete);

		try {
			// 上傳新照片
			if (photosToUpload.length > 0) {
				await axios.post('http://localhost:3005/api/product/upload_photos', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			}

			// 刪除舊照片
			if (photosToDelete.length > 0) {
				await axios.post('http://localhost:3005/api/product/delete_photos', {
					photos: photosToDelete,
				});
			}

			console.log('保存完成');
		} catch (error) {
			console.error('保存時發生錯誤:', error);
		}

		// ---------------------------------處理商品資訊--------------------------------
		try {
			const response = await axios.post('http://localhost:3005/api/product/update', {
				...newProductData,
				description: editorContentRef.current, // 送出編輯器的最終內容
			});
			console.log('保存成功:', response.data);
		} catch (error) {
			console.error('保存失敗:', error);
		}
	};

	return (
		<>
			<AdminLayout>
				<div className={`d-flex gap-5`}>
					{/* ============================商品圖片區============================ */}
					<div className={`${styles['photos']}`}>
						<div
							className={`${styles['bigPhoto']} ${
								fade ? styles.fadeOut : styles.fadeIn
							} mb-3`}
						>
							{bigPhoto && <Image alt="" src={bigPhoto} width={500} height={500} />}
						</div>

						<div className={`${styles['allPhotos']} d-flex gap-2 flex-wrap`}>
							{productPhotos.map((photo, index) => (
								<div
									className={`${styles['smallPhoto']} ZRT-click`}
									onClick={() => handlePhotoClick(photo.url)}
									key={index}
								>
									<Image alt="" src={photo.url} width={93} height={93} />
									<div
										className={`${styles['changeKeepBtn']}`}
										onClick={(event) => {
											event.stopPropagation();
											handleChangeKeep(index);
										}}
									>
										{photo.keep ? '✅' : '❌'}
									</div>
								</div>
							))}
						</div>
						<input
							type="file"
							id="fileInput"
							style={{ display: 'none' }}
							multiple
							onChange={handlePhotoUpload}
						/>
						{/* 自訂上傳按鈕 */}
						<div style={{ marginTop: 15 }}>
							<Button text="增加新圖片" onClick={triggerFileInput} />
						</div>
					</div>

					{/* ============================商品資訊區============================ */}
					<div
						className={`${styles['infos']} d-flex flex-column justify-content-between`}
					>
						<div className={`${styles['infos-editArea']}`}>
							<Box display="grid" gridTemplateColumns="1fr" gap={2}>
								<TextField
									label="商品名稱"
									name="name"
									value={newProductData.name}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => handleInputChange('name', e.target.value)}
								/>
								<Box display="grid" gridTemplateColumns="3fr 3fr 3fr 2fr" gap={2}>
									<TextField
										label="價格"
										name="price"
										value={newProductData.price}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => handleInputChange('price', e.target.value)}
									/>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">分類</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={newProductData.class || ''}
											label="分類"
											onChange={(e) =>
												handleInputChange('class', e.target.value)
											}
											size="small"
										>
											{productClasses.map((pClass) => (
												<MenuItem value={pClass.id} key={pClass.id}>
													{pClass.class_name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField
										label="折扣"
										name="discount"
										value={newProductData.discount}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										// type="number"
										// step={0.01}
										// min={0} // 最小值
										// max={1} // 最大值
										// onChange={(e) =>
										// 	handleInputChange('discount', e.target.value)
										// }
										onChange={(e) => {
											const value = e.target.value;
											// 僅允許 0-1 的小數
											if (
												/^0(\.\d{0,2})?$|^1(\.0{0,2})?$/.test(value) ||
												value === ''
											) {
												setNewProductData((prevData) => ({
													...prevData,
													discount: value,
												}));
											}
										}}
									/>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">
											上架狀態
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={newProductData.available}
											label="status"
											onChange={(e) =>
												handleInputChange('available', e.target.value)
											}
											size="small"
										>
											<MenuItem value={1}>上架中</MenuItem>
											<MenuItem value={0}>下架</MenuItem>
										</Select>
									</FormControl>
								</Box>
								<Editor
									apiKey="ybm105m2grbfo4uvecjmsga7qgzsleh4xyd0rtzef4glhafj"
									onInit={(evt, editor) => (editorRef.current = editor)}
									initialValue={editorContentRef.current} // 初始值從 ref 中取值
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
									onEditorChange={(content) => {
										editorContentRef.current = content; // 更新 ref 的值而非 state
										// console.log(editorContentRef.current);
									}}
								/>
							</Box>
						</div>
						<div className={`${styles['buttons']} gap-2 d-flex justify-content-end`}>
							<Button
								text="取消 回上一頁"
								onClick={() => console.log('點擊我按鈕被點擊')}
							/>

							<Button text="確定編輯 送出" onClick={handleSave} />
						</div>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
