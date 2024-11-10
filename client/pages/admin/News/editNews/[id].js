import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/router';
import { Editor } from '@tinymce/tinymce-react';
import AdminLayout from '@/components/AdminLayout';
import AdminThemeProvider from './adminEdit'; // 引入 AdminThemeProvider
import styles from '../../components/ElementList/ElementList.module.scss'; // 確認樣式檔已正確引入

export default function EditNews(props) {
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

const EditNews = ({ newsId, onSubmit, onCancel }) => {
	const [newsData, setNewsData] = useState(initialNewsData);
	const [previewImage, setPreviewImage] = useState(initialNewsData.imgSrc);
	const router = useRouter();

	useEffect(() => {
		if (newsId) {
			setNewsData({
				...initialNewsData,
				title: '美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味',
				category: '蛋糕',
				date: '2024-08-16 14:50',
				content: '偷偷告訴你檸檬塔的秘密',
				valid: true,
				imgSrc: '/photos/articles/lemonMeringueTart.jpg',
			});
			setPreviewImage('/photos/articles/lemonMeringueTart.jpg');
		}
	}, [newsId]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewsData({ ...newsData, [name]: value });
	};

	// 勾勾BOX
	const handleCheckboxChange = (e) => {
		setNewsData({ ...newsData, valid: e.target.checked });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
			setNewsData({ ...newsData, imgSrc: file });
		}
	};

	// 選單
	const handleCategoryChange = (event) => {
		setNewsData({ ...newsData, category: event.target.value });
	};

	// 所見即所得
	const handleEditorChange = (content) => {
		setNewsData({ ...newsData, content });
	};

	// 提交
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(newsData);
		console.log('提交的文章資訊:', newsData);
		router.push('/admin/News');
	};

	return (
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
					<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
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
							apiKey="08lu45kwsffp8o0hqpn60voxy01adtr3qkbm7hluhxxpwhek"
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
	);
}