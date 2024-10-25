import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Banner(props) {
	return (
		<>
			<div className={Styles['LYT-banner']}>
				<div className={Styles['banner-left']}>
					<Image
						src={'/photos/articles/applePie.jpg'}
						width={400}
						height={300}
						alt=""
						className={Styles['image']}
					/>
				</div>
				<div className={Styles['banner-right']}>
					<div></div>
					<div className={Styles['content']}>
						<div></div>
						<button className="btn">
							<FontAwesomeIcon icon={faArrowRight} size="2x" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
