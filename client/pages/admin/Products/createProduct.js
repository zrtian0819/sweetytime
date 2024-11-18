import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminProducts/viewProducts.module.scss';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import Button from '@/components/adminButton';
import { showCustomToast } from '@/components/toast/CustomToastMessage';
import { Editor } from '@tinymce/tinymce-react';
import { useUser } from '@/context/userContext';

import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditProduct(props) {
	const { user, logout } = useUser();
	const router = useRouter();
	const [shopData, setShopData] = useState([]);
	const [productPhotos, setProductPhotos] = useState([]);
	const [productClasses, setProductClasses] = useState([]);
	const [bigPhoto, setBigPhoto] = useState('/photos/ImgNotFound.png');
	const [fade, setFade] = useState(false); // 照片切換效果用

	useEffect(() => {
		axios
			.get('http://localhost:3005/api/product_class')
			.then((response) => setProductClasses(response.data))
			.catch((error) => console.error('Error fetching product_class:', error));

		axios
			.get('http://localhost:3005/api/product/shopId', {
				params: { userId: user.id },
			})
			.then((response) => {
				setShopData(response.data);
				console.log('res.data:', response.data);
			})
			.catch((error) => console.error('Error fetching product_class:', error));
	}, []);

	useEffect(() => {
		if (bigPhoto == '/photos/ImgNotFound.png' && productPhotos.length > 0) {
			setBigPhoto(productPhotos[0].url);
		}
	}, [productPhotos]);

	console.log('shopData:', shopData);

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
		class: 6,
		discount: 1,
		stocks: 0,
		available: 0,
		shopId: shopData.id,
		keywords: '',
	});

	useEffect(() => {
		if (shopData?.id) {
			setNewProductData((prevData) => ({
				...prevData,
				shopId: shopData.id, // 更新 shopId
			}));
		}
	}, [shopData]);

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

	// ========================================表單驗證=============================================
	const validateForm = () => {
		const errors = [];
		const {
			name,
			price,
			class: productClass,
			discount,
			stocks,
			available,
			keywords,
		} = newProductData;

		// 檢查商品名稱
		if (!name || name.trim() === '') {
			errors.push('商品名稱不能為空');
		}

		// 檢查價格
		if (!price || isNaN(price) || price <= 0) {
			errors.push('價格必須是正數');
		}

		// 檢查分類
		if (!productClass) {
			errors.push('必須選擇分類');
		}

		// 檢查折扣
		if (
			discount === null || // 確保折扣有值
			isNaN(parseFloat(discount)) || // 檢查是否能轉換成數字
			parseFloat(discount) > 1 // 確保數值小於 1
		) {
			errors.push('折扣必須是小於 1 的數字');
		}

		// 檢查庫存
		if (stocks === null || isNaN(stocks) || stocks < 0) {
			errors.push('庫存必須是 0 或正整數');
		}

		// 檢查關鍵字
		if (
			!/^([\u4e00-\u9fa5a-zA-Z0-9]+,[\u4e00-\u9fa5a-zA-Z0-9]+|([\u4e00-\u9fa5a-zA-Z0-9]+,)+[\u4e00-\u9fa5a-zA-Z0-9]+|[\u4e00-\u9fa5a-zA-Z0-9]+)$/.test(
				keywords
			)
		) {
			errors.push('不可有空白的關鍵字！');
		}

		// 檢查商品照片
		if (
			productPhotos.length === 0 ||
			productPhotos.filter((photo) => photo.keep).length === 0
		) {
			errors.push('商品至少要有一張圖片');
		}

		// 如果有錯誤，顯示訊息並返回 false
		if (errors.length > 0) {
			errors.forEach((error) => showCustomToast('cancel', '新增失敗', error));
			return false;
		}

		return true;
	};

	// ========================================確定送出=============================================
	const handleSave = async () => {
		// 驗證表單
		if (!validateForm()) {
			return; // 驗證失敗，中止請求
		}

		// 顯示 SweetAlert 確認對話框
		const result = await Swal.fire({
			title: '確認新增商品',
			text: '您確定要新增此商品嗎？',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '確定',
			cancelButtonText: '取消',
		});

		// 如果使用者選擇取消，則中止操作
		if (!result.isConfirmed) {
			return;
		}

		try {
			// ---------------------------------處理商品資訊--------------------------------
			const response = await axios.post('http://localhost:3005/api/product/create', {
				...newProductData,
				description: editorContentRef.current, // 送出編輯器的最終內容
			});

			console.log('新增商品成功:', response.data);

			// 從回應中獲取新增商品的 ID
			const newProductId = response.data.id;

			// ----------------------------------處理照片-----------------------------------
			const formData = new FormData();

			// 將商品 ID 添加到 FormData 中
			formData.append('productId', newProductId);

			// 篩選出需要上傳的新照片
			const photosToUpload = productPhotos.filter((photo) => photo.isNew && photo.keep);
			photosToUpload.forEach((photo) => {
				formData.append('photos', photo.file, photo.uniqueFileName);
			});

			console.log('photosToUpload:', photosToUpload);
			for (let [key, value] of formData.entries()) {
				console.log(`${key}:`, value); // 解析並打印出 formData
			}

			// 上傳新照片
			if (photosToUpload.length > 0) {
				await axios.post('http://localhost:3005/api/product/upload_photos', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
				console.log('新照片上傳成功');
			}

			console.log('新增照片完成');

			await Swal.fire({
				title: '新增成功',
				text: '商品已成功新增！',
				icon: 'success',
				confirmButtonText: 'OK',
			}).then(() => {
				// 跳轉到檢視商品頁面
				window.location.href = `/admin/Products/viewProduct/${newProductId}`;
			});
		} catch (error) {
			console.error('新增商品時發生錯誤:', error);
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
								</Box>
								<Box display="grid" gridTemplateColumns="1fr" gap={2}>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">
											所屬商家
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={newProductData.shopId || ''}
											label="所屬商家"
											onChange={(e) =>
												handleInputChange('shopId', e.target.value)
											}
											size="small"
											readOnly
										>
											<MenuItem value={shopData.id}>{shopData.name}</MenuItem>
										</Select>
									</FormControl>
								</Box>

								<Box
									display="grid"
									gridTemplateColumns="2fr 2fr 2fr 2fr 2fr"
									gap={2}
								>
									<TextField
										label="價格"
										name="price"
										value={newProductData.price}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => {
											const value = e.target.value;

											// 僅允許正整數
											if (/^[1-9]\d*$/.test(value) || value === '') {
												handleInputChange('price', value); // 更新價格值
											} else {
												showCustomToast(
													'cancel',
													'修改失敗',
													'價格必須是正整數！'
												);
											}
										}}
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
											// 僅允許小於 1 的整數或小數，包括負數
											if (
												(/^-?\d*(\.\d+)?$/.test(value) &&
													parseFloat(value) <= 1) ||
												value === '' ||
												value === '-' ||
												value === '0.'
											) {
												setNewProductData((prevData) => ({
													...prevData,
													discount: value,
												}));
											} else {
												showCustomToast(
													'cancel',
													'無效的折扣值',
													'必須是1以下的數字！'
												);
											}
										}}
									/>
									<TextField
										label="庫存數量"
										name="stocks"
										value={newProductData.stocks}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => {
											const value = e.target.value;

											// 僅允許 0 或正整數
											if (/^\d*$/.test(value)) {
												setNewProductData((prevData) => ({
													...prevData,
													stocks: value,
												}));
											} else {
												showCustomToast(
													'cancel',
													'修改失敗',
													'庫存數量必須是 0 或正整數！'
												);
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
											label="上架狀態"
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
								<Box>
									<TextField
										id="demo-simple-select-label"
										label="關鍵字 (請以逗號分隔)"
										name="stocks"
										value={newProductData.keywords}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => {
											const value = e.target.value;
											setNewProductData((prevData) => ({
												...prevData,
												keywords: value,
											}));
										}}
										InputLabelProps={{
											shrink: true, // 固定 label 在上方
										}}
									/>
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

							<Button text="新增他！！！" onClick={handleSave} />
						</div>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
