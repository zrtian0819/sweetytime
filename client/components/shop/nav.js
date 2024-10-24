import React from 'react';
import styles from '@/components/shop/nav.module.scss';


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
				<img
					src="/photos/background/bg-shop-banner.png"
					alt={'nav-bgImage'}
					className={styles['TIL-Image']}
				/>
				<h2>Parner精選商家</h2>
				<div className={styles['TIL-select']}>
					<select className={styles['form-select']} aria-label="Default select example">
						<option defaultValue={area}>{area}</option>
						{areaItems.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
					<select className={styles['TIL-form-select']} aria-label="Default select example">
						<option defaultValue={sort}>{sort}</option>
						<option value="asc">A-Z</option>
						<option value="desc">Z-A</option>
					</select>
				</div>
			</div>
		</>
	);
}
