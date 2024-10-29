import React, { useState, useEffect } from 'react';
import Styles from './iconClassFilter.module.scss';
import Image from 'next/image';

export default function IconClassFilter() {
	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-cupcake.svg"
						fill
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image className={Styles['icon']} src="/iconClassFilter/filter-cake.svg" fill />
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-cakeSlice.svg"
						fill
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-donuts.svg"
						fill
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-pineappleBread.svg"
						fill
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-croissant.svg"
						fill
					/>
				</div>
				<div className={`${Styles['iconContainer']} mx-sm-4`}>
					<Image
						className={Styles['icon']}
						src="/iconClassFilter/filter-cinnamonRoll.svg"
						fill
					/>
				</div>
			</div>
		</>
	);
}
