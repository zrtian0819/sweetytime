import React, { useState, useEffect } from 'react';
import sty from './home-shop.module.scss';
import Link from 'next/link';

export default function HomeShop({ link = '', src = '/photos/ImgNotFound.png', width = 150 }) {
	return (
		<>
			<Link className={`${sty['shopLink']}`} href={link}>
				<div className={`ZRT-shopLogo ZRT-click ${sty['shopLogo']}`}></div>
			</Link>

			<style jsx>
				{`
					.ZRT-shopLogo {
						background: url(${src}) center center / cover;
						width: ${width}px;
					}
				`}
			</style>
		</>
	);
}
