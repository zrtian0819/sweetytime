import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function LessonCard(props) {
	return (
		<>
			<div className={`${Styles['CTH-card']} card m-3`}>
				<div className={`${Styles['CTH-card-top']}`}>
					<Image
						src={'/photos/lesson/28_cake_nuts.jpg'}
						width={200}
						height={200}
						className={Styles['CTH-lesson-card-img']}
					/>

					<FontAwesomeIcon
						icon={faHeart}
						size="2x"
						className={Styles['CTH-lesson-card-icon']}
					/>
				</div>
				<div className={`${Styles['CTH-card-body']} card-body`}>
					<div className="card-body-left">
						<h4>蒙布朗栗子蛋糕</h4>
						<p>2024/10/5(日)</p>
						<h4>NTD 1500</h4>
					</div>
					<div className={`${Styles['CTH-card-body-right']} ms-auto`}>
						<button className="btn">
							<FontAwesomeIcon icon={faArrowRight} />
							看更多
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
