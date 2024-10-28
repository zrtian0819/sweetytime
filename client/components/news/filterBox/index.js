import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faCalendar } from '@fortawesome/free-solid-svg-icons';

import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	Box,
	Radio,
	FormControlLabel,
} from '@mui/material';

import Checkbox from '@mui/material/Checkbox';

function valuetext(value) {
	return `${value}°C`;
}

export default function FilterBox(props) {
	const [type, setType] = useState(0);
	const [sort, setSort] = useState('none');
	const [value, setValue] = useState([0, 1000]);

	const handleChangeType = (event) => {
		setType(event.target.value);
	};

	const handleChangeSort = (event) => {
		setSort(event.target.value);
	};

	const handleChangeValue = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<div className="filter-box d-md-flex justify-content-center gap-5 flex-wrap align-items-center my-5 d-none">
				<input
					type="text"
					className={`${styles['CTH-keywords']}`}
					id="keywords"
					placeholder="關鍵字"
				/>
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel
						id="demo-simple-select-label"
						sx={{
							color: '#fe6f67',
							'&.Mui-focused': {
								color: '#fe6f67', // 聚焦時的外框顏色
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
							color: '#fe6f67',
							borderRadius: '30px',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67', // 預設外框顏色
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67', // 滑鼠懸停外框顏色
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								minWidth: 120,
								borderColor: '#fe6f67', // 聚焦時的外框顏色
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
							color: '#fe6f67',
							'&.Mui-focused': {
								color: '#fe6f67', // 聚焦時的外框顏色
							},
						}}
					>
						排序
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={sort}
						label="sort"
						onChange={handleChangeSort}
						sx={{
							color: '#fe6f67',
							borderRadius: '30px',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67', // 預設外框顏色
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67', // 滑鼠懸停外框顏色
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								minWidth: 120,
								borderColor: '#fe6f67', // 聚焦時的外框顏色
							},
						}}
					>
						<MenuItem value={'timeClose'} sx={{ color: '#fe6f67' }}>
							建立時間最近到最遠
						</MenuItem>
						<MenuItem value={'timeFar'} sx={{ color: '#fe6f67' }}>
							建立時間最遠到最近
						</MenuItem>
						
					</Select>
				</FormControl>
				
				
				<button className={styles['TIL-search']}>
					<FontAwesomeIcon icon={faMagnifyingGlass} className={styles['TIL-icon']} />
				</button>
			</div>
			<div className="filter-box d-flex d-md-none justify-content-center gap-3">
				<input
					type="text"
					className={`${styles['CTH-keywords']}`}
					id="keywords"
					placeholder="搜尋文章"
				/>
				<button className={styles['CTH-search']}>
					<FontAwesomeIcon icon={faFilter} className={styles['CTH-icon']} />
				</button>
				<button className={styles['CTH-calendar']}>
					<FontAwesomeIcon icon={faCalendar} className={styles['CTH-icon']} />
				</button>
			</div>
		</>
	);
}
