import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';
import Link from 'next/link';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import styles from '@/styles/adminLesson.module.scss';

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
			<AdminLayout>
				<TextField
					label="標題"
					id="outlined-size-normal"
					defaultValue="Normal"
					sx={{
						margin: '8px',
						width: '50%',
						'& .MuiOutlinedInput-root': {
							color: mainColor, // 輸入文字顏色
							borderRadius: '25px',
							'& fieldset': {
								borderColor: mainColor, // 預設邊框顏色
							},
							'&:hover fieldset': {
								borderColor: mainColor, // 滑鼠懸停時邊框顏色
							},
							'&.Mui-focused fieldset': {
								borderColor: mainColor, // 聚焦時邊框顏色
							},
						},
						'& .MuiInputLabel-root': {
							color: mainColor, // 預設標籤顏色
						},
						'& .MuiInputLabel-root.Mui-focused': {
							color: mainColor, // 聚焦時標籤顏色
						},
						'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
							borderColor: mainColor, // Notched outline 顏色
						},
						'& .MuiInput-underline:before': {
							borderBottomColor: mainColor, // 下劃線顏色
						},
					}}
				/>
				<div className="container">
					<div className="row">
						<div className="d-flex flex-column col-4">
							<Image
								src={'/photos/lesson/28_cake_nuts.jpg'}
								width={300}
								height={300}
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
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel
									id="demo-simple-select-label"
									sx={{
										color: mainColor,
										'&.Mui-focused': {
											color: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									類別
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={type}
									label="type"
									onChange={handleChangeType}
									sx={{
										color: mainColor,
										borderRadius: '30px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 預設外框顏色
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 滑鼠懸停外框顏色
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											minWidth: 120,
											borderColor: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									<MenuItem value={'cake'} sx={{ color: '#fe6f67' }}>
										蛋糕
									</MenuItem>
									<MenuItem value={'cookies'} sx={{ color: '#fe6f67' }}>
										餅乾
									</MenuItem>
									<MenuItem value={'tart'} sx={{ color: '#fe6f67' }}>
										塔/派
									</MenuItem>
									<MenuItem value={'puff'} sx={{ color: '#fe6f67' }}>
										泡芙
									</MenuItem>
									<MenuItem value={'icecream'} sx={{ color: '#fe6f67' }}>
										冰淇淋
									</MenuItem>
									<MenuItem value={'cannele'} sx={{ color: '#fe6f67' }}>
										可麗露
									</MenuItem>
									<MenuItem value={'else'} sx={{ color: '#fe6f67' }}>
										其他
									</MenuItem>
								</Select>
							</FormControl>
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel
									id="demo-simple-select-label"
									sx={{
										color: mainColor,
										'&.Mui-focused': {
											color: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									講師
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={teacher}
									label="teacher"
									onChange={handleChangeTea}
									sx={{
										color: mainColor,
										borderRadius: '30px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 預設外框顏色
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 滑鼠懸停外框顏色
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											minWidth: 120,
											borderColor: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									<MenuItem value={'cake'} sx={{ color: '#fe6f67' }}>
										Maggie
									</MenuItem>
									<MenuItem value={'cookies'} sx={{ color: '#fe6f67' }}>
										餅乾
									</MenuItem>
									<MenuItem value={'tart'} sx={{ color: '#fe6f67' }}>
										塔/派
									</MenuItem>
									<MenuItem value={'puff'} sx={{ color: '#fe6f67' }}>
										泡芙
									</MenuItem>
									<MenuItem value={'icecream'} sx={{ color: '#fe6f67' }}>
										冰淇淋
									</MenuItem>
									<MenuItem value={'cannele'} sx={{ color: '#fe6f67' }}>
										可麗露
									</MenuItem>
									<MenuItem value={'else'} sx={{ color: '#fe6f67' }}>
										其他
									</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label="價錢"
								id="outlined-size-normal"
								defaultValue="Normal"
								sx={{
									margin: '8px',
									'& .MuiOutlinedInput-root': {
										color: mainColor, // 輸入文字顏色
										borderRadius: '25px',
										'& fieldset': {
											borderColor: mainColor, // 預設邊框顏色
										},
										'&:hover fieldset': {
											borderColor: mainColor, // 滑鼠懸停時邊框顏色
										},
										'&.Mui-focused fieldset': {
											borderColor: mainColor, // 聚焦時邊框顏色
										},
									},
									'& .MuiInputLabel-root': {
										color: mainColor, // 預設標籤顏色
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: mainColor, // 聚焦時標籤顏色
									},
									'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
										borderColor: mainColor, // Notched outline 顏色
									},
									'& .MuiInput-underline:before': {
										borderBottomColor: mainColor, // 下劃線顏色
									},
								}}
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
								id="outlined-size-normal"
								defaultValue="Normal"
								sx={{
									margin: '8px',
									'& .MuiOutlinedInput-root': {
										color: mainColor, // 輸入文字顏色
										borderRadius: '25px',
										'& fieldset': {
											borderColor: mainColor, // 預設邊框顏色
										},
										'&:hover fieldset': {
											borderColor: mainColor, // 滑鼠懸停時邊框顏色
										},
										'&.Mui-focused fieldset': {
											borderColor: mainColor, // 聚焦時邊框顏色
										},
									},
									'& .MuiInputLabel-root': {
										color: mainColor, // 預設標籤顏色
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: mainColor, // 聚焦時標籤顏色
									},
									'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
										borderColor: mainColor, // Notched outline 顏色
									},
									'& .MuiInput-underline:before': {
										borderBottomColor: mainColor, // 下劃線顏色
									},
								}}
							/>
							<TextField
								label="地址"
								id="outlined-size-normal"
								defaultValue="Normal"
								sx={{
									margin: '8px',
									'& .MuiOutlinedInput-root': {
										color: mainColor, // 輸入文字顏色
										borderRadius: '25px',
										'& fieldset': {
											borderColor: mainColor, // 預設邊框顏色
										},
										'&:hover fieldset': {
											borderColor: mainColor, // 滑鼠懸停時邊框顏色
										},
										'&.Mui-focused fieldset': {
											borderColor: mainColor, // 聚焦時邊框顏色
										},
									},
									'& .MuiInputLabel-root': {
										color: mainColor, // 預設標籤顏色
									},
									'& .MuiInputLabel-root.Mui-focused': {
										color: mainColor, // 聚焦時標籤顏色
									},
									'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
										borderColor: mainColor, // Notched outline 顏色
									},
									'& .MuiInput-underline:before': {
										borderBottomColor: mainColor, // 下劃線顏色
									},
								}}
							/>
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<InputLabel
									id="demo-simple-select-label"
									sx={{
										color: mainColor,
										'&.Mui-focused': {
											color: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									狀態
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={status}
									label="status"
									onChange={handleChangeSta}
									sx={{
										color: '#fe6f67',
										borderRadius: '30px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 預設外框顏色
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: mainColor, // 滑鼠懸停外框顏色
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											minWidth: 120,
											borderColor: mainColor, // 聚焦時的外框顏色
										},
									}}
								>
									<MenuItem value={'on'} sx={{ color: '#fe6f67' }}>
										上架中
									</MenuItem>
									<MenuItem value={'off'} sx={{ color: '#fe6f67' }}>
										下架
									</MenuItem>
								</Select>
							</FormControl>
							<div className={styles['CTH-stu']}>報名人數：</div>
						</div>
						<div className="col-8">
							<h2 className="pt-2 pb-5">課程介紹</h2>
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
						</div>
						<Link href={'/admin/viewLesson'} className="ms-auto col-auto">
							<Button
								variant="contained"
								sx={{
									color: mainColor,
									background: '#fe6f67',
									marginRight: '8px',
								}}
							>
								完成編輯
							</Button>
						</Link>
					</div>
				</div>
			</AdminLayout>
		</>
	);
}
