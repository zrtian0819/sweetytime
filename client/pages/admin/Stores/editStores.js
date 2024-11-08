import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '@/styles/adminShop.module.scss';
import AdminThemeProvider from '../adminEdit';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const initialstoresData = {
	name: '',
	description: '',
	expertise: '',
	experience: '',
	education: '',
	licence: '',
	awards: '',
	valid: false,
	imgSrc: '/photos/shop_logo/Aposo_logo.png',
};
export default function EditLesson() {
	const [status, setStatus] = useState(0);
	const [storesData, setStoresData] = useState(initialstoresData);
	const [previewImage, setPreviewImage] = useState(initialstoresData.imgSrc);
	const editorRef = useRef(null);

	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};

	//處理上傳後預覽
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
			setStoresData({ ...storesData, imgSrc: file });
		}
	};

	return (
		<>
			<AdminThemeProvider>
				<AdminLayout>
					<div className="container">
						<div className="row ">
							<div className="col-6 d-flex flex-column p-0 m-auto">
								<Box
									display="flex"
									flexDirection="column"
									alignItems="center"
									mb={2}
									className={styles['class-info']}
								>
									<Image
										src={previewImage}
										alt="Profile Preview"
										width={400}
										height={400}
										style={{ objectFit: 'contain' }}
									/>

									<label className={styles.customFileUpload}>
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
							</div>
							<Box
								display="grid"
								gridTemplateColumns="1fr 1fr"
								gap={2}
								m={2}
								className=" col-6 d-flex flex-column mx-0 my-3 p-0"
							>
								<TextField
									label="店家名稱"
									name="name"
									value={'栗子蛋糕'}
									className={styles.formControlCustom}
									fullWidth
									size="medium"
								/>

								<TextField
									label="電話"
									name="phone"
									value={'09'}
									className={styles.formControlCustom}
									fullWidth
									size="medium"
								/>

								<TextField
									label="地址"
									name="location"
									value={'台北市'}
									className={styles.formControlCustom}
									fullWidth
									size="medium"
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
										<MenuItem value={0}>啟用中</MenuItem>
										<MenuItem value={1}>停用中</MenuItem>
									</Select>
								</FormControl>

								<div className={`${styles['class-info']} d-flex flex-column gap-2`}>
									<h4 className="pt-2">店家簡介</h4>
									<Editor
										apiKey="cfug9ervjy63v3sj0voqw9d94ojiglomezxkdd4s5jr9owvu"
										onInit={(evt, editor) => (editorRef.current = editor)}
										initialValue="<p>輸入內容...</p>"
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
									<Link href={'./viewStores'} className="ms-auto mt-2">
										<Button
											variant="contained"
											sx={{
												color: '#fff',
												background: '#fe6f67',
											}}
										>
											完成編輯
										</Button>
									</Link>
								</div>
							</Box>
						</div>
					</div>
				</AdminLayout>
			</AdminThemeProvider>
		</>
	);
}
