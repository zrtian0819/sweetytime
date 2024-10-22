import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Banner(props) {
	return (
		<>
			<div className={Styles['CTH-banner']}>
				<div className={Styles['banner-left']}>
					<Image
						src={'/photos/lesson/00_cake_chestnut.png'}
						width={400}
						height={300}
						alt=""
						className={Styles['image']}
					/>
				</div>
				<div className={Styles['banner-right']}>
					<div>本月精選課程</div>
					<div className={Styles['content']}>
						<div>蒙布朗栗子蛋糕</div>
						<button className="btn">
							<FontAwesomeIcon icon={faArrowRight} size="2x" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
