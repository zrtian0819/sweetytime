import React, { useState, useEffect } from 'react';
import Styles from './iconClassFilter.module.scss';
import Image from 'next/image';
import { BsCake2 } from 'react-icons/bs';
import { RxCookie } from 'react-icons/rx';
import { GiPieSlice } from 'react-icons/gi';
import { CiIceCream } from 'react-icons/ci';
import { LuDessert } from 'react-icons/lu';

export default function IconClassFilter({ styles }) {
	return (
		<>
			<div
				className="d-none d-md-flex justify-content-between align-items-center"
				style={styles}
			>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cupcake.svg"
						fill
					/> */}
					<BsCake2 className={`${Styles['icon']}`} title="蛋糕" />
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cake.svg"
						fill
					/> */}
					<RxCookie
						className={`${Styles['icon']}`}
						style={{ fontSize: '30px' }}
						title="餅乾"
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/filter-cakeSlice.svg"
						fill
					/> */}
					<GiPieSlice
						className={`${Styles['icon']}`}
						style={{ fontSize: '30px' }}
						title="塔 / 派"
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					{/* <Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/puff_primary.png"
						fill
					/> */}
					<CiIceCream
						className={`${Styles['icon']}`}
						style={{ fontSize: '32px' }}
						title="冰淇淋"
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/icon/iconClassFilter/canele_primary.png"
						fill
						title="可麗露"
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
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
					/>
				</div>
			</div>
		</>
	);
}
