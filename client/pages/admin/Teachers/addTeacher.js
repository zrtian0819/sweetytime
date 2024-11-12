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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTeacherData({ ...teacherData, [name]: value });
	};

	const handleCheckboxChange = (e) => {
		setTeacherData({ ...teacherData, valid: e.target.checked });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setTeacherData({ ...teacherData, img_path: file });
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		Object.keys(teacherData).forEach((key) => {
			if (key === 'valid') {
				formData.append('activation', teacherData[key] ? 1 : 0); // 設定 activation 為 1 或 0
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
				text: '教師已成功新增。',
				confirmButtonText: '返回列表頁',
				confirmButtonColor: '#fe6f67',
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = '/admin/Teachers';
				}
			});
		} catch (error) {
			console.error('新增教師失敗:', error);
			alert('新增教師失敗，請檢查後再試。');
		}
	};

	return (
		<AdminThemeProvider>
			<AdminLayout>
				<Box className={`${styles.container}`}>
					<Box style={{ marginLeft: '25px' }}>
						<Link href="/admin/Teachers" passHref>
							<ReturnBtn value="返回師資列表" />
						</Link>
					</Box>
					<form onSubmit={handleSubmit} encType="multipart/form-data">
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
								fullWidth
							/>
							<TextField
								label="姓名"
								name="name"
								value={teacherData.name}
								onChange={handleInputChange}
								fullWidth
							/>
							<TextField
								label="專業領域"
								name="expertise"
								value={teacherData.expertise}
								onChange={handleInputChange}
								fullWidth
							/>
						</Box>

						<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
							<TextField
								label="經歷"
								name="experience"
								value={teacherData.experience}
								onChange={handleInputChange}
								fullWidth
							/>
							<TextField
								label="學歷"
								name="education"
								value={teacherData.education}
								onChange={handleInputChange}
								fullWidth
							/>
							<TextField
								label="證書"
								name="licence"
								value={teacherData.licence}
								onChange={handleInputChange}
								fullWidth
							/>
							<TextField
								label="獎項"
								name="awards"
								value={teacherData.awards}
								onChange={handleInputChange}
								fullWidth
							/>
						</Box>
						<TextField
							label="簡介"
							name="description"
							value={teacherData.description}
							onChange={handleInputChange}
							multiline
							rows={8}
							fullWidth
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

							<Button type="submit" variant="contained" color="primary">
								新增教師
							</Button>
						</Box>
					</form>
				</Box>
			</AdminLayout>
		</AdminThemeProvider>
	);
};

export default AddTeacher;
