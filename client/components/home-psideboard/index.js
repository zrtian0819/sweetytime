import React, { useState, useEffect } from 'react';
import sty from './home-psideboard.module.scss';
import Image from 'next/image';

export default function HomeSideBoard({ type, src }) {
	console.log(src);
	return (
		<>
			<div className={`${sty['board']} test-mode`}>
				<div className={`${sty['frameArea']}`}>
					<div className={`${sty['frame']}`}>
						<Image href={src} width={0} height={0} alt="" />
					</div>
				</div>
				<div className={`${sty['textArea']}`}>
					<div className={`${sty['text']}`}>精選商品</div>
					<div className={`${sty['text']}`}>
						Le salé nous nourrit, le sucré nous réjouit
					</div>
				</div>
				<div className={`${sty['ProductArea']}`}></div>
			</div>
		</>
	);
}
