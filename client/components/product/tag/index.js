import React, { useState } from 'react';
import styles from './index.module.scss';

export default function Tags({ setFilterCriteria }) {
	const [activeTags, setActiveTags] = useState([false, false, false, false, false]);

	const handleClick = (index, tagText) => {
		// const updatedTags = activeTags.map((isActive, i) => (i === index ? !isActive : isActive));
		const updatedTags = Array.from({ length: activeTags.length }, (_, i) => i === index);
		setActiveTags(updatedTags);
		setFilterCriteria((prevCriteria) => ({
			...prevCriteria,
			search: tagText,
		}));
	};

	return (
		<div
			className={`${styles['tags']} d-none d-md-flex gap-3 justify-content-center m-3 flex-wrap`}
		>
			<div>熱門搜尋：</div>
			<div
				className={`${styles['tag']} ${activeTags[0] ? styles.active : ''}`}
				onClick={(event) => handleClick(0, '抹茶')}
			>
				抹茶
			</div>
			<div
				className={`${styles['tag']} ${activeTags[1] ? styles.active : ''}`}
				onClick={(event) => handleClick(1, '巧克力')}
			>
				巧克力
			</div>
			<div
				className={`${styles['tag']} ${activeTags[2] ? styles.active : ''}`}
				onClick={(event) => handleClick(2, '香草')}
			>
				香草
			</div>
			<div
				className={`${styles['tag']} ${activeTags[3] ? styles.active : ''}`}
				onClick={(event) => handleClick(3, '馬卡龍')}
			>
				馬卡龍
			</div>
			<div
				className={`${styles['tag']} ${activeTags[4] ? styles.active : ''}`}
				onClick={(event) => handleClick(4, '可麗露')}
			>
				可麗露
			</div>
		</div>
	);
}
