import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function SmLesson(props) {
	return (
		<>
			<div
				className={`${styles['CTH-sm-lesson']} d-flex justify-content-evenly align-items-center mb-2`}
			>
				<div className={`${styles['CTH-time-box']} time-box text-center me-2`}>
					<h4>十月</h4>
					<h5>05</h5>
					<h5>(日)</h5>
				</div>
				<div className={`${styles['CTH-class-box']} class-box text-center`}>
					<h4>蒙布朗蛋糕</h4>
					<h4>NTD 1500</h4>
				</div>
				<button className="btn">
					<FaArrowRightLong size={30} />
				</button>
			</div>
		</>
	);
}
