import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from '../adminEdit';
import styles from '@/components/ElementList/ElementList.module.scss';
import ReturnBtn from '@/components/button/expand-button';
import axios from 'axios';
import Swal from 'sweetalert2';

const initialTeacherData = {
	title: '',
	name: '',
	description: '',
	expertise: '',
	experience: '',
	education: '',
	licence: '',
	awards: '',
	valid: false,
	img_path: null,
};

const initialErrors = {
	title: '',
	name: '',
	description: '',
	expertise: '',
	experience: '',
	education: '',
	img_path: '',
};

const profileImageStyle = {
	width: '150px',
	height: '150px',
	objectFit: 'cover',
	borderRadius: '50%',
	boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#e0e0e0',
	fontSize: '14px',
	color: '#999',
	position: 'relative',
};

const AddTeacher = () => {
	const [teacherData, setTeacherData] = useState(initialTeacherData);
	const [previewImage, setPreviewImage] = useState(null);
	const [errors, setErrors] = useState(initialErrors);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleBlur = (e) => {
		const { name, value } = e.target;
		const error = validateField(name, value);
		if (error) {
			Swal.fire({
				icon: 'warning',
				title: '請注意',
				text: error,
				confirmButtonColor: '#fe6f67',
			});
		}
	};

	const validateField = (name, value) => {
		switch (name) {
			case 'title':
				return !value.trim() ? '請填寫職稱' : '';
			case 'name':
				return !value.trim() ? '請填寫姓名' : '';
			case 'description':
				return !value.trim() ? '請填寫簡介' : value.length < 10 ? '簡介至少需要10個字' : '';
			case 'expertise':
				return !value.trim() ? '請填寫專業領域' : '';
			case 'experience':
				return !value.trim() ? '請填寫經歷' : '';
			case 'education':
				return !value.trim() ? '請填寫學歷' : '';
			default:
				return '';
		}
	};

	const showErrorAlert = (fieldErrors) => {
		const errorMessages = Object.entries(fieldErrors)
			.filter(([_, error]) => error)
			.map(([field, error]) => {
				const fieldNames = {
					title: '職稱',
					name: '姓名',
					description: '簡介',
					expertise: '專業領域',
					experience: '經歷',
					education: '學歷',
					img_path: '教師照片',
				};
				return `${fieldNames[field]}: ${error}`;
			});

		if (errorMessages.length > 0) {
			Swal.fire({
				icon: 'error',
				title: '表單填寫不完整',
				html: errorMessages.join('<br>'),
				confirmButtonColor: '#fe6f67',
			});
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTeacherData({ ...teacherData, [name]: value });

		// 即時驗證
		const error = validateField(name, value);
		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const handleCheckboxChange = (e) => {
		setTeacherData({ ...teacherData, valid: e.target.checked });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				Swal.fire({
					icon: 'error',
					title: '圖片大小超過限制',
					text: '圖片大小不能超過 5MB',
					confirmButtonColor: '#fe6f67',
				});
				return;
			}
			if (!file.type.startsWith('image/')) {
				Swal.fire({
					icon: 'error',
					title: '檔案格式錯誤',
					text: '請上傳圖片檔案',
					confirmButtonColor: '#fe6f67',
				});
				return;
			}
			setTeacherData({ ...teacherData, img_path: file });
			setPreviewImage(URL.createObjectURL(file));
			setErrors((prev) => ({ ...prev, img_path: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;

		// 驗證必填欄位
		Object.keys(initialErrors).forEach((field) => {
			if (field === 'img_path') {
				if (!teacherData.img_path) {
					newErrors[field] = '請上傳教師照片';
					isValid = false;
				}
			} else {
				const error = validateField(field, teacherData[field]);
				if (error) {
					newErrors[field] = error;
					isValid = false;
				}
			}
		});

		setErrors(newErrors);
		if (!isValid) {
			showErrorAlert(newErrors);
		}
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isSubmitting) {
			Swal.fire({
				icon: 'info',
				title: '處理中',
				text: '請稍候，正在處理您的請求...',
				confirmButtonColor: '#fe6f67',
			});
			return;
		}

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		const formData = new FormData();

		Object.keys(teacherData).forEach((key) => {
			if (key === 'valid') {
				formData.append('activation', teacherData[key] ? 1 : 0);
			} else {
				formData.append(key, teacherData[key]);
			}
		});

		try {
			await axios.post('http://localhost:3005/api/teacher', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			Swal.fire({
				icon: 'success',
				title: '新增成功！',
				text: '教師資料已成功新增。',
				confirmButtonText: '返回列表頁',
				confirmButtonColor: '#fe6f67',
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = '/admin/Teachers';
				}
			});
		} catch (error) {
			console.error('新增教師失敗:', error);
			Swal.fire({
				icon: 'error',
				title: '新增失敗',
				text: '新增教師時發生錯誤，請稍後再試。',
				confirmButtonColor: '#fe6f67',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AdminThemeProvider>
			<AdminLayout>
				<Box className={`${styles.container2}`}>
					<Box style={{ marginLeft: '25px' }}>
						<Link href="/admin/Teachers" passHref>
							<ReturnBtn value="返回師資列表" />
						</Link>
					</Box>
					<form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
						<Box display="flex" flexDirection="column" alignItems="center" mb={2}>
							<div style={profileImageStyle}>
								{previewImage ? (
									<img
										src={previewImage}
										alt="Profile Preview"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											borderRadius: '50%',
										}}
									/>
								) : (
									<span>未上傳圖片</span>
								)}
							</div>
							<label style={{ marginTop: '10px' }}>
								<Button
									variant="contained"
									component="label"
									style={{ marginTop: '10px' }}
								>
									上傳圖片
									<input
										type="file"
										hidden
										onChange={handleImageChange}
										accept="image/*"
									/>
								</Button>
							</label>
						</Box>

						<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={2}>
							<TextField
								label="職稱"
								name="title"
								value={teacherData.title}
								onChange={handleInputChange}
								onBlur={handleBlur}
								fullWidth
								required
								inputProps={{
									autoComplete: 'off', // 關閉自動完成
								}}
							/>
							<TextField
								label="姓名"
								name="name"
								value={teacherData.name}
								onChange={handleInputChange}
								onBlur={handleBlur}
								fullWidth
								required
								inputProps={{
									autoComplete: 'off',
								}}
							/>
							<TextField
								label="專業領域"
								name="expertise"
								value={teacherData.expertise}
								onChange={handleInputChange}
								onBlur={handleBlur}
								fullWidth
								required
								inputProps={{
									autoComplete: 'off',
								}}
							/>
						</Box>

						<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
							<TextField
								label="經歷"
								name="experience"
								value={teacherData.experience}
								onChange={handleInputChange}
								onBlur={handleBlur}
								fullWidth
								required
								inputProps={{
									autoComplete: 'off',
								}}
							/>
							<TextField
								label="學歷"
								name="education"
								value={teacherData.education}
								onChange={handleInputChange}
								onBlur={handleBlur}
								fullWidth
								required
								inputProps={{
									autoComplete: 'off',
								}}
							/>
							<TextField
								label="證書"
								name="licence"
								value={teacherData.licence}
								onChange={handleInputChange}
								fullWidth
								inputProps={{
									autoComplete: 'off',
								}}
							/>
							<TextField
								label="獎項"
								name="awards"
								value={teacherData.awards}
								onChange={handleInputChange}
								fullWidth
								inputProps={{
									autoComplete: 'off',
								}}
							/>
						</Box>
						<TextField
							label="簡介"
							name="description"
							value={teacherData.description}
							onChange={handleInputChange}
							onBlur={handleBlur}
							multiline
							rows={8}
							fullWidth
							required
							inputProps={{
								autoComplete: 'off',
							}}
						/>

						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mt={2}
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={teacherData.valid}
										onChange={handleCheckboxChange}
										name="valid"
										color="primary"
									/>
								}
								label="聘僱中"
							/>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isSubmitting}
							>
								{isSubmitting ? '處理中...' : '新增教師'}
							</Button>
						</Box>
					</form>
				</Box>
			</AdminLayout>
		</AdminThemeProvider>
	);
};

export default AddTeacher;
