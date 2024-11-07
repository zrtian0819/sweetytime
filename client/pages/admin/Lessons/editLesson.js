import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '@/styles/adminLesson.module.scss';
import AdminThemeProvider from '../adminEdit';

import { Editor } from '@tinymce/tinymce-react';

export default function EditLesson(props) {
	const mainColor = '#fe6f67';
	const [type, setType] = useState(0);
	const [teacher, setTeacher] = useState(0);
	const [status, setStatus] = useState(0);
	const [edit, setEdit] = useState(false);
	const [time, setTime] = useState(0);

	const editorRef = useRef(null);
	const handleChangeType = (event) => {
		setType(event.target.value);
	};
	const handleChangeTea = (event) => {
		setTeacher(event.target.value);
	};
	const handleChangeSta = (event) => {
		setStatus(event.target.value);
	};
	const handleEdit = () => {
		setEdit(!edit);
	};
	const handleTime = (event) => {
		setTime(event.target.value);
	};

	return (
		<>
			<AdminThemeProvider>
				<AdminLayout>
					<div className="container">
						<div className="d-flex flex-column">
							<Image
								src={'/photos/shop_logo/Aposo_logo.png'}
								width={250}
								height={250}
								className="m-auto"
							/>
							<Button
								variant="contained"
								className="my-2 m-auto"
								sx={{
									color: '#FFF',
									background: '#fe6f67',
								}}
								onClick={handleEdit}
							>
								更新照片
							</Button>
						</div>

						<Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} m={2}>
							<TextField
								label="標題"
								name="name"
								value={'栗子蛋糕'}
								className={styles.formControlCustom}
								fullWidth
								size="small"
							/>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">類別</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={type}
									label="type"
									onChange={handleChangeType}
									size="small"
								>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">講師</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={teacher}
									label="teacher"
									onChange={handleChangeTea}
									size="small"
								>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label="價錢"
								name="price"
								value={3000}
								className={styles.formControlCustom}
								fullWidth
								size="small"
							/>
							<div className={styles['CTH-timePicker']}>
								<h5>時間</h5>
								<input
									type="datetime-local"
									class={styles['CTH-input']}
									name="updateTime"
									value={time}
									onChange={handleTime}
								/>
							</div>
							<TextField
								label="地點"
								name="classroom"
								value={'教室'}
								className={styles.formControlCustom}
								fullWidth
								size="small"
							/>
							<TextField
								label="地址"
								name="location"
								value={'桃園市'}
								className={styles.formControlCustom}
								fullWidth
								size="small"
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
									<MenuItem value={0}>上架中</MenuItem>
									<MenuItem value={1}>下架</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<div className={`${styles['CTH-class-info']} d-flex flex-column`}>
							<h2 className="pt-2">課程介紹</h2>
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
							<Link href={'./viewLesson'} className="ms-auto mt-2">
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
					</div>
				</AdminLayout>
			</AdminThemeProvider>
		</>
	);
}
