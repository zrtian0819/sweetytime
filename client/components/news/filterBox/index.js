import React, { useState } from 'react';
import styles from './index.module.scss';
import { IoIosSearch } from 'react-icons/io';
import { FormControl, Select, MenuItem } from '@mui/material';

export default function FilterBox({ news, onFilter }) {
	// 將 news 和 onFilter 作為 props 傳入
	const [keywords, setKeywords] = useState('');
	const [type, setType] = useState(0);
	const [sort, setSort] = useState('');

	const handleChangeType = (event) => {
		setType(event.target.value);
	};

	const handleChangeSort = (event) => {
		setSort(event.target.value);
	};

	const handleKeywords = (event) => {
		setKeywords(event.target.value);
	};

	const submit = () => {
		let filter = [...news];
		if (keywords) {
			filter = filter.filter((data) => data.title.includes(keywords));
		}
		if (type !== 0) {
			filter = filter.filter((data) => data.product_class_id === type);
		}
		if (sort != '') {
			switch (sort) {
				case 'timeClose':
					filter.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
					break;
				case 'timeFar':
					filter.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
					break;
			}
		}
		onFilter(filter); // 將過濾後的結果傳遞回主組件
	};

	return (
		<div
			className={`${styles['filter']} d-none d-md-flex justify-content-center gap-2 flex-wrap align-items-center my-4`}
		>
			<div
				className={`${styles['filter-part1']} filter-box justify-content-center gap-2 flex-wrap align-items-center my-1`}
			>
				{/* 搜尋關鍵字 */}
				<input
					type="text"
					className={`${styles['filter-keywords']}`}
					placeholder="輸入關鍵字, 尋找更多有趣的文章"
					value={keywords}
					onChange={handleKeywords}
				/>
				<FormControl sx={{ width: 181, height: '100%' }}>
					{/* 類別 */}
					<Select
						value={type}
						onChange={handleChangeType}
						displayEmpty
						sx={{
							backgroundColor: '#ffffff',
							height: '100%',
							color: '#fe6f67',
							borderRadius: '30px',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67',
							},
						}}
					>
						<MenuItem value={0}>分類</MenuItem>
						<MenuItem value={1}>蛋糕</MenuItem>
						<MenuItem value={2}>餅乾</MenuItem>
						<MenuItem value={3}>塔/派</MenuItem>
						<MenuItem value={4}>泡芙</MenuItem>
						<MenuItem value={5}>冰淇淋</MenuItem>
						<MenuItem value={6}>其他</MenuItem>
						<MenuItem value={7}>可麗露</MenuItem>
					</Select>
				</FormControl>
			</div>
			<div
				className={`${styles['filter-part2']} filter-box d-flex gap-2 align-items-center my-1`}
			>
				<FormControl sx={{ width: 181, height: '100%' }}>
					{/* 排序 */}
					<Select
						value={sort}
						onChange={handleChangeSort}
						displayEmpty
						sx={{
							background: '#ffffff',
							color: '#fe6f67',
							height: '100%',
							borderRadius: '30px',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: '#fe6f67',
							},
						}}
					>
						<MenuItem value="">排序</MenuItem>
						<MenuItem value="timeClose">建立時間近到遠</MenuItem>
						<MenuItem value="timeFar">建立時間遠到近</MenuItem>
					</Select>
				</FormControl>
				<div className="flex-wrap">
					<button className={styles['filter-search']} onClick={submit}>
						<IoIosSearch className={styles['filter-search-icon']} />
					</button>
				</div>
			</div>
		</div>
	);
}
