import React, { useState, useEffect } from 'react';
import Styles from './iconClassFilter.module.scss';
import Image from 'next/image';
import { BsCake2 } from 'react-icons/bs';
import { RxCookie } from 'react-icons/rx';
import { GiPieSlice } from 'react-icons/gi';
import { CiIceCream } from 'react-icons/ci';
import { LuDessert } from 'react-icons/lu';

export default function IconClassFilter({ styles, lesson, onFilter }) {
	const handleIconClick = (event) => {
		const selectedClass = event.currentTarget.dataset.classid;
		const result = lesson.filter((data) => data.product_class_id == selectedClass);
		console.log(lesson);
		onFilter(result);
	};

	return (
		<>
			<div
				className="d-none d-md-flex justify-content-between align-items-center"
				style={styles}
			>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cupcake.svg"
						fill
					/> */}
					<BsCake2
						className={`${Styles['icon']}`}
						title="蛋糕"
						data-classid="1"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cake.svg"
						fill
					/> */}
					<RxCookie
						className={`${Styles['icon']}`}
						style={{ fontSize: '30px' }}
						title="餅乾"
						data-classid="2"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cakeSlice.svg"
						fill
					/> */}
					<GiPieSlice
						className={`${Styles['icon']}`}
						style={{ fontSize: '30px' }}
						title="塔 / 派"
						data-classid="3"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					<Image
						className={`${Styles['icon']}`}
						src="/icon/iconClassFilter/puff_primary.png"
						fill
						title="泡芙"
						data-classid="4"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/puff_primary.png"
						fill
					/> */}
					<CiIceCream
						className={`${Styles['icon']}`}
						style={{ fontSize: '32px' }}
						title="冰淇淋"
						data-classid="5"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					<Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/canele_primary.png"
						fill
						title="可麗露"
						data-classid="7"
						onClick={handleIconClick}
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4 ZRT-click-fast`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-croissant.svg"
						fill
					/> */}
					<Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cupcake.svg"
						fill
						title="其他"
						data-classid="6"
						onClick={handleIconClick}
					/>
				</div>
			</div>
		</>
	);
}
