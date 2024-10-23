import React from 'react';
import styles from '@/components/shop/nav.module.scss';
import Image from 'next/image';

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
						src={`/photos/background/bg-shop-banner.png`}
						alt={'nav-bgImage'}
						width={1900}
						height={550}
						className={styles['TIL-Image']}
						priority
					/>
					<h2>Parner精選商家</h2>
				</div>
				<div className={styles['TIL-select']}>
					<select className={styles['form-select']} aria-label="Default select example">
						<option defaultValue={area}>
							{area}
						</option>
						{areaItems.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
					<select className={styles['form-select']} aria-label="Default select example">
						<option defaultValue={sort}>{sort}</option>
						<option value="asc">A-Z</option>
						<option value="desc">Z-A</option>
					</select>
				</div>
			</div>
		</>
	);
}
