import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminLesson.module.scss';
import AdminThemeProvider from '../adminEdit';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function AddLesson(props) {
	const router = useRouter();
	const [type, setType] = useState([]);
	const [selectType, setSelectType] = useState(0); // 預設值設為空
	const [selectTeacher, setSelectTeacher] = useState(0); // 預設值設為0
	const [teacher, setTeacher] = useState([]);
	const [status, setStatus] = useState(1); // 預設值設為0
	const [time, setTime] = useState(''); // 預設值設為空
	const [lessonName, setLessonName] = useState('');
	const [lessonPrice, setLessonPrice] = useState('');
	const [classroom, setClassroom] = useState('');
	const [location, setLocation] = useState('');
	const [quota, setQuota] = useState('');
	const [selectedImage, setSelectedImage] = useState(null); // 用於保存選中的新照片
	const [previewImage, setPreviewImage] = useState(''); // 預覽照片
	console.log(previewImage);

	const editorRef = useRef(null);
	const handleChangeType = (event) => {
		setSelectType(event.target.value);
	};
	const handleChangeTea = (event) => {
		setSelectTeacher(event.target.value);
	};
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

	const handleTime = (event) => {
		setTime(event.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault(); // 防止頁面刷新
		const formData = new FormData();
		formData.append('photo', selectedImage);
		formData.append('lessonName', lessonName);
		formData.append('selectType', selectType);
		formData.append('selectTeacher', selectTeacher);
		formData.append('lessonPrice', lessonPrice);
		formData.append('time', time);
		formData.append('classroom', classroom);
		formData.append('location', location);
		formData.append('status', status);
		formData.append('quota', quota);
		formData.append('description', editorRef.current?.getContent());
		axios
			.post('http://localhost:3005/api/lesson/admin/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res) => {
				console.log('新增成功');
				router.push(`/admin/Lessons`);
			})
			.catch((error) => console.error('新增失敗'));
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/teacher`)
			.then((res) => setTeacher(res.data))
			.catch((error) => console.error('拿不到講師資料', error));
	}, []);

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/lesson/type`)
			.then((res) => setType(res.data))
			.catch((error) => console.error('拿不到類別資料', error));
	}, []);

	return (
		<>
			<AdminThemeProvider>
				<AdminLayout>
					<div className="container">
						<form onSubmit={handleSubmit}>
							<div className="d-flex flex-column">
								<Image
									src={
										previewImage == ''
											? '/photos/ImgNotFound.png'
											: previewImage
									}
									width={450}
									height={350}
									className="m-auto"
									style={{ objectFit: 'contain', borderRadius: '25px' }}
								/>

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

							<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} m={2}>
								<TextField
									label="標題"
									name="name"
									value={lessonName}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setLessonName(e.target.value)} // 更新資料
								/>
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
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">講師</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={selectTeacher}
										label="teacher"
										onChange={handleChangeTea}
										size="small"
									>
										{teacher.map((tea, index) => (
											<MenuItem value={index + 1} key={index}>
												{tea.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									label="價錢"
									name="price"
									value={lessonPrice}
									className={styles.formControlCustom}
									onChange={(e) => setLessonPrice(e.target.value)} // 更新資料
									fullWidth
									size="small"
								/>
								<div className={styles['CTH-timePicker']}>
									<h5>時間</h5>
									<input
										type="datetime-local"
										className={styles['CTH-input']}
										name="updateTime"
										value={time} // 預設值設為空
										onChange={handleTime}
									/>
								</div>
								<TextField
									label="地點"
									name="classroom"
									value={classroom}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setClassroom(e.target.value)} // 更新資料
								/>
								<TextField
									label="地址"
									name="location"
									value={location}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setLocation(e.target.value)}
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
										<MenuItem value={1}>上架中</MenuItem>
										<MenuItem value={0}>下架</MenuItem>
									</Select>
								</FormControl>
								<TextField
									label="名額"
									name="quota"
									value={quota}
									className={styles.formControlCustom}
									fullWidth
									size="small"
									onChange={(e) => setQuota(e.target.value)}
								/>
							</Box>

							<div className={`${styles['CTH-class-info']} d-flex flex-column`}>
								<h2 className="pt-2">課程介紹</h2>
								<Editor
									apiKey="cfug9ervjy63v3sj0voqw9d94ojiglomezxkdd4s5jr9owvu"
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
								<Link href={`../Lessons`} className="ms-auto mt-2">
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
						</form>
					</div>
				</AdminLayout>
			</AdminThemeProvider>
		</>
	);
}
