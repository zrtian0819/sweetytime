import React from 'react';
import styles from '@/components/shop/nav.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

export default function Nav() {
	const area = '所在地區';
	const sort = '排序';
	const areaItems = [
		'北投區',
		'士林區',
		'大同區',
		'中山區',
		'松山區',
		'內湖區',
		'萬華區',
		'中正區',
		'大安區',
		'信義區',
		'南港區',
		'文山區',
	];

	return (
		<>
			<div className={styles['TIL-nav']}>
				<div className={styles['TIL-navImage']}>
					<Image
						src={`/photos/background/bg-shopList.png`}
						alt={'nav-bgImage'}
						width={550}
						height={550}
						className={styles['TIL-Image']}
						layout="responsive" //圖片撐開的關鍵指令
					/>
					<h2>Parner精選商家</h2>
				</div>
				<div className={styles['TIL-select']}>
					<select class={styles['form-select']} aria-label="Default select example">
						<option selected disabled>
							{area}
						</option>
						{areaItems.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
					<select class={styles['form-select']} aria-label="Default select example">
						<option selected>{sort}</option>
						<option value="asc">A-Z</option>
						<option value="desc">Z-A</option>
					</select>
				</div>
			</div>
		</>
	);
}
