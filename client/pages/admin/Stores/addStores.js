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

export default function AddShop() {
	const router = useRouter();
	const [status, setStatus] = useState(1);
	const [name, setname] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewImage, setPreviewImage] = useState('');
	const editorRef = useRef(null);

	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};

	const handleUpload = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const checkData = () => {
		if (!name || name == '') {
			return '請填寫店家名稱';
		}
		if (!phone || phone == '') {
			return '請填寫電話';
		}
		if (!address || address == '') {
			return '請填寫店家地址';
		}
		if (!account || account == '') {
			return '請填寫店家帳號';
		}
		if (!password || password == '') {
			return '請填寫店家密碼';
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const checkResult = checkData();
		if (checkResult) {
			Swal.fire({
				title: '資訊未填寫完整',
				text: checkResult,
				icon: 'warning',
			});

			return;
		}

		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success ms-2',
				cancelButton: 'btn btn-danger',
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: `確定要新增"${name}"嗎?`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '是的，新增',
				cancelButtonText: '不了，取消',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					const formData = new FormData();
					formData.append('logo_path', selectedImage);
					formData.append('email', email);
					formData.append('name', name);
					formData.append('phone', phone);
					formData.append('address', address);
					formData.append('status', status);
					formData.append('account', account);
					formData.append('password', password);
					formData.append(
						'description',
						editorRef.current?.getContent({ format: 'text' })
					);
					axios
						.post('http://localhost:3005/api/shop/admin/createShop', formData, {
							headers: { 'Content-Type': 'multipart/form-data' },
						})
						.then((res) => {
							swalWithBootstrapButtons.fire({
								title: '商家新增成功!',
								icon: 'success',
							});
							router.push(`/admin/Stores`);
						})
						.catch((error) => {
							console.error('新增失敗', error);
							swalWithBootstrapButtons.fire({
								title: '新增失敗!',
								icon: 'error',
							});
						});
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					return;
				}
			});
	};

	return (
		<>
			<AdminThemeProvider>
				<AdminLayout style={{ position: 'relative' }}>
					<div
						className="container"
						style={{ overflowY: 'auto', height: '100%', scrollbarWidth: '15px' }}
					>
						<Link href="../Stores">
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
								<div className="d-flex flex-row gap-3">
									<TextField
										label="店家名稱"
										name="name"
										value={name}
										className={styles.formControlCustom}
										fullWidth
										size="small"
										onChange={(e) => setname(e.target.value)}
									/>
									<FormControl fullWidth>
										<InputLabel id="status-select-label">狀態</InputLabel>
										<Select
											labelId="status-select-label"
											id="status-select"
											value={status}
											label="status"
											onChange={handleChangeSta}
											size="small"
										>
											<MenuItem value={1}>啟用中</MenuItem>
											<MenuItem value={0}>停用中</MenuItem>
										</Select>
									</FormControl>
								</div>

								<div className="d-flex flex-row gap-3">
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
										label="信箱"
										name="email"
										value={email}
										className={styles.formControlCustom}
										onChange={(e) => setEmail(e.target.value)}
										fullWidth
										size="small"
									/>
								</div>
								<TextField
									label="地址"
									name="address"
									value={address}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setAddress(e.target.value)}
								/>
								<TextField
									label="帳號"
									name="account"
									value={account}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setAccount(e.target.value)}
								/>
								<TextField
									label="密碼"
									name="password"
									value={password}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setPassword(e.target.value)}
								/>

								<div className={`${styles['CTH-class-info']} d-flex flex-column`}>
									<h3 className={styles['TIL-text']}>店家簡介</h3>
									<Editor
										apiKey="93sx5u53ymr4g8dy450sh3qacgod0mozrwa5zxt5i8xkfps2"
										onInit={(evt, editor) => (editorRef.current = editor)}
										initialValue="請輸入內容"
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
