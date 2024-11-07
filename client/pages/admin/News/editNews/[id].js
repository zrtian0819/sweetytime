import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminThemeProvider from '../../adminEdit';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/adminLesson.module.scss';
import {
	TextField,
	Checkbox,
	FormControlLabel,
	Box,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EditNews() {
	const router = useRouter();
	const { id } = router.query;
const initialNewsData = {
	title: '',
	content: '',
	category: '',
	date: '',
	valid: false,
	imgSrc: '/photos/articles/lemonMeringueTart.jpg',
};





	return (
		<>
		{data.news(
		<AdminThemeProvider>
			<AdminLayout>
				<form
					onSubmit={handleSubmit}
					encType="multipart/form-data"
					className={styles.container}
				>
					<Box display="flex" flexDirection="column" alignItems="center" mb={2}>
						<label htmlFor="profile_image" className={styles.formControlCustom}>
							上傳或更改圖片:
						</label>
						<img
							src={previewImage}
							alt="Profile Preview"
							style={{
								width: 400,
								height: 400,
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
					<Box display="flex" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
						<TextField
							label="標題"
							name="title"
							value={newsData.title}
							onChange={handleInputChange}
							className={styles.formControlCustom}
							fullWidth
						/>
						<FormControl fullWidth>
							<InputLabel>分類</InputLabel>
							<Select
								name="category"
								value={newsData.category}
								onChange={handleCategoryChange}
							>
								<MenuItem value="蛋糕">蛋糕</MenuItem>
								<MenuItem value="餅乾">餅乾</MenuItem>
								<MenuItem value="塔/派">塔/派</MenuItem>
								<MenuItem value="泡芙">泡芙</MenuItem>
								<MenuItem value="冰淇淋">冰淇淋</MenuItem>
								<MenuItem value="可麗露">可麗露</MenuItem>
								<MenuItem value="其他">其他</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="建立時間"
							name="date"
							value={newsData.date}
							onChange={handleInputChange}
							className={styles.formControlCustom}
							fullWidth
						/>
						{/* TinyMCE 編輯器 */}
						<label htmlFor="content" className={styles.formControlCustom}>
							內容
						</label>
						<Editor
							apiKey="cfug9ervjy63v3sj0voqw9d94ojiglomezxkdd4s5jr9owvu"
							value={newsData.content}
							onEditorChange={handleEditorChange}
							init={{
								height: 300,
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

						<FormControlLabel
							control={
								<Checkbox
									checked={newsData.valid}
									onChange={handleCheckboxChange}
									name="valid"
									color="primary"
									className={styles.formCheckInput}
								/>
							}
							label="有效"
							className={styles.formCheckLabel}
						/>
					</Box>

					<Box Box display="flex" justifyContent="center" mt={2}>
						<Button type="submit" variant="contained" className={styles.btnCustom}>
							儲存
						</Button>
					</Box>
				</form>
			</AdminLayout>
		</AdminThemeProvider>
		):(
			<div>Loading...</div>
		)}

		</>
	);
};

