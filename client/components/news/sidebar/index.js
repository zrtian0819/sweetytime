import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function SidebarNews(props) {
	return (
		<>
			<div
				className={`${styles['LYT-sidebar']} d-flex justify-content-evenly align-items-center mb-2`}
			>
				<div className={`${styles['LYT-time-box']} time-box text-center me-2`}>
					<h4>蛋糕</h4>
				</div>
				<div className={`${styles['LYT-class-box']} class-box text-center`}>
					<h4>蒙布朗蛋糕</h4>
					<h4>NTD 1500</h4>
				</div>
				<button className="btn">
					<FontAwesomeIcon icon={faArrowRight} size="2x" />
				</button>
			</div>
		</>
	);
}
