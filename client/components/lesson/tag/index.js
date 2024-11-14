import React, { useState } from 'react';
import styles from './index.module.scss';

export default function Tags({ lesson, onFilter }) {
	const [activeTags, setActiveTags] = useState([false, false, false, false, false]);
	console.log(lesson);

	const handleClick = (e, index) => {
		if (activeTags[index]) {
			setActiveTags(activeTags.map(() => false));
			onFilter(lesson);
		} else {
			// 否則僅選中當前點擊的標籤
			const updatedTags = activeTags.map((_, i) => i === index);
			const name = e.currentTarget.getAttribute('name');
			console.log(name);
			const result = lesson.filter(
				(data) => data.name.includes(name) || data.description.includes(name)
			);
			setActiveTags(updatedTags);
			onFilter(result);
		}
	};

	return (
		<div className="tags d-flex gap-3 justify-content-center m-3 flex-wrap">
			<div>熱門搜尋：</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[0] ? styles.active : ''}`}
				name={'抹茶'}
				onClick={(e) => handleClick(e, 0)}
			>
				抹茶
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[1] ? styles.active : ''}`}
				onClick={(e) => handleClick(e, 1)}
				name={'巧克力'}
			>
				巧克力
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[2] ? styles.active : ''}`}
				onClick={(e) => handleClick(e, 2)}
				name={'香草'}
			>
				香草
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[3] ? styles.active : ''}`}
				onClick={(e) => handleClick(e, 3)}
				name={'馬卡龍'}
			>
				馬卡龍
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[4] ? styles.active : ''}`}
				onClick={(e) => handleClick(e, 4)}
				name={'可麗露'}
			>
				可麗露
			</div>
		</div>
	);
}
