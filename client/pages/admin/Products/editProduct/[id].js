import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminProducts/viewProducts.module.scss';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ToggleButton from '@/components/adminCRUD/toggleButton';
import Button from '@/components/adminButton';
import { showCustomToast } from '@/components/toast/CustomToastMessage';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';

import { useRouter } from 'next/router';
import axios from 'axios';

import { useUser } from '@/context/userContext';

export default function EditProduct(props) {
	const router = useRouter();
	const { user, logout } = useUser();
	const { id } = router.query;
	const [shopData, setShopData] = useState([]);

	const [product, setProduct] = useState({});
	const [productClass, setProductClass] = useState('');
	const [productPhotos, setProductPhotos] = useState([]);
	const [productClasses, setProductClasses] = useState([]);
	const [bigPhoto, setBigPhoto] = useState('');
	const [fade, setFade] = useState(false); // 照片切換效果用

	useEffect(() => {
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
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product_class`)
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
		stocks: 0,
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
			stocks: product.stocks || 0,
			keywords: product.keywords?.join(',') || '',
		});
		editorContentRef.current = product.description || ''; // 同步更新 ref 的值
	}, [product, productClass]);
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

	// ========================================定義表單驗證邏輯=============================================
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
			discount === '' ||
			isNaN(parseFloat(discount)) ||
			parseFloat(discount) > 1 ||
			parseFloat(discount) < 0
		) {
			errors.push('折扣必須是 0 ~ 1 的數字');
		}

		// 檢查庫存
		if (stocks === '' || isNaN(stocks) || stocks < 0) {
			errors.push('庫存必須是 0 或正整數');
		}

		// 檢查關鍵字
		if (
			!/^([\u4e00-\u9fa5a-zA-Z0-9]+,[\u4e00-\u9fa5a-zA-Z0-9]+|([\u4e00-\u9fa5a-zA-Z0-9]+,)+[\u4e00-\u9fa5a-zA-Z0-9]+|[\u4e00-\u9fa5a-zA-Z0-9]+)$/.test(
				keywords
			) &&
			keywords !== ''
		) {
			errors.push('不可有空白的關鍵字！');
		}

		// 檢查商品照片
		if (
			productPhotos.length === 0 ||
			productPhotos.filter((photo) => photo.keep).length === 0
		) {
			errors.push('商品至少要有一張照片！');
		}

		// 如果有錯誤，顯示訊息並返回 false
		if (errors.length > 0) {
			errors.forEach((error) => showCustomToast('cancel', '編輯失敗', error));
			return false;
		}

		return true;
	};

	// ========================================確定送出====================================================
	const handleSave = async () => {
		// 驗證表單
		if (!validateForm()) {
			return; // 驗證失敗，中止請求
		}

		// 顯示 SweetAlert 確認對話框
		const result = await Swal.fire({
			title: '確認編輯',
			text: '您確定要更新此商品的資訊嗎？',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: '確定',
			cancelButtonText: '取消',
		});

		// 如果使用者選擇取消，則中止操作
		if (!result.isConfirmed) {
			return;
		}

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
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value); // 解析並打印出 formData
		}
		console.log('photosToDelete:', photosToDelete);

		// --------------------------------處理保存邏輯---------------------------------
		try {
			// 同時處理照片的上傳與刪除
			if (photosToUpload.length > 0) {
				await axios.post(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/upload_photos`,
					formData,
					{
						headers: { 'Content-Type': 'multipart/form-data' },
					}
				);
			}

			if (photosToDelete.length > 0) {
				await axios.post(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/delete_photos`,
					{
						photos: photosToDelete,
					}
				);
			}

			// 更新商品資訊
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/update`,
				{
					...newProductData,
					description: editorContentRef.current, // 送出編輯器的最終內容
				}
			);

			console.log('保存成功:', response.data);
			await Swal.fire({
				title: '更新成功',
				text: '已更新商品資訊！',
				icon: 'success',
				confirmButtonText: '確定',
			});
			router.push(`/admin/Products/viewProduct/${product.id}`);
		} catch (error) {
			console.error('保存失敗:', error);
			await Swal.fire({
				title: '錯誤',
				text: `保存失敗: ${error.message || '未知錯誤，請稍後再試'}`,
				icon: 'error',
				confirmButtonText: '確定',
			});
		}
	};

	// ========================================刪除&復原商品======================================================
	const handleDeleted = async () => {
		const result = await Swal.fire({
			title: '確認刪除',
			text: '您確定要刪除此商品嗎？',
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
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/toggleDelete`,
				{
					id: product.id,
				}
			);
			// 處理請求成功的響應
			if (response.status === 200) {
				Swal.fire('刪除成功', '該商品已成功刪除！', 'success').then(() => {
					router.push('/admin/Products');
				});
			} else {
				Swal.fire('刪除失敗', '刪除商品時出現問題，請稍後再試！', 'error');
			}
		} catch (error) {
			// 處理請求失敗的情況
			console.error('刪除失敗:', error);
			Swal.fire('刪除失敗', '刪除商品時出現問題，請稍後再試！', 'error');
		}
	};

	const handleRecover = async () => {
		const result = await Swal.fire({
			title: '確認復原',
			text: '您確定要復原此商品嗎？',
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
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/toggleDelete`,
				{
					id: product.id,
				}
			);
			// 處理請求成功的響應
			if (response.status === 200) {
				Swal.fire('復原成功', '該商品已成功復原！', 'success').then(() => {
					router.push('/admin/Products');
				});
			} else {
				Swal.fire('復原失敗', '復原商品時出現問題，請稍後再試！', 'error');
			}
		} catch (error) {
			// 處理請求失敗的情況
			console.error('復原失敗:', error);
			Swal.fire('復原失敗', '復原商品時出現問題，請稍後再試！', 'error');
		}
	};

	return (
		<>
			<AdminLayout>
				{user.role === 'admin' || shopData.id == product.shop_id ? (
					<>
						<div
							className={`d-flex gap-5`}
							style={{ overflowY: 'auto', height: '100%' }}
						>
							{/* ============================商品圖片區============================ */}
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
											alt=""
											src={bigPhoto}
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
									{productPhotos.map((photo, index) => (
										<div
											className={`${styles['smallPhoto']} ZRT-click`}
											onClick={() => handlePhotoClick(photo.url)}
											key={index}
											style={{
												width: '93px',
												height: '93px',
												position: 'relative',
											}}
										>
											<Image
												alt=""
												src={photo.url}
												// width={93}
												// height={93}
												fill
												style={{
													objectFit: 'cover',
												}}
											/>
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
								className={`${styles['infos']} d-flex flex-column mt-2 justify-content-start gap-5`}
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
											onChange={(e) =>
												handleInputChange('name', e.target.value)
											}
										/>
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
													handleInputChange('price', value); // 更新價格值
													// 僅允許正整數
													if (!/^[1-9]\d*$/.test(value) && value !== '') {
														showCustomToast(
															'cancel',
															'修改失敗',
															'價格必須是正整數！'
														);
													}
												}}
											/>
											<FormControl fullWidth>
												<InputLabel id="demo-simple-select-label">
													分類
												</InputLabel>
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

													setNewProductData((prevData) => ({
														...prevData,
														discount: value,
													}));

													// 僅允許0到1的數字
													if (
														value !== '' &&
														value !== '0.' &&
														(!/^\d*(\.\d+)?$/.test(value) ||
															parseFloat(value) < 0 ||
															parseFloat(value) > 1)
													) {
														showCustomToast(
															'cancel',
															'無效的折扣值',
															'必須是0到1的數字！'
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
													setNewProductData((prevData) => ({
														...prevData,
														stocks: value,
													}));
													if (!/^\d*$/.test(value)) {
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
														handleInputChange(
															'available',
															e.target.value
														)
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
												label="關鍵字"
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
												height: 50,
												min_height: 350,
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
								<div
									className={`${styles['buttons']} gap-2 d-flex justify-content-between`}
								>
									<div>
										{product.deleted ? (
											<Button text="復原商品" onClick={handleRecover} />
										) : (
											<Button text="刪除商品" onClick={handleDeleted} />
										)}
									</div>
									<div
										className={`${styles['buttons']} gap-2 d-flex justify-content-end`}
									>
										<Button
											text="取消 回細節頁"
											onClick={() => {
												Swal.fire({
													title: '確定要退出嗎？',
													text: '未儲存的修改內容會不見喔！',
													icon: 'warning',
													showCancelButton: true,
													confirmButtonColor: '#3085d6',
													cancelButtonColor: '#d33',
													confirmButtonText: '確定',
													cancelButtonText: '取消',
												}).then((result) => {
													if (result.isConfirmed) {
														router.push(
															`/admin/Products/viewProduct/${product.id}`
														);
													}
												});
											}}
										/>

										<Button text="確定編輯 送出" onClick={handleSave} />
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="d-flex justify-content-center align-items-center h-100">
							<div className="d-flex justify-content-center flex-column align-items-center">
								<h1>你無權編輯別間商店的商品！</h1>
								<Button text="回上一頁" onClick={() => router.back()} />
							</div>
						</div>
					</>
				)}
			</AdminLayout>
		</>
	);
}
