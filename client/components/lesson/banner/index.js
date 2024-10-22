import React, { useState, useEffect } from 'react';
import Styles from './index.module.scss';
import Image from 'next/image';

export default function Banner(props) {
	return (
		<>
			<div className={Styles['CTH-banner']}>
				<div className={Styles['banner-left']}>
					<Image
						src={'/photos/lesson/00_cake_chestnut.png'}
						width={350}
						height={300}
						alt=""
						className={Styles['image']}
					/>
				</div>
				<div className={Styles['banner-right']}>
					<div>本月精選課程</div>
					<div className={Styles['content']}>
						<div>蒙布朗栗子蛋糕</div>
						<button>我要報名</button>
					</div>
				</div>
			</div>
			<div className={Styles['switch']}>
				<div className={Styles['icon']}>🍞</div>
				<div className={Styles['icon']}>🥞</div>
				<div className={Styles['icon']}>🥨</div>
				<div className={Styles['icon']}>🍫</div>
			</div>
		</>
	);
}
