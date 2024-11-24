import React, { useState } from 'react';
import styles from './index.module.scss';

export default function Tags({ filterCriteria, setFilterCriteria, setTriggerFetch }) {
	// const [activeTags, setActiveTags] = useState([false, false, false, false, false]);

	const handleClick = (tagText) => {
		// const updatedTags = activeTags.map((isActive, i) => (i === index ? !isActive : isActive));
		// const updatedTags = Array.from({ length: activeTags.length }, (_, i) => i === index);
		// setActiveTags(updatedTags);
		if (tagText === filterCriteria.search) {
			setFilterCriteria((prevCriteria) => ({
				...prevCriteria,
				search: '',
			}));
			setTriggerFetch(true);
		} else {
			setFilterCriteria((prevCriteria) => ({
				...prevCriteria,
				search: tagText,
			}));
			setTriggerFetch(true);
		}
	};

	return (
		<div
			className={`${styles['tags']} d-none d-md-flex gap-3 justify-content-center m-3 flex-wrap`}
		>
			<div>熱門搜尋：</div>
			<div
				className={`${styles['tag']} ${
					filterCriteria?.search == '抹茶' ? styles.active : ''
				}`}
				onClick={(event) => handleClick('抹茶')}
			>
				抹茶
			</div>
			<div
				className={`${styles['tag']} ${
					filterCriteria?.search == '巧克力' ? styles.active : ''
				}`}
				onClick={(event) => handleClick('巧克力')}
			>
				巧克力
			</div>
			<div
				className={`${styles['tag']} ${
					filterCriteria?.search == '香草' ? styles.active : ''
				}`}
				onClick={(event) => handleClick('香草')}
			>
				香草
			</div>
			<div
				className={`${styles['tag']} ${
					filterCriteria?.search == '馬卡龍' ? styles.active : ''
				}`}
				onClick={(event) => handleClick('馬卡龍')}
			>
				馬卡龍
			</div>
			<div
				className={`${styles['tag']} ${
					filterCriteria?.search == '可麗露' ? styles.active : ''
				}`}
				onClick={(event) => handleClick('可麗露')}
			>
				可麗露
			</div>
		</div>
	);
}
