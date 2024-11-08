import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Button, TextField, Checkbox, FormControlLabel, Box } from '@mui/material';
import AdminThemeProvider from '../../adminEdit';
import styles from '@/components/ElementList/ElementList.module.scss';
import ReturnBtn from '@/components/button/expand-button';
import axios from 'axios';

const initialTeacherData = {
	name: '',
	description: '',
	expertise: '',
	experience: '',
	education: '',
	licence: '',
	awards: '',
	valid: false,
	img_path: '/photos/teachers/Maggie.png',
};

const profileImageStyle = {
	width: '150px',
	height: '150px',
	objectFit: 'cover',
	borderRadius: '50%',
	marginBottom: '20px',
	boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const EditTeacher = () => {
	const [teacherData, setTeacherData] = useState(initialTeacherData);
	const [previewImage, setPreviewImage] = useState(initialTeacherData.img_path);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3005/api/teacher/teacherDetail/${id}`)
				.then((res) => {
					const data = res.data;
					setTeacherData({
						name: data.name || '',
						description: data.description || '',
						expertise: data.expertise || '',
						experience: data.experience || '',
						education: data.education || '',
						licence: data.licence || '',
						awards: data.awards || '',
						valid: data.status === 1,
						img_path: data.img_path
							? `/photos/teachers/${data.img_path}`
							: initialTeacherData.img_path,
					});
					setPreviewImage(
						data.img_path
							? `/photos/teachers/${data.img_path}`
							: initialTeacherData.img_path
					);
				})
				.catch((error) => console.error('無法獲取教師資料:', error));
		}
	}, [id]);

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
			const reader = new FileReader();
			reader.onload = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
			setTeacherData({ ...teacherData, img_path: file });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		Object.keys(teacherData).forEach((key) => formData.append(key, teacherData[key]));

		axios
			.put(`http://localhost:3005/api/teacher/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then(() => {
				router.push('/admin/teacher');
			})
			.catch((error) => console.error('更新教師資料失敗:', error));
	};

	return (
		<AdminThemeProvider>
			<AdminLayout>
				<Box style={{ marginLeft: '25px' }}>
					<Link href="/admin/Teachers" passHref>
						<ReturnBtn value="返回師資列表" onClick={() => console.log('返回師資列表')} />
					</Link>
				</Box>
				<form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.container}>
					<Box display="flex" flexDirection="column" alignItems="center" mb={2} style={{ marginTop: '-60px' }}>
						<label htmlFor="profile_image" className={styles.formControlCustom} style={{ marginBottom: '10px' }}>
							上傳或更改圖片:
						</label>
						<img src={previewImage} alt="Profile Preview" style={profileImageStyle} />
						<label className={styles.customFileUpload}>
							上傳圖片
							<input
								type="file"
								id="profile_image"
								name="profile_image"
								accept="image/*"
								onChange={handleImageChange}
								className={styles.fileInput}
							/>
						</label>
					</Box>

					<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
						<TextField label="姓名" name="name" value={teacherData.name} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
						<TextField label="專業領域" name="expertise" value={teacherData.expertise} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
						<TextField label="經歷" name="experience" value={teacherData.experience} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
						<TextField label="學歷" name="education" value={teacherData.education} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
						<TextField label="證書" name="licence" value={teacherData.licence} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
						<TextField label="獎項" name="awards" value={teacherData.awards} onChange={handleInputChange} className={styles.formControlCustom} fullWidth />
					</Box>
					<TextField
						label="簡介"
						name="description"
						value={teacherData.description}
						onChange={handleInputChange}
						multiline
						rows={8}
						className={styles.textareaCustom}
						fullWidth
					/>

					<Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
						<FormControlLabel
							control={
								<Checkbox
									checked={teacherData.valid}
									onChange={handleCheckboxChange}
									name="valid"
									color="primary"
									className={styles.formCheckInput}
								/>
							}
							label="聘僱中"
							className={styles.formCheckLabel}
						/>

						<Button type="submit" variant="contained" className={styles.btnCustom}>
							儲存
						</Button>
					</Box>
				</form>
			</AdminLayout>
		</AdminThemeProvider>
	);
};

export default EditTeacher;