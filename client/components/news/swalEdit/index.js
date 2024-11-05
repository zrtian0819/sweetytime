// components/EditTeacherAlert.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TextField, Checkbox, FormControlLabel, Box, Button } from '@mui/material';
import styles from '../../components/ElementList/ElementList.module.scss';

const MySwal = withReactContent(Swal);

const EditTeacherAlert = ({ teacherData, onSave }) => {
	const [formData, setFormData] = useState(teacherData || {});
	const [previewImage, setPreviewImage] = useState(
		teacherData?.imgSrc || '/photos/teachers/default.png'
	);

	useEffect(() => {
		if (teacherData) {
			setFormData(teacherData);
			setPreviewImage(teacherData.imgSrc);
		}
	}, [teacherData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCheckboxChange = (e) => {
		setFormData({ ...formData, valid: e.target.checked });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
			setFormData({ ...formData, imgSrc: file });
		}
	};

	const handleSubmit = () => {
		onSave(formData); // 呼叫父層的儲存函數
		MySwal.close();
	};

	const showEditAlert = () => {
		MySwal.fire({
			title: '編輯教師資料',
			html: (
				<Box component="form" encType="multipart/form-data" className={styles.container}>
					<Box display="flex" flexDirection="column" alignItems="center" mb={2}>
						<img
							src={previewImage}
							alt="Profile Preview"
							style={{
								width: 200,
								height: 200,
								objectFit: 'cover',
								borderRadius: '8px',
								marginBottom: '20px',
							}}
						/>
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

					<TextField
						label="姓名"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="專業領域"
						name="expertise"
						value={formData.expertise}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="經歷"
						name="experience"
						value={formData.experience}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="學歷"
						name="education"
						value={formData.education}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="證書"
						name="licence"
						value={formData.licence}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="獎項"
						name="awards"
						value={formData.awards}
						onChange={handleInputChange}
						fullWidth
					/>
					<TextField
						label="簡介"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						multiline
						rows={4}
						fullWidth
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={formData.valid}
								onChange={handleCheckboxChange}
								name="valid"
								color="primary"
							/>
						}
						label="有效"
					/>
				</Box>
			),
			showCancelButton: true,
			confirmButtonText: '儲存',
			cancelButtonText: '取消',
			preConfirm: handleSubmit,
			customClass: {
				popup: styles.alertPopup,
			},
		});
	};

	return (
		<Button onClick={showEditAlert} variant="contained">
			編輯教師資料
		</Button>
	);
};

export default EditTeacherAlert;
