import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/adminLesson.module.scss';
import AdminThemeProvider from '../adminEdit';
import ReturnBtn from '@/components/button/expand-button';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
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
	const [selectedDetailImage, setSelectedDetailImage] = useState([]); // 用於保存選中的新照片
	const [previewDetailImage, setPreviewDetailImage] = useState([]); // 預覽照片

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

	const handleUploadDetail = (e) => {
		e.preventDefault();
		const files = e.target.files;
		if (files) {
			const updatedPre = [...previewDetailImage];
			const updateImg = [...selectedDetailImage];
			for (let i = 0; i < files.length; i++) {
				updatedPre.push(URL.createObjectURL(files[i]));
				updateImg.push(files[i]);
			}
			setPreviewDetailImage(updatedPre);
			setSelectedDetailImage(updateImg);
		}
	};

	console.log(previewDetailImage);
	console.log('照片物件', selectedDetailImage);

	const handleTime = (event) => {
		setTime(event.target.value);
	};

	const handleSubmit = async (e) => {
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

		const lesson = await axios.post('http://localhost:3005/api/lesson/admin/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		const lessonId = lesson.data.lessonId;
		console.log('課程新增成功，課程 ID:', lessonId);
		const photoData = new FormData();
		selectedDetailImage.forEach((photo) => {
			photoData.append('photos', photo);
		});

		try {
			const res = await axios.post(
				`http://localhost:3005/api/lesson/admin/uploadDetail/${lessonId}`,
				photoData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			await new Swal('已成功新增');
			router.push(`http://localhost:3000/admin/Lessons`);
		} catch (error) {
			console.error('更新細節照片失敗', error);
			new Swal('新增失敗，請重試', 'error');
		}
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
					<div className={`${styles['CTH-overflow']} container`}>
						<Box>
							<Link href="/admin/Lessons" passHref>
								<ReturnBtn value="返回課程列表" />
							</Link>
						</Box>
						<form onSubmit={handleSubmit}>
							<div className="d-flex flex-column">
								<Image
									src={
										previewImage == ''
											? '/photos/ImgNotFound.png'
											: previewImage
									}
									width={350}
									height={350}
									className="m-auto"
									style={{ objectFit: 'contain', borderRadius: '25px' }}
								/>

								<Button
									variant="contained"
									className="m-auto mt-2 mb-2"
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
									上傳封面照片
								</Button>
							</div>
							<div className="d-flex flex-column">
								<div className={`${styles['CTH-photo-area']}`}>
									{previewDetailImage.length > 0 ? (
										<>
											{previewDetailImage.map((photo) => {
												return (
													<Image
														src={
															photo == ''
																? '/photos/ImgNotFound.png'
																: photo
														}
														width={200}
														height={200}
														className="me-2"
														style={{
															objectFit: 'cover',
															borderRadius: '25px',
														}}
													/>
												);
											})}
										</>
									) : (
										'請上傳照片'
									)}
								</div>
								<div className="align-self-center">
									<Button
										variant="contained"
										className="m-auto mt-2 mb-2"
										component="label"
										sx={{
											color: '#FFF',
											background: '#fe6f67',
										}}
									>
										<input
											type="file"
											hidden
											multiple
											accept="image/*"
											onChange={handleUploadDetail}
										/>
										上傳細節照片
									</Button>
								</div>
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
								{/* <Editor
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
								/> */}

								<Button
									variant="contained"
									onClick={handleSubmit}
									sx={{
										color: '#fff',
										background: '#fe6f67',
									}}
									className="ms-auto mt-2"
								>
									完成
								</Button>
							</div>
						</form>
					</div>
				</AdminLayout>
			</AdminThemeProvider>
		</>
	);
}
