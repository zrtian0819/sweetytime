import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

export default function Tags(props) {
	return (
		<>
			<div className="tags d-flex gap-3 justify-content-center m-3">
				<div className="">熱門搜尋：</div>
				<div className={`${styles['CTH-tag']} ${styles['active']} `}>抹茶</div>
				<div className={styles['CTH-tag']}>巧克力</div>
				<div className={styles['CTH-tag']}>香草</div>
				<div className={styles['CTH-tag']}>馬卡龍</div>
				<div className={styles['CTH-tag']}>可麗露</div>
			</div>
		</>
	);
}
