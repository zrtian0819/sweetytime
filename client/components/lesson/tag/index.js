import React, { useState } from 'react';
import styles from './index.module.scss';

export default function Tags(props) {
	const [activeTags, setActiveTags] = useState([false, false, false, false, false]);

	const handleClick = (index) => {
		const updatedTags = activeTags.map((isActive, i) => (i === index ? !isActive : isActive));
		setActiveTags(updatedTags);
	};

	return (
		<div className="tags d-flex gap-3 justify-content-center m-3 flex-wrap">
			<div>熱門搜尋：</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[0] ? styles.active : ''}`}
				onClick={() => handleClick(0)}
			>
				抹茶
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[1] ? styles.active : ''}`}
				onClick={() => handleClick(1)}
			>
				巧克力
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[2] ? styles.active : ''}`}
				onClick={() => handleClick(2)}
			>
				香草
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[3] ? styles.active : ''}`}
				onClick={() => handleClick(3)}
			>
				馬卡龍
			</div>
			<div
				className={`${styles['CTH-tag']} ${activeTags[4] ? styles.active : ''}`}
				onClick={() => handleClick(4)}
			>
				可麗露
			</div>
		</div>
	);
}
