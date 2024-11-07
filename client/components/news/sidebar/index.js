import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function SidebarNews({
	id = 1,
	title = '美味料理食譜：經典法式甜點！檸檬萊姆塔的酸甜滋味',
	product_class_id = '蛋糕',
}) {
	return (
		<>
			<div className={`container ${styles['LYT-sm-lesson']}`}>
				<div
					className={`col-3 ${styles['LYT-sidebar-news']} d-flex justify-content-evenly align-items-center mb-2`}
				>
					<div className={`${styles['LYT-time-box']} time-box text-center me-2`}>
						<h4>{product_class_id}</h4>
					</div>
					<div className={`${styles['LYT-class-box']} class-box text-center me-2`}>
						<h4>{title}</h4>
					</div>
					<div className="col-1 ZRT-center">
						<Link href={`/news/${id}`}>
							<button className="btn">
								<FontAwesomeIcon icon={faArrowRight} size="2x" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
