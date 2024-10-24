import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function NewsCard(props) {
	return (
		<>
			<div className={`${Styles['LYT-card']} card`}>
				<div className={`${Styles['LYT-card-top']}`}>
					<Image
						src={'/photos/articles/applePie.jpg'}
						width={200}
						height={200}
						className={Styles['LYT-lesson-card-img']}
					/>

					<FontAwesomeIcon
						icon={faHeart}
						size="2x"
						className={Styles['LYT-lesson-card-icon']}
					/>
				</div>
				<div className={`${Styles['LYT-card-body']} card-body`}>
					<div className="card-body-left">
						<h4></h4>
						<p>2024/10/5(日)</p>
						<h4>NTD 1500</h4>
					</div>
					<div className={`${Styles['LYT-card-body-right']} ms-auto`}>
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
