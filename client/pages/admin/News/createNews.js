import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminLesson.module.scss';
import AdminThemeProvider from '../adminEdit';
import ExpandButton from '@/components/button/expand-button';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function AddLesson(props) {
	const router = useRouter();
	const [type, setType] = useState([]);
	const [title, setTitle] = useState('');
	const [selectType, setSelectType] = useState(0); // 預設值設為空
	const [status, setStatus] = useState(1); // 預設值設為1
	const [time, setTime] = useState(''); // 預設值設為空
	const [selectedImage, setSelectedImage] = useState(null); // 用於保存選中的新照片
	const [previewImage, setPreviewImage] = useState(''); // 預覽照片
	console.log(previewImage);

	// 編輯器
	const editorRef = useRef(null);

	// 類別選擇變更
	const handleChangeType = (event) => {
		setSelectType(event.target.value);
	};

	// 狀態變更
	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};

	// 圖片上傳與預覽
	const handleUpload = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			setPreviewImage(URL.createObjectURL(file)); // 創建預覽URL
		}
	};

	// 時間選擇
	const handleTime = (event) => {
		setTime(event.target.value);
	};

	// 提交表單
	const handleSubmit = (e) => {
		e.preventDefault(); // 防止頁面刷新
		const formData = new FormData();
		formData.append('photo', selectedImage);
		formData.append('selectType', selectType);
		formData.append('title', title);
		formData.append('status', status);
		formData.append('time', time);
		formData.append('description', editorRef.current?.getContent());
		axios
			.post('http://localhost:3005/api/news/admin/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res) => {
				console.log('新增成功');
				router.push(`/admin/News`);
			})
			.catch((error) => console.error('新增失敗'));
	};

	// 初次加載時從 API 獲取資料
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/news/type`)
			.then((res) => setType(res.data))
			.catch((error) => console.error('沒有分類資料', error));
	}, []);

	return (
		<AdminThemeProvider>
			<AdminLayout>
				<Link href="../News" style={{ position: 'relative', top: '40px', left: '50px' }}>
					<ExpandButton value="返回列表頁" />
				</Link>
				<div className="container">
					<form onSubmit={handleSubmit} className="row">
						<div className="col-6 text-center my-auto">
							{/* 預覽圖片 */}
							<Image
								src={previewImage == '' ? '/photos/ImgNotFound.png' : previewImage}
								width={450}
								height={350}
								className="m-auto"
								style={{ objectFit: 'contain', borderRadius: '25px' }}
							/>
							<div className="d-flex flex-row justify-content-center mt-3">
								{/* 上傳圖片按鈕 */}
								<Button
									variant="contained"
									className="m-auto mt-2"
									component="label"
									sx={{
										color: '#FFF',
										background: '#fe6f67',
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
						</div>

						{/* 表單輸入 */}
						<Box
							display="grid"
							gridTemplateColumns="1fr 1fr"
							gap={2}
							m={2}
							className="col-6 d-flex flex-column m-0"
						>
							<TextField
								label="標題"
								className={styles.formControlCustom}
								value={title}
								fullWidth
								size="small"
								onChange={(e) => setTitle(e.target.value)} // 更新標題
							/>

							{/* 類別選擇 */}
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">類別</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={selectType}
									label="type"
									onChange={handleChangeType}
									size="small"
								>
									{type.map((name) => (
										<MenuItem value={name.id} key={name.id}>
											{name.class_name}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* 時間選擇 */}
							<div className={`${styles['CTH-timePicker']} d-flex flex-column`}>
								<h5>時間</h5>
								<input
									type="datetime-local"
									className={styles['CTH-input']}
									name="updateTime"
									value={time}
									onChange={handleTime}
								/>
							</div>
							<div className="d-flex flex-column mt-2">
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
										<MenuItem value={1}>上架中</MenuItem>
										<MenuItem value={0}>下架</MenuItem>
									</Select>
								</FormControl>
							</div>

							{/* 文章內文 */}
							<div className="d-flex flex-column">
								<h2 className="text-center">文章內文</h2>
								<Editor
									apiKey="08lu45kwsffp8o0hqpn60voxy01adtr3qkbm7hluhxxpwhek"
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
											'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
									}}
								/>
								<div className="mt-2">
									<Link
										href={`../admin/News`}
										className="ms-auto d-flex justify-content-center"
									>
										<Button
											variant="contained"
											onClick={handleSubmit}
											sx={{
												color: '#fff',
												background: '#fe6f67',
											}}
										>
											完成
										</Button>
									</Link>
								</div>
							</div>
						</Box>
					</form>
				</div>
			</AdminLayout>
		</AdminThemeProvider>
	);
}
