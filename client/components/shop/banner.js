import React from 'react';
import Styles from '@/components/shop/banner.module.scss';
import { FaSearch } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

export default function Banner({
	onKeywordChange,
	onRegionChange,
	onSortChange,
	applyFilters,
	onRecover,
	keyword,
	region,
	sortOrder,
}) {
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
		<div className={`${Styles['TIL-benner']}`}>
			<picture>
				<source
					media="(min-width: 1920px)"
					srcSet="/photos/background/bg-shop-banner.png"
				/>
				<source
					media="(max-width: 375px)"
					srcSet="/photos/background/bg-shop-benner-phone.png"
				/>
				<img
					src="/photos/background/bg-shop-banner.png"
					alt="Shop Banner"
					className="w-100"
				/>
			</picture>
			<h2>Parner精選商家</h2>
			<div className="w-100 h-100">
				<div className="w-100 filter-box d-flex justify-content-center gap-1 gap-sm-3 py-md-3 py-3 px-2">
					<div className={`${Styles['TIL-keyWord']} position-relative `}>
						<input
							value={keyword}
							type="text"
							className={`${Styles['CTH-keywords']} w-100 h-100`}
							placeholder="請輸入店家關鍵字搜尋"
							onChange={(e) => onKeywordChange(e.target.value)}
						/>
						<button
							className="btn position-absolute border-0"
							style={{ top: '0', right: '0', color: 'gray' }}
							onClick={onRecover}
						>
							<TiDelete size={25} className="ZRT-click-fast" />
						</button>
					</div>
					<select
						className={`${Styles['TIL-form-select']}`}
						value={region}
						onChange={(e) => onRegionChange(e.target.value)}
					>
						<option value="">地區</option>
						{areaItems.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
					<select
						className={`${Styles['TIL-form-select']} d-none d-sm-block`}
						value={sortOrder}
						onChange={(e) => onSortChange(e.target.value)}
					>
						<option value="" disabled>
							排序
						</option>
						<option value="asc">A-Z</option>
						<option value="desc">Z-A</option>
					</select>
					<button className={`${Styles['TIL-search']} ZRT-click`} onClick={applyFilters}>
						<FaSearch size={25} className={Styles['TIL-FaSearch']} />
					</button>
				</div>
			</div>
		</div>
	);
}
