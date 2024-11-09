import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '@/styles/adminshop.module.scss';
import AdminThemeProvider from '../../adminEdit';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';

export default function Editshop() {
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState(null); // 初始值設為 null
	const [status, setStatus] = useState(0);
	const [shopName, setShopName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewImage, setPreviewImage] = useState('');
	const [signUpTime, setSignUpTime] = useState('');
	const editorRef = useRef(null);

	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};

	const handleEdit = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const handleUpload = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('photo', selectedImage);
		axios
			.post(`http://localhost:3005/api/shop/admin/upload/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res) => console.log('更新照片成功'))
			.catch((error) => console.error('更新照片失敗', error));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success ms-2',
				cancelButton: 'btn btn-danger',
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: '即將完成編輯',
				text: '確定要更改商家的資料嗎？',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '是的，儲存',
				cancelButtonText: '不了，取消',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					const formData = new FormData();
					formData.append('shopName', shopName);
					formData.append('phone', phone);
					formData.append('address', address);
					formData.append('photo', selectedImage);
					formData.append('status', status);
					formData.append(
						'description',
						editorRef.current?.getContent({ format: 'text' })
					);

					axios
						.post(`http://localhost:3005/api/shop/admin/update/${id}`, formData, {
							headers: { 'Content-Type': 'multipart/form-data' },
						})
						.then((res) => {
							swalWithBootstrapButtons.fire({
								title: '商家更新成功!',
								// text: 'Your file has been deleted.',
								icon: 'success',
							});
						})
						.then(() => {
							router.push(`../viewStores/${id}`);
						});
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					return;
				}
			});
	};

	// 獲取指定商家的資料
	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/shop/${id}`)
				.then((res) => {
					setData(res.data);
					setPreviewImage(
						`/photos/shop_logo/${res.data.logo_path || 'shop_default.png'}`
					);
					setShopName(res.data.name);
					setStatus(res.data.activation);
					setAddress(res.data.address || '');
					setPhone(res.data.phone || '');
					setSignUpTime(res.data.sign_up_time || '');
				})
				.catch((error) => console.error('找不到商家資料', error));
		}
	}, [id]);

	return (
		<>
			{data ? (
				<AdminThemeProvider>
					<AdminLayout>
						<div className="container">
							<form onSubmit={handleSubmit} className="row ">
								<div className="col-6 text-center my-auto">
									<Image
										src={previewImage || '/photos/shop_logo/shop_default.png'}
										alt={shopName ? `${shopName} logo` : 'Default shop logo'}
										width={450}
										height={350}
										className="m-auto"
										style={{ objectFit: 'contain', borderRadius: '25px' }}
									/>

									<div className="d-flex flex-row justify-content-center mt-3">
										<Button
											variant="contained"
											className="m-2"
											component="label"
											sx={{ color: '#FFF', background: '#fe6f67' }}
										>
											<input
												type="file"
												hidden
												accept="image/*"
												onChange={handleEdit}
											/>
											更新照片
										</Button>
										<Button
											variant="contained"
											className="m-2"
											onClick={handleUpload}
											sx={{ color: '#FFF', background: '#fe6f67' }}
										>
											確認上傳
										</Button>
									</div>
								</div>

								<Box
									display="grid"
									gridTemplateColumns="1fr 1fr"
									gap={2}
									m={2}
									className="col-6 d-flex flex-column m-0"
								>
									<TextField
										label="店家名稱"
										name="name"
										value={shopName}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setShopName(e.target.value)}
									/>
									<TextField
										label="電話"
										name="phone"
										value={phone}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setPhone(e.target.value)}
									/>
									<TextField
										label="地址"
										name="address"
										value={address}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setAddress(e.target.value)}
									/>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">狀態</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={status}
											label="status"
											onChange={handleChangeSta}
											size="small"
										>
											<MenuItem value={1}>啟用中</MenuItem>
											<MenuItem value={0}>停用中</MenuItem>
										</Select>
									</FormControl>
									<TextField
										label="註冊時間"
										name="signUpTime"
										value={signUpTime}
										className={styles.formControlCustom}
										fullWidth
										size="small"
									/>
									<div className="d-flex flex-column">
										<h3 className={styles['TIL-text']}>商家簡介</h3>
										<Editor
											apiKey="cfug9ervjy63v3sj0voqw9d94ojiglomezxkdd4s5jr9owvu"
											onInit={(evt, editor) => (editorRef.current = editor)}
											initialValue={data.description}
											init={{
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
										/>
										<Button
											variant="contained"
											onClick={handleSubmit}
											sx={{
												color: '#fff',
												background: '#fe6f67',
												width: '100px',
												ml: 'auto',
												marginTop: '20px',
											}}
										>
											完成編輯
										</Button>
									</div>
								</Box>
							</form>
						</div>
					</AdminLayout>
				</AdminThemeProvider>
			) : (
				<p>正在加載商家資料...</p>
			)}
			{/* 於商家資料尚未載入時，顯示 Loading 狀態 */}
		</>
	);
}
