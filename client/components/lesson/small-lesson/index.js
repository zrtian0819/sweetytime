import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function SmLesson(props) {
	return (
		<>
			<div
				className={`${styles['CTH-sm-lesson']} d-flex justify-content-between align-items-center`}
			>
				<div className={`${styles['CTH-time-box']} time-box text-center me-2`}>
					<div>十月</div>
					<div>05</div>
					<div>(日)</div>
				</div>
				<div className="text-center">
					<h4>蒙布朗蛋糕</h4>
					<h4>NTD 1500</h4>
				</div>
				<button className={styles['CTH-btn']}>
					<FaArrowRightLong size={30} />
				</button>
			</div>
		</>
	);
}
