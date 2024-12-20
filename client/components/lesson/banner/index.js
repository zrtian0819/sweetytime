import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Banner(props) {
	return (
		<>
			<div className={Styles['CTH-banner']}>
				<div className={Styles['banner-left']}>
					<Image
						src={'/photos/lesson/29_cake_nuts.png'}
						width={300}
						height={400}
						alt=""
						className={Styles['image']}
					/>
				</div>
				<div className={Styles['banner-right']}>
					<div>本月精選課程</div>
					<div className={Styles['content']}>
						<div>香草芒果山核桃聖多諾黑</div>
					</div>
				</div>
			</div>
		</>
	);
}
