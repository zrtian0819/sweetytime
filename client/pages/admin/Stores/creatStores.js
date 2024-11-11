import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminShop.module.scss';
import AdminThemeProvider from '../adminEdit';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import ExpandButton from '@/components/button/expand-button';

export default function AddLesson() {
	const router = useRouter();
	const [status, setStatus] = useState(1);
	const [shopName, setShopName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [selectedImage, setSelectedImage] = useState(null); // 用於保存選中的新照片
	const [previewImage, setPreviewImage] = useState(''); // 預覽照片
	const editorRef = useRef(null);

	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};

	const handleUpload = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			setPreviewImage(URL.createObjectURL(file)); // 創建預覽URL
		}
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
				title: `確定要新增"${shopName}"嗎?`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '是的，新增',
				cancelButtonText: '不了，取消',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					const formData = new FormData();
					formData.append('photo', selectedImage);
					formData.append('shopName', shopName);
					formData.append('phone', phone);
					formData.append('address', address);
					formData.append('status', status);
					formData.append(
						'description',
						editorRef.current?.getContent({ format: 'text' })
					);
					axios
						.post('http://localhost:3005/api/shop/admin/upload', formData, {
							headers: { 'Content-Type': 'multipart/form-data' },
						})
						.then((res) => {
							swalWithBootstrapButtons.fire({
								title: '商家新增成功!',
								icon: 'success',
							});
							router.push(`/admin/Stores`);
						})
						.catch((error) => console.error('新增失敗'));
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					return;
				}
			});
	};

	return (
		<>
			<AdminThemeProvider>
				<AdminLayout style={{ position: 'relative' }}>
					<div className="container">
						<Link href="./" style={{ position: 'absolute', top: '40px', left: '50px' }}>
							<ExpandButton value="返回列表頁" />
						</Link>
						<form onSubmit={handleSubmit} className="row pt-3">
							<div className="col-6 d-flex flex-column my-auto">
								<Image
									src={previewImage || '/photos/shop_logo/shop_default.png'}
									width={400}
									height={400}
									style={{ objectFit: 'contain', borderRadius: '25px' }}
									className="mx-auto"
								/>

								<Button
									variant="contained"
									className="mx-auto"
									component="label"
									sx={{
										color: '#FFF',
										background: '#fe6f67',
										width: '100px',
										marginTop: '10px',
									}}
								>
									<input
										type="file"
										hidden
										accept="image/*"
										onChange={handleUpload}
									/>
									上傳照片
								</Button>
							</div>

							<Box
								display="grid"
								gridTemplateColumns="1fr 1fr"
								gap={2}
								m={2}
								className="col-6 d-flex flex-column mx-0 my-3"
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
									onChange={(e) => setPhone(e.target.value)}
									fullWidth
									size="small"
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
								<div className={`${styles['CTH-class-info']} d-flex flex-column`}>
									<h3 className={styles['TIL-text']}>店家簡介</h3>
									<Editor
										apiKey="93sx5u53ymr4g8dy450sh3qacgod0mozrwa5zxt5i8xkfps2"
										onInit={(evt, editor) => (editorRef.current = editor)}
										initialValue={'請輸入內容'}
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
										完成
									</Button>
								</div>
							</Box>
						</form>
					</div>
				</AdminLayout>
			</AdminThemeProvider>
		</>
	);
}
