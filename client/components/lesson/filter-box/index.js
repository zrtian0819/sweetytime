import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

export default function FilterBox(props) {
	const [rangeValue, setRangeValue] = useState(0);
	const handleChange = (event) => {
		setRangeValue(event.target.value);
	};
	return (
		<>
			<div className="filter-box d-flex justify-content-center gap-5 flex-wrap">
				<input
					type="text"
					className={`${styles['CTH-keywords']}`}
					id="keywords"
					placeholder="關鍵字"
				/>
				<select name="type" id="type" className={`${styles['CTH-type']}`}>
					<option value="">類別</option>
					<option value="cake">蛋糕</option>
					<option value="cookies">餅乾</option>
					<option value="tart">塔/派</option>
					<option value="puff">泡芙</option>
					<option value="icecream">冰淇淋</option>
					<option value="cannele">可麗露</option>
					<option value="else">其他</option>
				</select>
				<select name="sort" id="sort" className={styles['CTH-sort']}>
					<option value="">排序</option>
					<option value="time1">開課時間近到遠</option>
					<option value="time2">開課時間遠到近</option>
					<option value="people1">報名人數少到多</option>
					<option value="people2">報名人數多到少</option>
					<option value="price1">價錢便宜到貴</option>
					<option value="price2">價錢貴到便宜</option>
				</select>
				<div>
					<input
						type="range"
						min="0"
						max="5000"
						id="range"
						className={styles['CTH-range']}
						value={rangeValue}
						onChange={handleChange}
					/>
					<label>{rangeValue}</label>
				</div>
				<div className="discount">
					<input type="radio" id="discount" />
					<label>優惠</label>
				</div>
				<div className="search">🔍</div>
			</div>
		</>
	);
}
