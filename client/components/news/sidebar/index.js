import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { FaArrowRightLong } from 'react-icons/fa6';
import Link from 'next/link';

export default function Sidebar({ id = 1, title = '蒙布朗蛋糕', product_class = '蛋糕' }) {
	return (
		<>
			<div className={`container ${styles['LYT-sm-lesson']}`}>
				<div className="justify-content-around align-items-center">
					<div className=" text-start d-flex flex-column justify-content-center">
						<p>{title}</p>
					</div>
					<div className="ZRT-center">
						<Link href={`/news/${id}`}>
							<button className={styles['LYT-btn']}>
								<FaArrowRightLong size={30} />
								<span> </span>看更多
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
