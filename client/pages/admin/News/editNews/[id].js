import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TextField, FormControl, Box, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { Editor } from '@tinymce/tinymce-react';
import AdminLayout from '@/components/AdminLayout';
import AdminThemeProvider from '../../adminEdit';
import ExpandButton from '@/components/button/expand-button';
import styles from '@/styles/adminLesson.module.scss';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Directions } from '@mui/icons-material';

export default function EditNews(props) {
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState([]);
	const [type, setType] = useState([]);
	const [title, setTitle] = useState('');
	const [selectType, setSelectType] = useState(0); // 預設值設為空
	const [status, setStatus] = useState(1); // 預設值設為1
	const [time, setTime] = useState(''); // 預設值設為空
	const [selectedImage, setSelectedImage] = useState(null); // 用於保存選中的新照片
	const [previewImage, setPreviewImage] = useState(''); // 預覽照片

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

	const handleEdit = (e) => {
		const file = e.target.files[0];

		if (file) {
			setSelectedImage(file);
			setPreviewImage(URL.createObjectURL(file)); // 創建預覽URL
		}
	};

	// 圖片上傳與預覽
	const handleUpload = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('photo', selectedImage);
		axios
			.post(`http://localhost:3005/api/news/admin/upload/${id}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res) => console.log('更新照片成功'))
			.catch((error) => console.error('更新照片失敗', error));
	};

	// 時間選擇
	const handleTime = (event) => {
		setTime(event.target.value);
	};

	// swal樣式
	const swalBtnEdit = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-success ms-2',
			cancelButton: 'btn btn-danger',
		},
		buttonsStyling: false,
	});

	// 提交表單
	const handleSubmit = (e) => {
		console.log('提交表單');
		e.preventDefault(); // 防止頁面刷新
		const formData = {
			selectType,
			title,
			status,
			time,
			content: editorRef.current?.getContent(),
		};
		swalBtnEdit
			.fire({
				title: '確定要修改嗎?',
				text: '真的確定好了嗎?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '我確定',
				cancelButtonText: '不要好了',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					axios
						.post(`http://localhost:3005/api/news/admin/update/${id}`, formData)
						.then((res) => {
							swalBtnEdit.fire('更新成功', '就跟新的一樣', 'success');
							router.push(`/admin/News`);
							console.error('更新成功');
						})
						.catch((error) => {
							console.error('刪除失敗', error);
							swalBtn.fire('更新失敗', '請再試一次', 'error');
						});
				}
			});
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/news/admin/${id}`)
			.then((res) => setData(res.data))
			.catch((error) => console.error('拿不到文章細節資料', error));
	}, [id]);

	// 初次加載時從 API 獲取資料
	useEffect(() => {
		axios
			.get(`http://localhost:3005/api/news/type`)
			.then((res) => setType(res.data))
			.catch((error) => console.error('沒有分類資料', error));
	}, []);

	useEffect(() => {
		if (data.news && data.news.length > 0) {
			setTitle(data.news[0].title);
			setSelectType(data.type[0].id);
			setStatus(data.news[0].activation);
			setTime(data.news[0].createdAt);
		}
	}, [data]);

	return (
		<>
			{data.news ? (
				<AdminThemeProvider>
					<AdminLayout>
						<Link
							href="../"
							style={{ position: 'relative', top: '40px', left: '50px' }}
						>
							<ExpandButton value="返回列表頁" />
						</Link>
						{data.news.length > 0 ? (
							<div className="container">
								<form
									onSubmit={handleSubmit}
									encType="multipart/form-data"
									className="row"
								>
									<div className="col-6 text-center my-auto">
										<Image
											src={
												previewImage ||
												`/photos/articles/${data.news[0]?.img_path}`
											}
											width={450}
											height={350}
											className="m-auto"
											style={{ objectFit: 'cover', borderRadius: '25px' }}
										/>
										<div className="d-flex flex-row justify-content-center mt-3">
											<Button
												variant="contained"
												className="m-2"
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
													onChange={handleEdit}
												/>
												更新照片
											</Button>
											<Button
												variant="contained"
												className="m-2"
												component="label"
												onClick={handleUpload}
												sx={{
													color: '#FFF',
													background: '#fe6f67',
												}}
											>
												確認上傳
											</Button>
										</div>
									</div>

									<Box
										display="grid"
										gridTemplateColumns="1fr 1fr"
										gap={2}
										m={2}
										className="col-6 d-flex flex-column m-0"
									>
										<TextField
											label="標題"
											name="title"
											value={title}
											className={styles.formControlCustom}
											fullWidth
											size="small"
											onChange={(e) => setTitle(e.target.value)} // 更新資料
										/>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">
												分類
											</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={
													selectType == '' ? data.type[0].id : selectType
												}
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
										<div
											className={`${styles['CTH-timePicker']} d-flex flex-column`}
										>
											<h5>時間</h5>
											<input
												type="datetime-local"
												className={styles['CTH-input']}
												name="updateTime"
												placeholder={data.news[0].createdAt}
												value={time == '' ? data.news[0].updateAt : time} // 預設值設為空
												onChange={handleTime}
											/>
										</div>
										<div className="d-flex flex-column mt-2">
											<FormControl fullWidth>
												<InputLabel id="demo-simple-select-label">
													狀態
												</InputLabel>
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
										<div className="d-flex flex-column">
											{/* TinyMCE 編輯器 */}
											<h2 className="text-center">文章內容</h2>
											<Editor
												apiKey="08lu45kwsffp8o0hqpn60voxy01adtr3qkbm7hluhxxpwhek"
												onInit={(evt, editor) =>
													(editorRef.current = editor)
												}
												initialValue={data.news[0].content}
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
															width: '100px',
														}}
													>
														儲存
													</Button>
												</Link>
											</div>
										</div>
									</Box>
								</form>
							</div>
						) : (
							''
						)}
					</AdminLayout>
				</AdminThemeProvider>
			) : (
				''
			)}
		</>
	);
}
